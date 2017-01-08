import { Node, Shaders, GLSL } from 'gl-react';
import React, { Component } from 'react';
import { Surface } from 'gl-react-dom';

const shaders = Shaders.create({
  rainbow: {
    frag: GLSL`
      precision highp float;
      varying vec2 uv;
      void main () {
        gl_FragColor = vec4(uv.x, uv.y, 0.5, 1.0);
      }
    `
  }
});


export default class Preview extends Component {
  render() {
    return <div>
      <div>Preview</div>

      <Surface width={500} height={500}>
        <Node shader={ shaders.rainbow } />
      </Surface>
    </div>;
  }
}

