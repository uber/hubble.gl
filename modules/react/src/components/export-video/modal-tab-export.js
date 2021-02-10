import React from 'react';

import {estimateFileSize} from './utils';
import {StyledLabelCell, StyledValueCell, InputGrid} from './styled-components';
import {DEFAULT_FILENAME, FORMATS, RESOLUTIONS} from './constants';
import {WithKeplerUI} from '../inject-kepler';

function ExportTab({
  settingsData,
  setFileName,
  getSelectedItems,
  getOptionValue,
  displayOption,
  setMediaType,
  setResolution,
  durationMs,
  frameRate,
  resolution,
  mediaType,
  setCameraPreset
}) {
  return (
    <WithKeplerUI>
      {({Input, ItemSelector}) => (
        <>
          <InputGrid rows={5}>
            <StyledLabelCell>File Name</StyledLabelCell>
            <Input
              value={settingsData.fileName}
              placeholder={DEFAULT_FILENAME}
              onChange={e => setFileName(e.target.value)}
            />
            <StyledLabelCell>Media Type</StyledLabelCell>
            <ItemSelector
              selectedItems={getSelectedItems(FORMATS, settingsData.mediaType)}
              options={FORMATS}
              getOptionValue={getOptionValue}
              displayOption={displayOption}
              multiSelect={false}
              searchable={false}
              onChange={setMediaType}
            />
            <StyledLabelCell>Resolution</StyledLabelCell>
            <ItemSelector
              selectedItems={getSelectedItems(RESOLUTIONS, settingsData.resolution)}
              options={RESOLUTIONS}
              getOptionValue={getOptionValue}
              displayOption={displayOption}
              multiSelect={false}
              searchable={false}
              onChange={setResolution}
            />
            <StyledLabelCell>File Size</StyledLabelCell>
            <StyledValueCell>
              ~{estimateFileSize(frameRate, resolution, durationMs, mediaType)}
            </StyledValueCell>
          </InputGrid>
          <InputGrid rows={1}>
            <StyledLabelCell>Camera</StyledLabelCell>
            <ItemSelector
              selectedItems={settingsData.cameraPreset}
              options={[
                'None',
                'Orbit (90º)',
                'Orbit (180º)',
                'Orbit (360º)',
                'North to South',
                'South to North',
                'East to West',
                'West to East',
                'Zoom Out',
                'Zoom In'
              ]}
              multiSelect={false}
              searchable={false}
              onChange={setCameraPreset}
            />
          </InputGrid>
        </>
      )}
    </WithKeplerUI>
  );
}

export default ExportTab;