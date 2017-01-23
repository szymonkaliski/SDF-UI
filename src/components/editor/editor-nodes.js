import React from 'react';
import { connect } from 'react-redux';

import EditorNode from './editor-node';

import {
  moveNode,
  deleteNode,
  setInletsPositions,
  updateNodeMetadata,

  dragEdge,
  dragEdgeDone,
} from '../../actions/graph';

// TODO: there's a lot of repetition here

const EditorNodes = ({
  nodes,
  moveNode,
  deleteNode,
  setInletsPositions,
  updateNodeMetadata,

  dragEdge,
  dragEdgeDone
}) => <div> {
  nodes.valueSeq().map(node => {
    const id = node.get('id');

    return <EditorNode
      key={ id }
      x={ node.get('x') }
      y={ node.get('y') }
      metadata={ node.get('metadata') }
      type={ node.get('type') }
      onMove={ (pos) => moveNode(id, pos) }
      onDelete={ () => deleteNode(id) }
      onUpdateMetadata={ (metadata) => updateNodeMetadata(id, metadata) }
      setInletsPositions={ (inletsPositions) => setInletsPositions(id, inletsPositions) }
      onDragEdge={ (pos, outlet) => dragEdge(id, pos, outlet) }
      onDragEdgeDone={ dragEdgeDone }
    />;
  })
} </div>;

const mapDispatchToProps = (dispatch) => ({
  moveNode:           (id, pos)             => dispatch(moveNode(id, pos)),
  deleteNode:         (id)                  => dispatch(deleteNode(id)),
  updateNodeMetadata: (id, metadata)        => dispatch(updateNodeMetadata(id, metadata)),
  setInletsPositions: (id, inletsPositions) => dispatch(setInletsPositions(id, inletsPositions)),

  dragEdge:           (id, pos, outlet)     => dispatch(dragEdge(id, pos, outlet)),
  dragEdgeDone:       ()                    => dispatch(dragEdgeDone()),
});

export default connect(null, mapDispatchToProps)(EditorNodes);
