import React, { Component } from 'react';

import nodeSpecs from '../../engine/nodes';

import './edges.css';

const prop = (key) => (obj) => obj[key];

export default class Edges extends Component {
  render() {
    const { width, height, edges, nodes } = this.props;

    return <svg className='edges' width={ width } height={ height }>
      {
        edges.valueSeq().map(edge => {
          const fromNode     = nodes.get(edge.getIn([ 'from', 'id' ]));
          const toNode       = nodes.get(edge.getIn([ 'to', 'id' ]));

          const toNodeInlets = nodeSpecs[toNode.get('type')].spec.inlets.map(prop('id'));

          const inletIdx     = toNodeInlets.indexOf(edge.getIn([ 'to', 'inlet' ]));

          return <line
            key={ edge.get('id') }
            className='edge'
            x1={ fromNode.get('x') + 12 }
            y1={ fromNode.get('y') + 96 }
            x2={ toNode.get('x') + 12 + 34 * inletIdx }
            y2={ toNode.get('y') + 8 }
          />
        })
      }
    </svg>;
  }
}
