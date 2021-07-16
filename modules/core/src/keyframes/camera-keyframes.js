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
import Keyframes from './keyframes';
import {flyToViewport} from '@math.gl/web-mercator';
import {lerp} from '@math.gl/core';

const LINEARLY_INTERPOLATED_PROPS = ['bearing', 'pitch'];
const DEFAULT_OPTS = {
  speed: 1.2,
  // curve: 1.414
  // curve: Math.pow(6, 0.25)
  curve: 1.75
  // screenSpeed and maxDuration are used only if specified
};

export function flyToInterpolator(start, end, factor, options) {
  const viewport = flyToViewport(start, end, end.ease(factor), {
    ...DEFAULT_OPTS,
    ...options
  });

  // Linearly interpolate 'bearing' and 'pitch'.
  // If pitch/bearing are not supplied, they are interpreted as zeros in viewport calculation
  // (fallback defined in WebMercatorViewport)
  // Because there is no guarantee that the current controller's ViewState normalizes
  // these props, safe guard is needed to avoid generating NaNs
  for (const key of LINEARLY_INTERPOLATED_PROPS) {
    viewport[key] = lerp(start[key] || 0, end[key] || 0, end.ease(factor));
  }

  return viewport;
}

export default class CameraKeyFrames extends Keyframes {
  constructor({timings, keyframes, easings, interpolators, width, height}) {
    super({
      timings,
      keyframes,
      easings,
      interpolators,
      features: ['latitude', 'longitude', 'zoom', 'pitch', 'bearing']
    });

    this.width = width;
    this.height = height;
  }

  getFrame() {
    const factor = this.factor;
    const start = this.getStartData();
    const end = this.getEndData();

    if (end.interpolate === 'flyTo') {
      if (!this.width || !this.height) {
        throw new Error('width and height must be defined to use flyTo interpolator');
      }
      const maxDuration = this.getEndTime() - this.getStartTime();
      return flyToInterpolator({...start, width: this.width, height: this.height}, end, factor, {
        maxDuration
      });
    }

    return super.getFrame();
  }
}
