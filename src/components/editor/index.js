import React, { Component } from 'react';
import { connect } from 'react-redux';

import Graph from './graph';

class Editor extends Component {
  render() {
    return <Graph nodes={ this.props.nodes }/>
  }
}

const mapStateToProps = ({ graph }) => ({ nodes: graph.get('nodes') });

export default connect(mapStateToProps)(Editor);
