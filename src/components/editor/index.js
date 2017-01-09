import React, { Component } from 'react';
import { connect } from 'react-redux';

import NodeGraph from './node-graph';

class Editor extends Component {
  render() {
    return <NodeGraph nodes={ this.props.nodes }/>
  }
}

export default connect(({ graph }) => graph)(Editor);
