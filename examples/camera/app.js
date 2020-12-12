import React, {useState, useRef} from 'react';
import DeckGL from '@deck.gl/react';
import {DeckAdapter, CameraKeyframes} from '@hubble.gl/core';
import {useNextFrame, BasicControls, ResolutionGuide} from '@hubble.gl/react';
import {sceneBuilder} from './scene';
import {layers} from './layers';
import {vignette, fxaa} from '@luma.gl/shadertools';
import {PostProcessEffect} from '@deck.gl/core';
import {easing} from 'popmotion';

const INITIAL_VIEW_STATE = {
  longitude: -122.4,
  latitude: 37.74,
  zoom: 11,
  pitch: 30,
  bearing: 0
};

const adapter = new DeckAdapter(sceneBuilder);

/** @type {import('@hubble.gl/core/src/types').FrameEncoderSettings} */
const encoderSettings = {
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
  mp4: {}
};

const aaEffect = new PostProcessEffect(fxaa, {});
const vignetteEffect = new PostProcessEffect(vignette, {});

export default function App() {
  const deckgl = useRef(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE); // Added to maintain user's interactions with viewState
  const nextFrame = useNextFrame();

  const updateCamera = prevCamera => {
    // Set by User
    prevCamera = new CameraKeyframes({
      timings: [0, 5000],
      keyframes: [
        {
          longitude: viewState.longitude,
          latitude: viewState.latitude,
          zoom: viewState.zoom,
          pitch: viewState.pitch,
          bearing: viewState.bearing
        },
        {
          longitude: viewState.longitude,
          latitude: viewState.latitude,
          zoom: viewState.zoom,
          bearing: viewState.bearing + 92,
          pitch: viewState.pitch
        }
      ],
      easings: [easing.easeInOut]
    });

    return prevCamera;
  };

  return (
    <div style={{position: 'relative'}}>
      <div style={{position: 'absolute'}}>
        <ResolutionGuide />
      </div>
      <DeckGL
        ref={deckgl}
        parameters={{
          depthTest: false,
          clearColor: [61 / 255, 20 / 255, 76 / 255, 1]
          // blend: true,
          // blendEquation: GL.FUNC_ADD,
          // blendFunc: [GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA]
        }}
        viewState={viewState}
        onViewStateChange={({viewState: vs}) => {
          setViewState(vs);
        }}
        controller={true}
        effects={[vignetteEffect, aaEffect]}
        layers={layers}
        {...adapter.getProps(deckgl, setReady, nextFrame)}
      />
      <div style={{position: 'absolute'}}>
        {ready && (
          <BasicControls
            adapter={adapter}
            busy={busy}
            setBusy={setBusy}
            encoderSettings={encoderSettings}
            updateCamera={updateCamera}
          />
        )}
      </div>
    </div>
  );
}
