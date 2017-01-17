import React, { Component } from 'react';
import { Node, Shaders } from 'gl-react';
import { Surface } from 'gl-react-dom';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';

import compileGraph from '../../engine/compile-graph';
import generateSDFFragment from './generate-sdf-fragment';

import './preview.css';

class Preview extends Component {
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
    const width  = window.innerWidth / 2;
    const height = window.innerHeight;

    this.setState({ width, height });
  }

  render() {
    const { width, height } = this.state;
    const { nodes, edges }  = this.props;

    const compiled = compileGraph({ nodes, edges });

    if (compiled) {
      console.log(compiled);

      const frag = generateSDFFragment(compiled);
      const shaders = Shaders.create({ sdf: { frag } });

      return <Surface width={ width } height={ height }>
        <Node shader={ shaders.sdf } uniforms={{ width, height }}/>
      </Surface>;
    }
    else {
      return <div className='preview-empty' />;
    }
  }
}

const pick = (map, args) => {
  return fromJS(args.reduce((memo, arg) => ({
    ...memo,
    [arg]: map.get(arg)
  }), {}))
};

const mapStateToProps = ({ graph }) => {
  return {
    nodes: graph.get('nodes').map(node => pick(node, [ 'id', 'type' ])),
    edges: graph.get('edges').delete('dragging')
  }
};

const areStatePropsEqual = (a, b) => {
  return a.nodes.equals(b.nodes) && a.edges.equals(b.edges);
};

export default connect(mapStateToProps, null, null, { pure: true, areStatePropsEqual })(Preview);
