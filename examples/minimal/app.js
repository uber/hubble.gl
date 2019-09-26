import React, {useState, useRef} from 'react';
import DeckGL from '@deck.gl/react';
import {DeckAdapter, WebMEncoder} from '@hubble.gl/core';
import {useNextFrame, BasicControls} from '@hubble.gl/react';
import {sceneBuilder} from './scene';

const INITIAL_VIEW_STATE = {
  longitude: -122.4,
  latitude: 37.74,
  zoom: 11,
  pitch: 30,
  bearing: 0
};

const adapter = new DeckAdapter(sceneBuilder, WebMEncoder);

export default function App() {
  const deckgl = useRef(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const nextFrame = useNextFrame();

  if (busy) {
    adapter.update(nextFrame);
  }

  return (
    <div style={{position: 'relative'}}>
      <DeckGL
        width={720}
        height={480}
        ref={deckgl}
        initialViewState={INITIAL_VIEW_STATE}
        {...adapter.getProps(deckgl, setReady, nextFrame)}
      />
      <div style={{position: 'absolute'}}>
        {ready && <BasicControls adapter={adapter} busy={busy} setBusy={setBusy} />}
      </div>
    </div>
  );
}