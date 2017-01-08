import React, { Component } from 'react';
import { Node, Shaders } from 'gl-react';
import { Surface } from 'gl-react-dom';

import generateSDFFragment from './generate-sdf-fragment';

const shaders = Shaders.create({
  sdf: {
    frag: generateSDFFragment(`
      sdBox(p, vec3(0.1))
    `)
  }
});

export default class Preview extends Component {
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

    return <Surface width={ width } height={ height }>
      <Node shader={ shaders.sdf } uniforms={{ width, height }}/>
    </Surface>;
  }
}
