import React, { Component } from 'react';
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

    this.onDoubleClick  = this.onDoubleClick.bind(this);
    this.onAddNode      = this.onAddNode.bind(this);
    this.onCloseAddNode = this.onCloseAddNode.bind(this);
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
    this.props.addNode(nodeType, this.state.mousePos);
    this.setState({ newNodePopup: false, mousePos: undefined });
  }

  onCloseAddNode() {
    this.setState({ newNodePopup: false, mousePos: undefined });
  }

  render() {
    const { newNodePopup, mousePos }   = this.state;
    const { edges, nodes, windowSize } = this.props;

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
      y: Math.min(mousePos.y, height - Object.keys(nodeSpecs).length * 24- 20)
    };

    return <div className='editor' onDoubleClick={ this.onDoubleClick } style={{ width: width / 2, height }}>
      <div className='editor__content' style={{ width: contentWidth, height }}>
        <EditorEdges edges={ edges } nodes={ nodes } width={ contentWidth } height={ contentHeight }/>
        <EditorNodes nodes={ nodes }/>
        {
          newNodePopup && <NewNode
            pos={ popupPos }
            onSelectNode={ this.onAddNode }
            onRequestClose={ this.onCloseAddNode }
          />
        }
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
