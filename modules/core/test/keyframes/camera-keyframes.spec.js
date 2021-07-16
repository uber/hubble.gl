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
import test from 'tape-catch';
import {CameraKeyframes, hold} from '@hubble.gl/core';
import {easing} from 'popmotion';
import {toLowPrecision} from '@deck.gl/test-utils';
import {
  flyToInterpolator
  // @ts-ignore
  // eslint-disable-next-line import/no-unresolved
} from '@hubble.gl/core/keyframes/camera-keyframes';

/* eslint-disable max-len */
const TEST_CASES = [
  {
    title: 'throw for missing prop',
    startProps: {longitude: -122.45, latitude: 37.78, zoom: 12},
    endProps: {longitude: -74, latitude: 40.7, zoom: 11},
    shouldThrow: true
  },
  {
    title: 'transition',
    expect: {
      start: {
        width: 800,
        height: 600,
        longitude: -122.45,
        latitude: 37.78,
        zoom: 12,
        pitch: 0,
        bearing: 0,
        ease: undefined,
        interpolate: undefined
      },
      end: {
        width: 800,
        height: 600,
        longitude: -74,
        latitude: 40.7,
        zoom: 11,
        pitch: 20,
        bearing: 0,
        ease: t => t,
        interpolate: 'linear'
      }
    },
    transition: {
      0.25: {longitude: -122.4184, latitude: 37.78194, zoom: 7.210047, bearing: 0, pitch: 5},
      0.5: {longitude: -106.3, latitude: 38.76683, zoom: 3.003175, bearing: 0, pitch: 10},
      0.75: {longitude: -74.12596, latitude: 40.69257, zoom: 6.212863, bearing: 0, pitch: 15}
    }
  }
];
/* eslint-enable max-len */

test('CameraKeyframes#flyToInterpolator', t => {
  TEST_CASES.filter(testCase => testCase.transition).forEach(testCase => {
    Object.keys(testCase.transition).forEach(time => {
      const propsInTransition = flyToInterpolator(
        testCase.expect.start,
        testCase.expect.end,
        Number(time)
      );
      t.deepEqual(toLowPrecision(propsInTransition, 7), testCase.transition[time], time);
    });
  });

  t.end();
});

test('Keyframes#CameraKeyframes', t => {
  const camera = new CameraKeyframes({
    timings: [0, 5000, 20000, 40000, 42000, 47000],
    keyframes: [
      {
        latitude: -37.82678508970569,
        longitude: 144.95979116686112,
        zoom: 9.8,
        pitch: 54,
        bearing: 0
      },
      {
        latitude: -37.82678508970569,
        longitude: 144.95979116686112,
        zoom: 9.8,
        pitch: 54,
        bearing: 0
      },
      {
        latitude: -37.82678508970569,
        longitude: 144.95979116686112,
        zoom: 9.8,
        pitch: 54,
        bearing: 15
      },
      {
        latitude: -37.82678508970569,
        longitude: 144.95979116686112,
        zoom: 9.8,
        pitch: 54,
        bearing: 0
      },
      {
        latitude: -37.82678508970569,
        longitude: 144.95979116686112,
        zoom: 9.8,
        pitch: 54,
        bearing: 0
      },
      {
        latitude: -37.82678508970569,
        longitude: 144.95979116686112,
        zoom: 9.5,
        pitch: 0,
        bearing: 0
      }
    ],
    easings: [hold, easing.easeInOut, easing.easeInOut, hold, easing.easeInOut]
  });

  // Prototype API
  // camera
  //   .add(0, {})
  //   .ease(linear)
  //   .add();

  t.looseEqual(
    camera.activeFeatures,
    {latitude: true, longitude: true, zoom: true, pitch: true, bearing: true},
    'All camera features active'
  );

  t.end();
});
