import React from 'react';

import {msConversion} from './utils';
import {SliderWrapper, StyledLabelCell, StyledValueCell, InputGrid} from './styled-components';
import {WithKeplerUI} from '../inject-kepler';

function EditTab({durationMs, setDuration, setCameraPreset, settingsData}) {
  return (
    <WithKeplerUI>
      {({Slider, ItemSelector}) => (
        <>
          <InputGrid rows={5}>
            <StyledLabelCell>Duration</StyledLabelCell>
            <StyledValueCell style={{paddingLeft: '0px', paddingRight: '0px'}}>
              <SliderWrapper
                style={{width: '100%', marginLeft: '0px'}}
                className="modal-duration__slider"
              >
                <Slider
                  showValues={false}
                  enableBarDrag={true}
                  isRanged={false}
                  value1={durationMs}
                  step={100}
                  minValue={100}
                  maxValue={10000}
                  style={{width: '70px'}}
                  onSlider1Change={val => {
                    setDuration(val);
                  }}
                />
                <div style={{alignSelf: 'center', paddingLeft: '8px', width: '56px'}}>
                  {msConversion(durationMs)}
                </div>
              </SliderWrapper>
            </StyledValueCell>
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

export default EditTab;
