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

import React, {Component} from 'react';
import {connect} from 'react-redux';
import styled, {withTheme} from 'styled-components';

import {InjectKeplerUI, ExportVideoModal, ExportVideoPanelContainer} from '@hubble.gl/react';
// Redux stores/actions
import {toggleHubbleExportModal} from '../actions';
import {setFilter, setLayerAnimationTime} from 'kepler.gl/actions';

// Hook up mutual kepler imports
import {
  Button,
  Icons,
  Input,
  ItemSelector,
  Slider,
  LoadingSpinner,
  ModalTabsFactory,
  Play
} from 'kepler.gl/components';

const IconButton = styled(Button)`
  padding: 0;
  svg {
    margin: 0;
  }
`;

const KEPLER_UI = {
  IconButton,
  Button,
  Icons,
  Input,
  ItemSelector,
  Slider,
  LoadingSpinner,
  ModalTabsFactory,
  Play
};

const mapStateToProps = state => {
  return {mapData: state.demo.keplerGl.map, isVideoModalOpen: state.demo.app.isVideoModalOpen};
};

const mapDispatchToProps = {
  toggleHubbleExportModal,
  onFilterFrameUpdate: setFilter,
  onTripFrameUpdate: setLayerAnimationTime
};

class ExportVideo extends Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  handleClose() {
    this.props.toggleHubbleExportModal(false);
  }
  handleOpen() {
    this.props.toggleHubbleExportModal(true);
  }

  render() {
    const {mapData, theme, onFilterFrameUpdate, onTripFrameUpdate, isVideoModalOpen} = this.props;
    return (
      <InjectKeplerUI keplerUI={KEPLER_UI}>
        <div>
          <ExportVideoModal isOpen={isVideoModalOpen} theme={theme}>
            <ExportVideoPanelContainer
              handleClose={this.handleClose}
              mapData={mapData}
              onFilterFrameUpdate={onFilterFrameUpdate}
              onTripFrameUpdate={onTripFrameUpdate}
              exportVideoWidth={720}
            />
          </ExportVideoModal>
        </div>
      </InjectKeplerUI>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ExportVideo));
