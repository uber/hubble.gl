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

import {point} from '@turf/helpers';
import transformTranslate from '@turf/transform-translate';
import {WebMercatorViewport} from '@deck.gl/core';

export function scaleToVideoExport(viewState, container) {
  const viewport = new WebMercatorViewport(viewState);
  const nw = viewport.unproject([0, 0]);
  const se = viewport.unproject([viewport.width, viewport.height]);
  const videoViewport = new WebMercatorViewport({
    ...viewState,
    width: container.width,
    height: container.height
  }).fitBounds([nw, se]);
  const {height, width, latitude, longitude, pitch, zoom, bearing, altitude} = videoViewport;
  return {height, width, latitude, longitude, pitch, zoom, bearing, altitude};
}

/**
 * Parses camera type and creates keyframe for Hubble to use
 * @param {string} strCameraType of user-selected camera option ex: "Orbit (90º)"
 * @param {Object} viewState keyframe JSON that contains long, lat, zoom, bearing, pitch
 * @returns {Object} below:
 *      {
 *        longitude: modifiedViewState.longitude,
 *        latitude: modifiedViewState.latitude,
 *        zoom: modifiedViewState.zoom,
 *        bearing: modifiedViewState.bearing,
 *        pitch: modifiedViewState.pitch
 *      }
 *
 */
export function parseSetCameraType(strCameraType, viewState) {
  const modifiedViewState = {...viewState}; // Creating a shallow copy otherwise keyframes bugs out
  // Returns arr of important keywords. Should work for 2+ words in future ex: ["Orbit", "90"] | ["North", "South"] | ["Zoom", "In"]
  const match = strCameraType.match(/\b(?!to)\b\S+\w/g);
  // Converts mapState object to turf friendly Point obj (GEOJSON)
  const turfPoint = point([modifiedViewState.longitude, modifiedViewState.latitude]);
  if (match[0] === 'Orbit') {
    modifiedViewState.bearing = modifiedViewState.bearing + parseInt(match[1], 10);
  }

  // TODO future option that'll allow user to set X distance (km OR miles) directionally. Options inside turf
  // https://turfjs.org/docs/#transformTranslate
  const setChecker = new Set(['East', 'South', 'West', 'North']);
  if (setChecker.has(match[0])) {
    if (match[0] === 'East') {
      // TODO Temporary solution to catch this branch to master. Doesn't work for "East to North" for example if option allows in future
      const translatedPoly = transformTranslate(turfPoint, 10, 270);
      modifiedViewState.longitude = translatedPoly.geometry.coordinates[0];
    } else if (match[0] === 'South') {
      const translatedPoly = transformTranslate(turfPoint, 10, 0);
      modifiedViewState.latitude = translatedPoly.geometry.coordinates[1];
    } else if (match[0] === 'West') {
      const translatedPoly = transformTranslate(turfPoint, 10, 90);
      modifiedViewState.longitude = translatedPoly.geometry.coordinates[0];
    } else if (match[0] === 'North') {
      const translatedPoly = transformTranslate(turfPoint, 10, 180);
      modifiedViewState.latitude = translatedPoly.geometry.coordinates[1];
    }
  }

  if (match[0] === 'Zoom') {
    if (match[1] === 'In') {
      modifiedViewState.zoom = modifiedViewState.zoom + 3;
    } else if (match[1] === 'Out') {
      modifiedViewState.zoom = modifiedViewState.zoom - 3;
    }
  }
  return modifiedViewState;
}

/**
 * Used to convert durationMs (inherited from ExportVideoPanelContainer) to hh:mm:ss.ms
 * @param {number} durationMs duration of animation in milliseconds
 * @property {number} minutes test
 * @returns {string} time in format hh:mm:ss.ms
 */
export function msConversion(durationMs) {
  const milliseconds = Math.floor(durationMs % 1000);
  let seconds = Math.floor(durationMs / 1000) % 60;
  let minutes = Math.floor(durationMs / (1000 * 60)) % 60;
  // let hours = Math.floor(durationMs / (1000 * 60 * 60)) % 24, 10); // Hours can be used if needed in future

  // hours = hours < 10 ? `0${hours}` : hours;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  seconds = seconds < 10 ? `0${seconds}` : seconds;

  return `${minutes}:${seconds}.${milliseconds.toString()[0]}`;
}

const MB = 8 * 1024 * 1024;
// NOTE: Bit depth and compression ratio is a guess.
const COMPRESSION_RATIO = 0.8;
const BIT_DEPTH = 6;

/**
 * Estimates file size of resulting animation. All formulas are approximations
 * created with small sample of animations on default NY taxi trips data and
 * based off hubble's default framerate and the bitrate/depth of 3rd party encoders
 * @param {number} frameRate frame rate of animation (set by developer)
 * @param {array} resolution [width, height] of animation
 * @param {number} durationMs duration of animation (set by developer)
 * @param {string} mediaType 'GIF', 'WEBM', etc.
 * @returns {string} size in MB
 */
export function estimateFileSize(frameRate, resolution, durationMs, mediaType) {
  const seconds = Math.floor(durationMs / 1000);
  if (mediaType === 'gif') {
    // Based off of https://www.youtube.com/watch?v=DDcYvesZsnw for uncompressed video
    // Formula: ((horizontal * vertical * bit depth) / (8 * 1024 * 1024 [convert to megabyte MB])) * (frame rate * time in seconds) * compression ratio
    // Additional resource https://stackoverflow.com/questions/27559103/video-size-calculation
    return `${Math.floor(
      ((resolution[0] * resolution[1] * BIT_DEPTH) / MB) * (frameRate * seconds) * COMPRESSION_RATIO
    )} MB`;
  }
  if (mediaType === 'webm') {
    // Formula: multiplier (arbitrary unit created by analyzing bitrate of outputs) * Mb (megabit) * seconds * .125 (conversion from bit to byte)
    // frameRate determines Mb/s in animations with a lot of movement at 720p. Multiply by seconds and convert to MB (megabyte)
    return `${Math.ceil((resolution[0] / 1280) * frameRate * seconds * 0.125)} MB`;
  }
  if (mediaType === 'png') {
    // Note: Adds one frame to size to account for an extra frame when exporting to pictures.
    return `${Math.floor(
      ((resolution[0] * resolution[1] * BIT_DEPTH) / MB) *
        ((frameRate + 1) * seconds) *
        COMPRESSION_RATIO
    )} MB`;
  }
  if (mediaType === 'jpeg') {
    // Note: Adds one frame to size to account for an extra frame when exporting to pictures.
    return `${Math.floor(
      ((resolution[0] * resolution[1] * BIT_DEPTH) / MB) *
        ((frameRate + 1) * seconds) *
        (COMPRESSION_RATIO - 0.4)
    )} MB`;
  }
  return 'Size estimation unavailable';
}
