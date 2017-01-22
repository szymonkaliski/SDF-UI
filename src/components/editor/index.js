import React, { Component } from 'react';
import { connect } from 'react-redux';

import EditorEdges from './editor-edges';
import EditorNodes from './editor-nodes';
import NewNode from './new-node';

import './index.css';

import { addNode } from '../../actions/graph';

class Editor extends Component {
  constructor() {
    super();

    this.state = {
      width: 0,
      height: 0,
      newNodePopup: false,
      mousePos: undefined
    };

    this.onResize       = this.onResize.bind(this);
    this.onDoubleClick  = this.onDoubleClick.bind(this);
    this.onAddNode      = this.onAddNode.bind(this);
    this.onCloseAddNode = this.onCloseAddNode.bind(this);
  }

  componentDidMount() {
    this.onResize();
    window.addEventListener('resize', this.onResize);
  }

  componentWillUmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize() {
    this.setState({
      width: window.innerWidth / 2,
      height: window.innerHeight
    });
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
    const { width, height, newNodePopup, mousePos } = this.state;
    const { edges, nodes } = this.props;

    return <div className='editor' onDoubleClick={ this.onDoubleClick }>
      <EditorEdges edges={ edges } nodes={ nodes } width={ width } height={ height }/>
      <EditorNodes nodes={ nodes }/>
        {
          newNodePopup && <NewNode
            pos={ mousePos }
            onSelectNode={ this.onAddNode }
            onRequestClose={ this.onCloseAddNode }
          />
        }
    </div>
  }
}

const mapStateToProps = (state) => ({
  nodes: state.get('nodes'),
  edges: state.get('edges')
});

const mapDispatchToProps = (dispatch) => ({
  addNode: (nodeType, pos) => dispatch(addNode(nodeType, pos))
});

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
