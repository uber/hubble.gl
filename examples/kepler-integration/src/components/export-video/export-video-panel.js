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
import styled, {withTheme} from 'styled-components';
import {Button, Icons} from 'kepler.gl/components';

import ExportVideoPanelSettings from './export-video-panel-settings';
import ExportVideoPanelFooter from './export-video-panel-footer';
import {ExportVideoPanelPreview} from './export-video-panel-preview'; // Not yet part of standard library. TODO when updated
import {parseSetCameraType} from './parse-set-camera-type';
import {DEFAULT_PADDING, DEFAULT_ICON_BUTTON_HEIGHT} from './constants';

import {easing} from 'popmotion';

import {
  DeckAdapter,
  DeckScene,
  CameraKeyframes,
  WebMEncoder,
  JPEGSequenceEncoder,
  PNGSequenceEncoder,
  PreviewEncoder,
  GifEncoder
} from '@hubble.gl/core';

// import {DEFAULT_TIME_FORMAT} from 'kepler.gl';
// import moment from 'moment';
import {messages} from 'kepler.gl/localization';
import {IntlProvider} from 'react-intl';

// function setFileNameDeckAdapter(name) {
//   encoderSettings.filename = `${name} ${moment()
//     .format(DEFAULT_TIME_FORMAT)
//     .toString()}`;
// }

/* function setResolution(resolution){
  if(resolution === 'Good (540p)'){
    adapter.scene.width = 960;
    adapter.scene.height = 540;
  }else if(resolution === 'High (720p)'){
    adapter.scene.width = 1280;
    adapter.scene.height = 720;
  }else if(resolution === 'Highest (1080p)'){
    adapter.scene.width = 1920;
    adapter.scene.height = 1080;
  }
}*/

// TODO:

// Changes Timestamp function
// Camera function (preset keyframes) DONE
// File Name function DONE
// MediaType function DONE
// Quality function
// Set Duration function
// Calculate File Size function
// Render Function DONE

const IconButton = styled(Button)`
  padding: 0;
  svg {
    margin: 0;
  }
`;

const PanelCloseInner = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: ${DEFAULT_PADDING} ${DEFAULT_PADDING} 0 ${DEFAULT_PADDING};
`;

const PanelClose = ({handleClose}) => (
  <PanelCloseInner className="export-video-panel__close">
    <IconButton className="export-video-panel__button" link onClick={handleClose}>
      <Icons.Delete height={DEFAULT_ICON_BUTTON_HEIGHT} />
    </IconButton>
  </PanelCloseInner>
);

const StyledTitle = styled.div`
  color: ${props => props.theme.titleTextColor};
  font-size: 20px;
  font-weight: 400;
  line-height: ${props => props.theme.lineHeight};
  padding: 0 ${DEFAULT_PADDING} 16px ${DEFAULT_PADDING};
`;

const PanelBodyInner = styled.div`
  padding: 0 ${DEFAULT_PADDING};
  display: grid;
  grid-template-columns: 480px auto;
  grid-template-rows: 460px;
  grid-column-gap: 20px;
`;

const PanelBody = ({
  mapData,
  encoderSettings,
  adapter,
  setViewState,
  setMediaType,
  setCameraPreset,
  setFileName /* , setQuality*/,
  settingsData
}) => (
  <PanelBodyInner className="export-video-panel__body">
    <ExportVideoPanelPreview
      mapData={mapData}
      encoderSettings={encoderSettings}
      adapter={adapter}
      setViewState={setViewState}
    />
    <ExportVideoPanelSettings
      setMediaType={setMediaType}
      setCameraPreset={setCameraPreset}
      setFileName={setFileName} /* , setQuality*/
      settingsData={settingsData}
    />
  </PanelBodyInner>
);

const Panel = styled.div`
  width: ${props => props.settingsWidth}px;
`;

class ExportVideoPanel extends Component {
  static defaultProps = {
    settingsWidth: 980
  };

  constructor(props) {
    super(props);

    this.setMediaTypeState = this.setMediaTypeState.bind(this);
    this.setCameraPreset = this.setCameraPreset.bind(this);
    this.setFileName = this.setFileName.bind(this);
    // this.setQuality = this.setQuality.bind(this);
    this.getCameraKeyframes = this.getCameraKeyframes.bind(this);
    this.getDeckScene = this.getDeckScene.bind(this);
    this.onPreviewVideo = this.onPreviewVideo.bind(this);
    this.onRenderVideo = this.onRenderVideo.bind(this);

    this.state = {
      mediaType: 'GIF',
      cameraPreset: 'None',
      fileName: 'Video Name',
      //  quality: "High (720p)",
      viewState: this.props.mapData.mapState,
      durationMs: 1000,
      encoderSettings: {
        framerate: 30,
        webm: {
          quality: 0.8
        },
        jpeg: {
          quality: 0.8
        },
        gif: {
          sampleInterval: 1000
        },
        filename: 'kepler.gl'
      },
      adapter: new DeckAdapter(this.getDeckScene)
    };
  }

  getCameraKeyframes(prevCamera = undefined) {
    const {viewState, cameraPreset, durationMs} = this.state;

    return new CameraKeyframes({
      timings: [0, durationMs],
      keyframes: [
        {
          longitude: viewState.longitude,
          latitude: viewState.latitude,
          zoom: viewState.zoom,
          pitch: viewState.pitch,
          bearing: viewState.bearing
        },
        parseSetCameraType(cameraPreset, viewState)
      ],
      easings: [easing.easeInOut]
    });
  }

  getDeckScene(animationLoop) {
    const keyframes = {
      camera: this.getCameraKeyframes()
    };
    const currentCamera = animationLoop.timeline.attachAnimation(keyframes.camera);

    return new DeckScene({
      animationLoop,
      keyframes,
      lengthMs: this.state.durationMs, // TODO change to 5000 later. 1000 for dev testing
      width: 480,
      height: 460,
      currentCamera
    });
  }

  setMediaTypeState(media) {
    this.setState({
      mediaType: media
    });
  }
  setCameraPreset(option) {
    this.setState({
      cameraPreset: option
    });
  }
  setFileName(name) {
    this.setState({
      fileName: name.target.value
    });
    // setFileNameDeckAdapter(name.target.value);
  }
  /* setQuality(resolution){
    this.setState({
      quality: resolution
    });
    setResolution(resolution);
  }*/

  onPreviewVideo() {
    const {adapter, encoderSettings} = this.state;

    const onStop = () => {};
    adapter.render(PreviewEncoder, encoderSettings, onStop, this.getCameraKeyframes);
  }

  onRenderVideo() {
    const {adapter, encoderSettings, mediaType} = this.state;
    let Encoder = PreviewEncoder;
    const onStop = () => {};

    if (mediaType === 'WebM Video') {
      Encoder = WebMEncoder;
    } else if (mediaType === 'PNG Sequence') {
      Encoder = PNGSequenceEncoder;
    } else if (mediaType === 'JPEG Sequence') {
      Encoder = JPEGSequenceEncoder;
    } else if (mediaType === 'GIF') {
      Encoder = GifEncoder;
    }

    adapter.render(Encoder, encoderSettings, onStop, this.getCameraKeyframes);
  }

  render() {
    const {settingsWidth, handleClose, mapData} = this.props;
    const settingsData = {
      mediaType: this.state.mediaType,
      cameraPreset: this.state.cameraPreset,
      fileName: this.state.fileName,
      resolution: this.state.quality
    };

    const {exportSettings, adapter} = this.state;

    return (
      <IntlProvider locale="en" messages={messages.en}>
        <Panel settingsWidth={settingsWidth} className="export-video-panel">
          <PanelClose handleClose={handleClose} />
          <StyledTitle className="export-video-panel__title">Export Video</StyledTitle>
          <PanelBody
            mapData={mapData}
            exportSettings={exportSettings}
            adapter={adapter}
            setMediaType={this.setMediaTypeState}
            setCameraPreset={this.setCameraPreset}
            setFileName={this.setFileName}
            //  setQuality={this.setQuality}
            settingsData={settingsData}
            setViewState={viewState => {
              this.setState({viewState});
            }}
          />
          <ExportVideoPanelFooter
            handleClose={handleClose}
            handlePreviewVideo={this.onPreviewVideo}
            handleRenderVideo={this.onRenderVideo}
          />
        </Panel>
      </IntlProvider>
    );
  }
}

export default withTheme(ExportVideoPanel);
