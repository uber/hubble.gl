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

/* eslint-disable no-console */
/* global console, document */
import { canvasToArrayBuffer } from '../utils';
import loadEncoder from 'mp4-h264';
import FrameEncoder from '../frame-encoder';

/**
 * MP4 Encoder
 */
class MP4Encoder extends FrameEncoder {
  /** @type {any} */
  Encoder;

  /** @param {import('types').FrameEncoderSettings} settings */
  constructor(settings) {
    super(settings);
    this.quality = 0.8;
    if (settings.mp4) {
      this.options = settings;
    }

    this.options.width = this.options.width || 720;
    this.options.height = this.options.height || 480;
    
    (async () => {
      // Load the WASM module first
      this.Encoder = await loadEncoder();
    })()

    this.extension = '.mp4';
    this.mimeType = 'video/mp4';

    this.encoder = null;
    this.start = this.start.bind(this);
    this.add = this.add.bind(this);
    this.save = this.save.bind(this);
  }

  start() {
    // Create a new encoder interface
    this.encoder = this.Encoder.create({
      ...this.options,
      fps: this.framerate
    });
  }

  /** @param {HTMLCanvasElement} canvas */
  async add(canvas) {
    return canvasToArrayBuffer(canvas, 'image/jpeg', 0.8)
      .then(buffer => this.encoder.encodeRGB(buffer));
  }

  /**
   * @return {Promise<Blob>}
   */
  async save() {
    return new Promise(resolve => {
      // Finish encoder to get back uint8 MP4 data
      const mp4 = this.encoder.end();
      const blob = new Blob([mp4], { type: "video/mp4" });
      resolve(blob);
    })
  }
}

export default MP4Encoder;
