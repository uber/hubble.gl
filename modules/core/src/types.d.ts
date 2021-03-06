import { Keyframes, CameraKeyframes } from "./keyframes";
import { FrameEncoder } from "./encoders";


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

interface EncoderSettings extends FormatConfigs {
  framerate: number
}

interface FormatConfigs {
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
    jpegQuality: number
  }
}

interface DeckSceneParams {
  timeline: any
  layerKeyframes: Object<string, Keyframes>
  cameraKeyframes: CameraKeyframes
}

interface KeplerSceneParams {
  timeline: any
  lengthMs: number
  width: number
  height: number
  keyframes: any[]
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
