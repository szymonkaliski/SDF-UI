import React, { Component } from 'react';
import autobind from 'react-autobind';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import EditorEdges from './editor-edges';
import EditorNodes from './editor-nodes';
import NewNode from './new-node';

import nodeSpecs from '../../engine/nodes';
import { addNode } from '../../actions/graph';

import './index.css';

class Editor extends Component {
  constructor() {
    super();

    this.state = {
      newNodePopup: false,
      mousePos:     undefined
    };

    autobind(this);
  }

  onDoubleClick({ clientX, clientY, target }) {
    if (target.localName === 'svg') {
      this.setState({
        newNodePopup: true,
        mousePos: { x: clientX, y: clientY }
      });
    }
  }

  onAddNode(nodeType) {
    // adjust for scroll position of editor content
    const boundingRect = this.state.refEditorContent.getBoundingClientRect();

    this.props.addNode(nodeType, {
      x: this.state.mousePos.x - boundingRect.left,
      y: this.state.mousePos.y - boundingRect.top
    });

    this.setState({ newNodePopup: false, mousePos: undefined });
  }

  onCloseAddNode() {
    this.setState({ newNodePopup: false, mousePos: undefined });
  }

  onEditorContentRef(ref) {
    // this ref is used for dragging connecting when editor content is scrolled
    this.setState({ refEditorContent: ref });
  }

  render() {
    const { newNodePopup, mousePos, refEditorContent } = this.state;
    const { edges, nodes, windowSize }                 = this.props;

    const width  = windowSize.get('width');
    const height = windowSize.get('height');

    let contentWidth  = width / 2;
    let contentHeight = height;

    if (nodes.count() > 0) {
      contentWidth  = Math.max(contentWidth,  nodes.maxBy(node => node.get('x')).get('x') + 180);
      contentHeight = Math.max(contentHeight, nodes.maxBy(node => node.get('y')).get('y') + 120);
    }

    const popupPos = mousePos && {
      x: Math.min(mousePos.x, width / 2 - 160),
      y: Math.min(mousePos.y, height - Math.min(280, Object.keys(nodeSpecs).length * 24) - 20)
    };

    return <div className='editor' onDoubleClick={ this.onDoubleClick } style={{ width: width / 2, height }}>
      <div className='editor__content' style={{ width: contentWidth, height }} ref={ this.onEditorContentRef }>
        { refEditorContent && (
          <div>
            <EditorEdges edges={ edges } nodes={ nodes } width={ contentWidth } height={ contentHeight }/>
            <EditorNodes nodes={ nodes } contentRef={ refEditorContent }/>
            {
              newNodePopup && <NewNode
                pos={ popupPos }
                onSelectNode={ this.onAddNode }
                onRequestClose={ this.onCloseAddNode }
              />
            }
          </div>
        ) }
      </div>
    </div>
  }
}

const mapStateToProps = (state) => ({
  nodes:      state.get('nodes'),
  edges:      state.get('edges'),
  windowSize: state.get('windowSize')
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ addNode }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
