import React, { Component } from 'react';
import { connect } from 'react-redux';

import Nodes from './nodes';
import Edges from './edges';

import './editor.css';

class Editor extends Component {
  constructor() {
    super();

    this.state = { width: 0, height: 0 };
    this.onResize = this.onResize.bind(this);
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

  render() {
    const { width, height } = this.state;
    const { edges, nodes } = this.props;

    return <div className='editor'>
      <Edges edges={ edges } nodes={ nodes } width={ width } height={ height }/>
      <Nodes nodes={ nodes }/>
    </div>
  }
}

const mapStateToProps = ({ graph }) => ({
  nodes: graph.get('nodes'),
  edges: graph.get('edges')
});

export default connect(mapStateToProps)(Editor);
