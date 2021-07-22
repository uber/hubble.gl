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

export const DEFAULT_ICON_BUTTON_HEIGHT = '16px';
export const DEFAULT_BUTTON_HEIGHT = '32px';
export const DEFAULT_BUTTON_WIDTH = '64px';
export const DEFAULT_PADDING = 32;
export const DEFAULT_ROW_GAP = 16;
export const DEFAULT_SETTINGS_WIDTH = 280;

export const DEFAULT_FILENAME = 'kepler.gl';

export const SIDEPANEL_WIDTH = 300;

export const FORMATS = [
  {
    value: 'gif',
    label: 'GIF'
  },
  {
    value: 'webm',
    label: 'WebM Video'
  },
  {
    value: 'png',
    label: 'PNG Sequence'
  },
  {
    value: 'jpeg',
    label: 'JPEG Sequence'
  }
];

export const RESOLUTIONS = [
  {
    value: '960x540',
    label: 'Good (540p)',
    width: 960,
    height: 540,
    aspectRatio: '16:9'
  },
  {
    value: '1280x720',
    label: 'High (720p)',
    width: 1280,
    height: 720,
    aspectRatio: '16:9'
  },
  {
    value: '1920x1080',
    label: 'Highest (1080p)',
    width: 1920,
    height: 1080,
    aspectRatio: '16:9'
  },
  {
    value: '640x480',
    label: 'Good (480p)',
    width: 640,
    height: 480,
    aspectRatio: '4:3'
  },
  {
    value: '1280x960',
    label: 'High (960p)',
    width: 1280,
    height: 960,
    aspectRatio: '4:3'
  },
  {
    value: '1920x1440',
    label: 'Highest (1440p)',
    width: 1920,
    height: 1440,
    aspectRatio: '4:3'
  }
];

export const isResolution = value => option => option.value === value;

export function getResolutionSetting(value) {
  return RESOLUTIONS.find(isResolution(value)) || RESOLUTIONS[0];
}

export const deckStyle = {
  width: '100%',
  height: '100%',
  position: 'relative'
};

export const timelineControlStyle = {
  position: 'relative',
  display: 'flex',
  justifyContent: 'center'
};

export const timelinePlayButtonStyle = {
  cursor: 'pointer',
  height: '50px',
  width: '50px',
  fill: '#FFF'
};
