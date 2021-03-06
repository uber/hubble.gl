// Copyright (c) 2021 Uber Technologies, Inc.
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

import React from 'react';
import {withTheme} from 'styled-components';

import {DEFAULT_BUTTON_HEIGHT, DEFAULT_BUTTON_WIDTH} from './constants';
import {WithKeplerUI} from '../inject-kepler';

import {PanelFooterInner, ButtonGroup} from './styled-components';

const ExportVideoPanelFooter = ({handlePreviewVideo, handleRenderVideo, rendering}) => (
  <WithKeplerUI>
    {({Button}) => (
      <PanelFooterInner className="export-video-panel__footer">
        <Button
          width={DEFAULT_BUTTON_WIDTH}
          height={DEFAULT_BUTTON_HEIGHT}
          secondary
          className={'export-video-button'}
          onClick={handlePreviewVideo}
          disabled={rendering}
        >
          Preview
        </Button>
        <ButtonGroup>
          <Button
            width={DEFAULT_BUTTON_WIDTH}
            height={DEFAULT_BUTTON_HEIGHT}
            className={'export-video-button'}
            onClick={handleRenderVideo}
            disabled={rendering}
          >
            Render
          </Button>
        </ButtonGroup>
      </PanelFooterInner>
    )}
  </WithKeplerUI>
);

export default withTheme(ExportVideoPanelFooter);
