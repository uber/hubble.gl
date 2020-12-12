import { FrameEncoder } from "./encoders";
import { DeckScene } from "./scene";

type CaptureStepSuccess = {
  kind: 'step'
  nextTimeMs: number
}

type CaptureStepError = {
  kind: 'error'
  error: 'NOT_RECORDING' | 'STOP' | string
}

type CaptureStep = CaptureStepSuccess | CaptureStepError

type DeckGl = {
  animationLoop: {
    timeline: {
      setTime: (arg0: number) => void;
    };
  }; canvas: any;
}

type FrameEncoderSettings = Partial<EncoderSettings>

interface EncoderSettings {
  startOffsetMs?: number
  durationMs?: number
  filename: string
  framerate: number
  jpeg: {
    quality: number
  },
  webm: {
    quality: number
  }
  gif: {
    numWorkers: number,
    sampleInterval: number,
    width: number,
    height: number
  },
  mp4: {
    width: number,
    height: number
  }
}

interface DeckSceneParams {
  animationLoop: any
  lengthMs: number
  width: number
  height: number
  keyframes: any
  data: any
  currentCamera: any
  renderLayers: (scene: DeckScene) => any[]
}

interface KeplerSceneParams {
  animationLoop: any
  lengthMs: number
  width: number
  height: number
  keyframes: any[]
  data: any
  filters: any[]
  getFrame: (keplerGl: any, keyframes: any[], filters: any[]) => any
}


// declare module 'src/hubble.gl' {
//   interface IFrameEncoder extends Encoder {
//     extension: string;
//     filename: string;
//     mimeType: string;
//     settings: Settings;
//     constructor(settings: Settings);
//   }

//   export interface FrameEncoder implements IFrameEncoder {}
// }

// export module 'hubble.gl/src/encoders/FrameEncoder' {
//   interface IFrameEncoder extends Encoder {
//     extension: string;
//     filename: string;
//     mimeType: string;
//     settings: Settings;
//     constructor(settings: Settings);
//   }

//   interface FrameEncoder implements IFrameEncoder {}

//   // declare var FrameEncoder: {
//   //   prototype: FrameEncoder;
//   //   new(): FrameEncoder;
//   // }
// }

// /**
//  * @typedef {Object} Settings
//  * @property {string} name
//  * @property {number} workers
//  * @property {number} quality
//  * @property {string} workersPath
//  * @property {number} step
//  * @property {number} framerate
//  * @property {(progress: number) => void} onProgress
//  */
