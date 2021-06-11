// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, {Component} from 'react';
import DeckGL from '@deck.gl/react';
import {StaticMap} from 'react-map-gl';
import {MapboxLayer} from '@deck.gl/mapbox';

import {deckStyle, timelineControlStyle, timelinePlayButtonStyle} from './constants';
import {RenderingSpinner} from './rendering-spinner';
import {WithKeplerUI} from '../inject-kepler';

export class ExportVideoPanelPreview extends Component {
  constructor(props) {
    super(props);
    const mapStyle = this.props.mapData.mapStyle;
    const mapStyleUrl = mapStyle.mapStyles[mapStyle.styleType].url;

    this.mapRef = React.createRef();
    this.deckRef = React.createRef();

    this.state = {
      timestamp: {
        latitude: 47.65,
        longitude: 7
      },
      mapStyle: mapStyleUrl, // Unsure if mapStyle would ever change but allowing it just in case
      glContext: undefined,
      memoDevicePixelRatio: window.devicePixelRatio // memoize
    };

    this._onLayerSetDomain = this._onLayerSetDomain.bind(this);
    this._renderLayer = this._renderLayer.bind(this);
    this._onMapLoad = this._onMapLoad.bind(this);
    this._resizeVideo = this._resizeVideo.bind(this);
    this._getContainerHeight = this._getContainerHeight.bind(this);

    this._resizeVideo();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resolution !== this.props.resolution) {
      this._resizeVideo();
    }
  }

  componentWillUnmount() {
    const {memoDevicePixelRatio} = this.state;
    this._setDevicePixelRatio(memoDevicePixelRatio);
  }

  _resizeVideo() {
    const {exportVideoWidth, resolution} = this.props;
    this._setDevicePixelRatio(resolution[0] / exportVideoWidth);
    if (this.mapRef.current) {
      const map = this.mapRef.current.getMap();
      map.resize();
    }
  }

  _setDevicePixelRatio(devicePixelRatio) {
    /**
     * TODO: This is the only way to trick mapbox into scaling its render buffer up
     * to match the desired resolution. It is built to always fit it's render buffer size
     * to it's CSS container size, which makes it impossible to make a small "preview" box.
     *
     * deck.gl has the useDevicePixels prop, which would have been used if it also changed mapbox.
     * https://github.com/visgl/luma.gl/pull/1155 for background.
     *
     * Compare implementations of luma.gl to mapbox for context:
     * https://github.com/visgl/luma.gl/blob/f622105e30c4dcda434f80ebc4680356003b12fa/modules/gltools/src/utils/device-pixels.js#L31
     * https://github.com/mapbox/mapbox-gl-js/blob/3136a53235cf17b732e84c9945c4e85ba3369a93/src/ui/map.js#L2324
     *
     * In luma the scaler can be overriden by useDevicePixels.
     *
     * The workaround is to change window.devicePixelRatio while the component is mounted to scale up the render buffers of deck and mapbox.
     * This is hacky and can cause issues in certain applications. We should try to produce a better solution.
     */
    // @ts-ignore
    window.devicePixelRatio = devicePixelRatio;
  }

  _onLayerSetDomain(idx, colorDomain) {
    // TODO: this isn't dispatched to the redux store yet.
    // layerConfigChange(this.props.mapData.visState.layers[idx], {
    //   colorDomain
    // });
  }

  _renderLayer(overlays, idx) {
    const {
      mapData: {visState, mapState}
    } = this.props;

    const {
      datasets,
      layers,
      layerData,
      hoverInfo,
      clicked,
      interactionConfig,
      animationConfig
    } = visState;

    const layer = layers[idx];
    const data = layerData[idx];
    const {gpuFilter} = datasets[layer.config.dataId] || {};

    const objectHovered = clicked || hoverInfo;
    const layerCallbacks = {
      onSetLayerDomain: val => this._onLayerSetDomain(idx, val)
    };

    // Layer is Layer class
    const layerOverlay = layer.renderLayer({
      data,
      gpuFilter,
      idx,
      interactionConfig,
      layerCallbacks,
      mapState,
      animationConfig,
      objectHovered
    });
    return overlays.concat(layerOverlay || []);
  }

  _getContainerHeight() {
    const {exportVideoWidth, resolution} = this.props;
    const aspectRatio = resolution[0] / resolution[1];
    return exportVideoWidth / aspectRatio;
  }

  createLayers() {
    // returns an arr of DeckGL layer objects
    const layerOrder = this.props.mapData.visState.layerOrder;
    return layerOrder
      .slice()
      .reverse()
      .reduce(this._renderLayer, []); // Slicing & reversing to create same layer order as Kepler
  }

  _onMapLoad() {
    // Adds mapbox layer to modal
    const map = this.mapRef.current.getMap();
    const deck = this.deckRef.current.deck;

    const keplerLayers = this.createLayers();

    map.addLayer(new MapboxLayer({id: 'my-deck', deck}));

    for (let i = 0; i < keplerLayers.length; i++) {
      // Adds DeckGL layers to Mapbox so Mapbox can be the bottom layer. Removing this clips DeckGL layers
      map.addLayer(new MapboxLayer({id: keplerLayers[i].id, deck}));
    }

    map.on('render', () =>
      this.props.adapter.onAfterRender(() => {
        this.forceUpdate();
      })
    );
  }

  render() {
    const {
      exportVideoWidth,
      rendering,
      viewState,
      setViewState,
      adapter,
      durationMs,
      handlePreviewVideo
    } = this.props;
    const {glContext, mapStyle} = this.state;

    const containerStyle = {
      width: `${exportVideoWidth}px`,
      height: `${this._getContainerHeight()}px`,
      position: 'relative'
    };

    return (
      <WithKeplerUI>
        {({Icons}) => (
          <>
            <div id="deck-canvas" style={containerStyle}>
              <DeckGL
                ref={this.deckRef}
                viewState={viewState}
                id="hubblegl-overlay"
                layers={this.createLayers()}
                style={deckStyle}
                controller={true}
                glOptions={{stencil: true}}
                onWebGLInitialized={gl => this.setState({glContext: gl})}
                onViewStateChange={setViewState}
                // onClick={visStateActions.onLayerClick}
                {...adapter.getProps({deckRef: this.deckRef, setReady: () => {}})}
              >
                {glContext && (
                  <StaticMap
                    ref={this.mapRef}
                    mapStyle={mapStyle}
                    preventStyleDiffing={true}
                    gl={glContext}
                    onLoad={this._onMapLoad}
                  />
                )}
              </DeckGL>
              <div id="timeline-controls" style={timelineControlStyle}>
                <Icons.Play style={timelinePlayButtonStyle} onClick={handlePreviewVideo} />
              </div>
            </div>
            {rendering && (
              <RenderingSpinner
                rendering={rendering}
                width={exportVideoWidth}
                height={this._getContainerHeight()}
                adapter={adapter}
                durationMs={durationMs}
              />
            )}
          </>
        )}
      </WithKeplerUI>
    );
  }
}
