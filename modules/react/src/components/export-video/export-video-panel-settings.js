// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, {useState} from 'react';
import {withTheme} from 'styled-components';

import {WithKeplerUI} from '../inject-kepler';

import EditTab from './modal-tab-edit';
import ExportTab from './modal-tab-export';
import get from 'lodash.get';

const getOptionValue = r => r.value;
const displayOption = r => r.label;
const getSelectedItems = (options, value) => options.find(o => o.value === value);

function ExportVideoPanelSettings({
  setMediaType,
  setCameraPreset,
  setFileName,
  setResolution,
  settingsData,
  durationMs,
  frameRate,
  resolution,
  mediaType,
  setDuration
}) {
  const loadingMethods = [
    // Each entry creates new tabs with ModalTabsFactory
    // id: The tab id in state
    // label: What the text of the tab will be
    // elementType: The component to render
    {
      id: 'export-modal-tab-export',
      label: 'exportVideoModal.export',
      elementType: ExportTab
    },
    {
      id: 'export-modal-tab-edit',
      label: 'exportVideoModal.edit',
      elementType: EditTab
    }
  ];
  const getDefaultMethod = methods => (Array.isArray(methods) ? get(methods, [0]) : null);
  const [currentMethod, toggleMethod] = useState(getDefaultMethod(loadingMethods));
  const ModalTab = currentMethod.elementType;

  return (
    <WithKeplerUI>
      {({ModalTabsFactory}) => {
        const ModalTabs = ModalTabsFactory();
        return (
          <div>
            <ModalTabs
              currentMethod={currentMethod.id}
              loadingMethods={loadingMethods}
              toggleMethod={toggleMethod}
            />
            {currentMethod && (
              <ModalTab // Represents all the params needed across all tabs
                settingsData={settingsData}
                setFileName={setFileName}
                getSelectedItems={getSelectedItems}
                getOptionValue={getOptionValue}
                displayOption={displayOption}
                setMediaType={setMediaType}
                setResolution={setResolution}
                durationMs={durationMs}
                setDuration={setDuration}
                frameRate={frameRate}
                resolution={resolution}
                mediaType={mediaType}
                setCameraPreset={setCameraPreset}
              />
            )}
          </div>
        );
      }}
    </WithKeplerUI>
  );
}

export default withTheme(ExportVideoPanelSettings);
