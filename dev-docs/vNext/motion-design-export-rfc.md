# RFC: Integration - 3D Motion Video Editing Software

* Authors: Chris Gervang
* Date: October, 2020
* Status: **Draft**

## Overview

This proposal outlines a series of features to enable faster and more effective collaboration between engineering and motion design teams. This can be achieved by exporting video assets and data to sync compositions.

## Problem

Currently motion designers can import videos of visualizations created with vis.gl into 3D composition software, such as AfterEffects or 3DS max, but in doing so the visualization is flattened and all metadata about the motion of the scene is lost. This limits a motion designers ability to advance design tools, and also limits an engineers ability to integrate real data sets in edited videos.

Motion designers currently either recreate a rendition of an engineers data, or spend additional effort with the engineer to polish the appearance in code - either way the result is often prohibitively time consuming, and the work is highly specialized.

## Proposal

Export data from the vis.gl ecosystem in a native format for popular motion design software.

- Production designers save time reusing the existing visualizations instead of recreating them from scratch.
- Engineers save time programming polish into their visualizations.
- Stakeholders are offered greater alignment between their audience and technology since the data can speak for itself.

### Camera Data Export

Export camera FOV, keyframes, and coordinates so that designers can sync camera movements between visualization and composition.

### Null Value Data Export

Export 3d position of invisible anchor points on the ground plane so that designers can position new assets into the visualization.

### Layer Mask Shader Extension

Create a layer mask shader so that designers can place new assets behind visualization layers.

A layer mask shader isolates a layer by recoloring the screen black in all negative space and white in a layer's positive space. This can then be encoded videos for use as a mask.

### Alpha Channel Render Procedure

Create a rendering procedure that cycles through each layer, configuring all but one at a time to be visible, and then renders video of each isolated layer with an alpha color channel.

The PNG Sequence and WEBM formats support alpha channels.

