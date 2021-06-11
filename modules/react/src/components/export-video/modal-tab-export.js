import React, {useState} from 'react';

import {estimateFileSize} from './utils';
import {StyledLabelCell, StyledValueCell, InputGrid} from './styled-components';
import {
  DEFAULT_FILENAME,
  DEFAULT_BUTTON_HEIGHT,
  DEFAULT_BUTTON_WIDTH,
  FORMATS,
  RESOLUTIONS
} from './constants';
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
  handleRenderVideo,
  rendering
}) {
  const [aspRatio, setAspRatio] = useState('16:9');

  return (
    <WithKeplerUI>
      {({Input, ItemSelector, Button}) => (
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
            <StyledLabelCell>Aspect Ratio</StyledLabelCell>
            <ItemSelector
              selectedItems={aspRatio}
              options={['4:3', '16:9']}
              multiSelect={false}
              searchable={false}
              onChange={ratio => {
                setAspRatio(ratio);
                if (aspRatio === '4:3') {
                  settingsData.resolution = '1280x720';
                } else {
                  settingsData.resolution = '1280x960';
                }
                setResolution(settingsData.resolution);
              }}
            />
            <StyledLabelCell>Quality</StyledLabelCell>
            <ItemSelector
              selectedItems={getSelectedItems(RESOLUTIONS, settingsData.resolution)}
              options={RESOLUTIONS.filter(o => o.aspectRatio === aspRatio)}
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
            <Button
              width={DEFAULT_BUTTON_WIDTH}
              height={DEFAULT_BUTTON_HEIGHT}
              className={'export-video-button'}
              onClick={handleRenderVideo}
              disabled={rendering}
            >
              Render
            </Button>
          </InputGrid>
        </>
      )}
    </WithKeplerUI>
  );
}

export default ExportTab;
