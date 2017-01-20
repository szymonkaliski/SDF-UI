import React from 'react';
import { connect } from 'react-redux';

import Node from './node';

import {
  moveNode,
  deleteNode,
  dragEdge,
  dragEdgeDone,
  setInletsPositions
} from '../../actions/graph';

const Nodes = ({ nodes, moveNode, deleteNode, dragEdge, dragEdgeDone, setInletsPositions }) => <div>
{
  nodes.valueSeq().map(node => {
    const id = node.get('id');

    return <Node
      key={ id }
      x={ node.get('x') }
      y={ node.get('y') }
      type={ node.get('type') }
      onMove={ (pos) => moveNode(id, pos) }
      onDelete={ () => deleteNode(id) }
      onDragEdge={ (pos) => dragEdge(id, pos) }
      onDragEdgeDone={ dragEdgeDone }
      setInletsPositions={ (inletsPositions) => setInletsPositions(id, inletsPositions) }
    />;
  })
}
</div>;

const mapDispatchToProps = (dispatch) => ({
  moveNode:           (id, pos)             => dispatch(moveNode(id, pos)),
  deleteNode:         (id)                  => dispatch(deleteNode(id)),
  dragEdge:           (id, pos)             => dispatch(dragEdge(id, pos)),
  dragEdgeDone:       ()                    => dispatch(dragEdgeDone()),
  setInletsPositions: (id, inletsPositions) => dispatch(setInletsPositions(id, inletsPositions))
});

export default connect(null, mapDispatchToProps)(Nodes);
