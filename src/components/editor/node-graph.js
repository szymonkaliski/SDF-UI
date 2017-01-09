import React, { Component } from 'react';
import map from 'lodash.map';

import Node from './node';

export default class NodeGraph extends Component {
  render() {
    return <div>
      {
        map(this.props.nodes, (node) => {
          return <Node key={ node.id } node={ node } />
        })
      }
    </div>;
  }
};
