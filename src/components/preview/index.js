import React from 'react';
import { Node, Shaders } from 'gl-react';
import { Surface } from 'gl-react-dom';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';

import compileGraph from '../../engine/compile-graph';
import generateSDFFragment from '../../engine/generate-sdf-fragment';

import './index.css';

const Preview = ({ nodes, edges, windowSize }) => {
  const width    = windowSize.get('width');
  const height   = windowSize.get('height');
  const compiled = compileGraph({ nodes, edges });

  let shaders;

  if (compiled) {
    const frag = generateSDFFragment(compiled);
    shaders = Shaders.create({ sdf: { frag } });

    // console.log(compiled);
    console.log(frag);
  }

  return <div className='preview' style={{ width: width / 2 }}>
    {
      compiled && <Surface width={ width / 2 } height={ height }>
        <Node shader={ shaders.sdf } uniforms={{ width: width / 2, height }}/>
      </Surface>
    }
  </div>;
};

const pick = (map, args) => {
  return fromJS(args.reduce((memo, arg) => ({
    ...memo,
    [arg]: map.get(arg)
  }), {}))
};

const mapStateToProps = (state) => ({
  nodes:      state.get('nodes').map(node => pick(node, [ 'id', 'type', 'metadata' ])),
  edges:      state.get('edges').delete('dragging'),
  windowSize: state.get('windowSize')
});

const areStatePropsEqual = (a, b) => [ 'nodes', 'edges', 'windowSize' ].every(key => a[key].equals(b[key]));

export default connect(mapStateToProps, null, null, { pure: true, areStatePropsEqual })(Preview);
