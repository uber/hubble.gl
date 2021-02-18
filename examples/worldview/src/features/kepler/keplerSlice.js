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

import keplerGlReducer, {uiStateUpdaters} from 'kepler.gl/reducers';
import {AUTH_TOKENS} from '../../constants';
import {EXPORT_MAP_FORMATS} from 'kepler.gl/constants';

const {DEFAULT_EXPORT_MAP} = uiStateUpdaters;

export default keplerGlReducer.initialState({
  // In order to provide single file export functionality
  // we are going to set the mapbox access token to be used
  // in the exported file
  uiState: {
    exportMap: {
      ...DEFAULT_EXPORT_MAP,
      [EXPORT_MAP_FORMATS.HTML]: {
        ...DEFAULT_EXPORT_MAP[[EXPORT_MAP_FORMATS.HTML]],
        exportMapboxAccessToken: AUTH_TOKENS.EXPORT_MAPBOX_TOKEN
      }
    }
  },
  visState: {
    loaders: [], // Add additional loaders.gl loaders here
    loadOptions: {} // Add additional loaders.gl loader options here
  }
});
