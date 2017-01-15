import React, { Component } from 'react';
import { connect } from 'react-redux';

import Node from './node';

import {
  moveNode,
  dragEdge,
  dragEdgeDone,
  setInletsPositions
} from '../../actions/graph';

class Nodes extends Component {
  render() {
    return <div>
      {
        this.props.nodes.valueSeq().map(node => {
          const id = node.get('id');

          return <Node
            key={ id }
            x={ node.get('x') }
            y={ node.get('y') }
            type={ node.get('type') }
            onMove={ (pos) => this.props.moveNode(id, pos) }
            onDragEdge={ (pos) => this.props.dragEdge(id, pos) }
            onDragEdgeDone={ this.props.dragEdgeDone }
            setInletsPositions={ (inletsPositions) => this.props.setInletsPositions(id, inletsPositions) }
          />
        })
      }
    </div>;
  }
};

const mapDispatchToProps = (dispatch) => ({
  moveNode:           (id, pos)             => dispatch(moveNode(id, pos)),
  dragEdge:           (id, pos)             => dispatch(dragEdge(id, pos)),
  dragEdgeDone:       ()                    => dispatch(dragEdgeDone()),
  setInletsPositions: (id, inletsPositions) => dispatch(setInletsPositions(id, inletsPositions))
});

export default connect(null, mapDispatchToProps)(Nodes);
