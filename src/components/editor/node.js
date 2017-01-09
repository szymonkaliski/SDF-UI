import React, { Component } from 'react';

import './node.css';

export default class Node extends Component {
  render() {
    const { x, y, type } = this.props.node;

    return <div className='node' style={{ top: y, left: x }}>
      { type }
    </div>;
  }
}
