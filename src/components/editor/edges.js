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
          const fromNode = nodes.get(edge.getIn([ 'from', 'id' ]));

          if (!fromNode) { return null; }

          const toNode = nodes.get(edge.getIn([ 'to', 'id' ]));

          let targetX, targetY;

          if (toNode) {
            const toNodeInlets = nodeSpecs[toNode.get('type')].spec.inlets.map(prop('id'));
            const inletIdx     = toNodeInlets.indexOf(edge.getIn([ 'to', 'inlet' ]));

            targetX = toNode.get('x') + 12 + 34 * inletIdx;
            targetY = toNode.get('y') + 8;
          }
          else if (edge.get('id') === 'dragging') {
            targetX = edge.get('x');
            targetY = edge.get('y');
          }

          return <line
            key={ edge.get('id') }
            className='edge'
            x1={ fromNode.get('x') + 12 }
            y1={ fromNode.get('y') + 96 }
            x2={ targetX }
            y2={ targetY }
          />
        })
      }
    </svg>;
  }
}
