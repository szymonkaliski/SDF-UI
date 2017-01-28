import React from 'react';
import { bindActionCreators } from 'redux';
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

const EditorNodes = ({
  contentRef,
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
      contentRef={ contentRef }
      onMove={ (pos) => moveNode(id, pos) }
      onDelete={ () => deleteNode(id) }
      onUpdateMetadata={ (metadata) => updateNodeMetadata(id, metadata) }
      setInletsPositions={ (inletsPositions) => setInletsPositions(id, inletsPositions) }
      onDragEdge={ (pos, outlet) => dragEdge(id, pos, outlet) }
      onDragEdgeDone={ dragEdgeDone }
    />;
  })
} </div>;

const mapDispatchToProps = (dispatch) => bindActionCreators({
  moveNode,
  deleteNode,
  updateNodeMetadata,
  setInletsPositions,
  dragEdge,
  dragEdgeDone
}, dispatch);

export default connect(null, mapDispatchToProps)(EditorNodes);
