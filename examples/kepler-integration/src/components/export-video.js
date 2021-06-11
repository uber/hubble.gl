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

import React, {Component} from 'react';
import {connect} from 'react-redux';
import styled, {withTheme} from 'styled-components';

import {InjectKeplerUI, ExportVideoModal, ExportVideoPanelContainer} from '@hubble.gl/react';

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

// Redux stores/actions
// import {connect as keplerGlConnect} from 'kepler.gl';
import toggleHubbleExportModal from 'kepler.gl'; // TODO make custom action

const mapStateToProps = state => {
  return {mapData: state.demo.keplerGl.map};
};

// NOTE: This commented out code is here to connect to Redux store in future
// function mapStateToProps(state = {}, props) {
//     return { // TODO unsure if other redux stores are needed atm
//       ...props,
//       visState: state.visState,
//       mapStyle: state.mapStyle,
//       mapState: state.mapState,
//       uiState: state.uiState,
//       providerState: state.providerState,
//     };
// }

// NOTE: This commented out code is here to connect to Redux store in future
// noResultDispatch returns nothing in this case. Undefined if console.log
// because we're using Kepler's connect (wrapper of Redux connect) it has 3 arguments (2 are dispatches)
// the code can be found from ../connect/keplergl-connect
// const mapDispatchToProps = () => (noResultDispatch, ownProps, dispatch) => {
const mapDispatchToProps = () => (dispatch, props) => {
  return {
    toggleHubbleExportModal: isOpen => dispatch(toggleHubbleExportModal(isOpen)) // NOTE gives dispatch error
  };
};

class ExportVideo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  // NOTE: This commented out code is here to connect to Redux store in future
  // handleClose() {this.props.toggleHubbleExportModal(false)} // X button in ExportVideoModal was clicked
  // handleOpen() {this.props.toggleHubbleExportModal(true)} // Export button in Kepler UI was clicked
  handleClose() {
    this.setState({isOpen: false});
  } // X button in ExportVideoModal was clicked
  handleOpen() {
    this.setState({isOpen: true});
  } // Export button in Kepler UI was clicked

  render() {
    return (
      <InjectKeplerUI keplerUI={KEPLER_UI}>
        <div>
          <ExportVideoModal isOpen={this.state.isOpen} theme={this.props.theme}>
            <ExportVideoPanelContainer
              handleClose={this.handleClose}
              mapData={this.props.mapData}
            />
          </ExportVideoModal>
          <h1>
            Use this button to export an animation using Hubble
            <button style={{marginLeft: '10px'}} onClick={this.handleOpen}>
              Export
            </button>
          </h1>
          {/* anonymous function to bind state onclick  */}
        </div>
      </InjectKeplerUI>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ExportVideo));
// NOTE: This commented out code is here to connect to Redux store in future
// keplerGlConnect is a wrapper of Redux's standard connect w/ access to Kepler's Redux store
// export default keplerGlConnect(mapStateToProps, mapDispatchToProps); // Object(...) is not a function
