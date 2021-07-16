# RFC: Feature - Recorded "Magic" Keyframes in stateful applications

* Authors: Chris Gervang
* Date: Nov, 2020
* Status: **Draft**

## Problem

Users need a method to _quickly_ and _automatically_ define an animation with hubble.gl.

Current techniques for defining animation keyframes are either easy-to-use but limited, or tedious but powerful. For example, the kepler.gl camera animation presets are easy to use, but hardcoded and not extendable. On the other hand the Keyframes engine can be set up to animate any aspect of data or visual properties, but requires high effort specialized programming and needs to defined ahead of runtime.

## Solution

The ideal solution is one which can magically animate any change in visual appearance or data query. Ultimately, a magic keyframe needs to translate into a fluid visual appearance, which can be interpolated to transition from one keyframe to the next.

- Keyframe contains state representing appearance.
- State can be interpolated between to transition animation.
- Application provides a pure (side-effect free) translation between state and appearance.

For example, we can take advantage of state stores, like kepler.gl's redux store, by introducing a method for recording snapshots of state in a keyframe. We can also take advantage of deck.gl's declaratively defined properties to store what they are set to in a sequence of keyframes as the user manipulates them, but in the case of directly interfacing with deck.gl an additional translation plugin would need to be developed (similar to kepler's). 

