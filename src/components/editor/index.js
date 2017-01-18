import React, { Component } from 'react';
import { connect } from 'react-redux';

import Edges from './edges';
import NewNode from './new-node';
import Nodes from './nodes';

import './editor.css';

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

    this.onResize      = this.onResize.bind(this);
    this.onDoubleClick = this.onDoubleClick.bind(this);
    this.onAddNode     = this.onAddNode.bind(this);
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

  onDoubleClick({ clientX, clientY }) {
    this.setState({
      newNodePopup: true,
      mousePos: { x: clientX, y: clientY }
    });
  }

  onAddNode(nodeType) {
    this.props.addNode(nodeType, this.state.mousePos);
    this.setState({ newNodePopup: false, mousePos: undefined });
  }

  render() {
    const { width, height, newNodePopup, mousePos } = this.state;
    const { edges, nodes } = this.props;

    return <div className='editor' onDoubleClick={ this.onDoubleClick }>
      <Edges edges={ edges } nodes={ nodes } width={ width } height={ height }/>
      <Nodes nodes={ nodes }/>
      { newNodePopup && <NewNode pos={ mousePos } onSelectNode={ this.onAddNode }/> }
    </div>
  }
}

const mapStateToProps = ({ graph }) => ({
  nodes: graph.get('nodes'),
  edges: graph.get('edges')
});

const mapDispatchToProps = (dispatch) => ({
  addNode: (nodeType, pos) => dispatch(addNode(nodeType, pos))
});

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
