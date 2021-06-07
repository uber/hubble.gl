/* eslint-disable  max-statements */
import {
  WebMEncoder,
  JPEGSequenceEncoder,
  PNGSequenceEncoder,
  PreviewEncoder,
  GifEncoder
} from '@hubble.gl/core';
import {updateFrame} from '../timeline/timelineSlice';

import {
  setupRenderer,
  previewVideo,
  renderVideo,
  signalRendering,
  signalPreviewing,
  stopVideo,
  seekTime,
  encoderSettingsSelector,
  busySelector,
  durationSelector
} from './rendererSlice';

const ENCODERS = {
  gif: GifEncoder,
  webm: WebMEncoder,
  jpeg: JPEGSequenceEncoder,
  png: PNGSequenceEncoder
};

const formatSelector = state => state.hubbleGl.renderer.format;
const encoderSelector = state => ENCODERS[formatSelector(state)] || ENCODERS.webm;

export const rendererMiddleware = store => {
  let adapter;

  return next => action => {
    switch (action.type) {
      case setupRenderer.type: {
        if (busySelector(store.getState())) {
          adapter.stop(() => {
            store.dispatch(signalRendering(false)); // equivalent to signalPreviewing(false)
            adapter = action.payload;
          });
        } else {
          adapter = action.payload;
        }
        break;
      }
      case previewVideo.type: {
        const {getCameraKeyframes, getKeyframes, onStop} = action.payload;
        const state = store.getState();
        const encoderSettings = encoderSettingsSelector(state);
        const duration = durationSelector(state);
        store.dispatch(signalPreviewing(true));
        const innerOnStop = () => {
          store.dispatch(signalPreviewing(false));
          if (onStop) onStop();
        };

        adapter.scene.setDuration(duration);
        adapter.render({
          getCameraKeyframes,
          Encoder: PreviewEncoder,
          encoderSettings,
          onStop: innerOnStop,
          getKeyframes
        });
        break;
      }
      case renderVideo.type: {
        const {getCameraKeyframes, getKeyframes, onStop} = action.payload;
        const state = store.getState();
        const encoderSettings = encoderSettingsSelector(state);
        const duration = durationSelector(state);
        const Encoder = encoderSelector(state);

        store.dispatch(signalRendering(true));

        const innerOnStop = () => {
          store.dispatch(signalRendering(false));
          if (onStop) onStop();
        };

        adapter.scene.setDuration(duration);
        adapter.render({
          getCameraKeyframes,
          Encoder,
          encoderSettings,
          onStop: innerOnStop,
          getKeyframes
        });

        break;
      }
      case stopVideo.type: {
        if (busySelector(store.getState())) {
          adapter.stop(() => {
            store.dispatch(signalRendering(false)); // equivalent to signalPreviewing(false)
          });
        }
        break;
      }
      case seekTime.type: {
        if (!busySelector(store.getState()) && adapter && adapter.scene) {
          adapter.seek(action.payload);
          const sceneFrame = Object.entries(adapter.scene.keyframes).reduce(
            (frame, [key, keyframe]) => {
              frame[key] = keyframe.getFrame();
              return frame;
            },
            {}
          );
          store.dispatch(updateFrame(sceneFrame));
        }
        break;
      }
      default: {
        break;
      }
    }

    next(action);
  };
};
