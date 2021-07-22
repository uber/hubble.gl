// Copyright (c) 2021 Uber Technologies, Inc.
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
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import styled, {createGlobalStyle, ThemeProvider} from 'styled-components';
import window from 'global/window';
import {connect} from 'react-redux';
import {IntlProvider} from 'react-intl';
import {messages} from 'kepler.gl/localization';
import {theme} from 'kepler.gl/styles';
import {replaceLoadDataModal} from './factories/load-data-modal';
import {replaceMapControl} from './factories/map-control';
import {replacePanelHeader} from './factories/panel-header';
import {replaceSaveExportDropdown} from './factories/export-modal';
import {AUTH_TOKENS} from './constants/default-settings';
import {loadSampleConfigurations} from './actions';

import ExportVideo from './components/export-video';

// Sample data
/* eslint-disable no-unused-vars */
import sampleTripData, {testCsvData, sampleTripDataConfig} from './data/sample-trip-data';
import sampleAnimateTrip from './data/sample-animate-trip-data';
import {addDataToMap} from 'kepler.gl/actions';
import {processCsvData, processGeojson} from 'kepler.gl/processors';
/* eslint-enable no-unused-vars */

const KeplerGl = require('kepler.gl/components').injectComponents([
  replaceLoadDataModal(),
  replaceMapControl(),
  replacePanelHeader(),
  replaceSaveExportDropdown()
]);

const keplerGlGetState = state => state.demo.keplerGl;

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }

  *,
  *:before,
  *:after {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  li {
    margin: 0;
  }

  a {
    text-decoration: none;
    color: ${props => props.theme.labelColor};
  }

  .load-data-modal__tab__item {
    padding: 0;
  }

  .load-data-modal__tab__item.active {
    color: #fff
    border-bottom: 3px solid #fff;
  }

  .load-data-modal__tab {
    border-bottom: 1px solid #3A414C;
  }
`;

const WindowSize = styled.div`
  display: flex;
  flex-direction: column;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  font-family: ff-clan-web-pro, 'Helvetica Neue', Helvetica, sans-serif;
  font-weight: 400;
  font-size: 0.875em;
  line-height: 1.71429;
`;

// Custom localizations needed for export video modal
messages.en['exportVideoModal.animation'] = 'Animation Settings';
messages.en['exportVideoModal.export'] = 'Export Settings';
messages.en['toolbar.exportVideoModal'] = 'Export Video';

class App extends Component {
  state = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  componentDidMount() {
    // if we pass an id as part of the url
    // we ry to fetch along map configurations
    const {params: {id} = {}, location: {} = {}} = this.props;

    // Load sample using its id
    if (id) {
      this.props.dispatch(loadSampleConfigurations(id));
    }

    // load sample data
    this._loadSampleData();
  }

  _loadSampleData() {
    this._loadPointData();
    this._loadTripGeoJson();
  }

  _loadPointData() {
    this.props.dispatch(
      addDataToMap({
        datasets: {
          info: {
            label: 'Sample Taxi Trips in New York City',
            id: 'test_trip_data'
          },
          data: sampleTripData
        },
        options: {
          centerMap: true,
          readOnly: false
        },
        config: sampleTripDataConfig
      })
    );
  }

  _loadTripGeoJson() {
    this.props.dispatch(
      addDataToMap({
        datasets: [
          {
            info: {label: 'Trip animation'},
            data: processGeojson(sampleAnimateTrip)
          }
        ]
      })
    );
  }

  _getMapboxRef = (mapbox, index) => {
    if (!mapbox) {
      // The ref has been unset.
      // https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
      // console.log(`Map ${index} has closed`);
    } else {
      // We expect an InteractiveMap created by KeplerGl's MapContainer.
      // https://uber.github.io/react-map-gl/#/Documentation/api-reference/interactive-map
      const map = mapbox.getMap();
      map.on('zoomend', e => {
        // console.log(`Map ${index} zoom level: ${e.target.style.z}`);
      });
    }
  };

  render() {
    return (
      <IntlProvider locale="en" messages={messages.en}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <WindowSize>
            <ExportVideo />
            <div style={{transition: 'margin 1s, height 1s', flex: 1}}>
              <AutoSizer>
                {({height, width}) => (
                  <KeplerGl
                    mapboxApiAccessToken={AUTH_TOKENS.MAPBOX_TOKEN}
                    id="map"
                    /*
                     * Specify path to keplerGl state, because it is not mount at the root
                     */
                    getState={keplerGlGetState}
                    width={width}
                    height={height}
                  />
                )}
              </AutoSizer>
            </div>
          </WindowSize>
        </ThemeProvider>
      </IntlProvider>
    );
  }
}

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, dispatchToProps)(App);
