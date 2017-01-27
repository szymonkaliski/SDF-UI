import React, { Component } from 'react';
import { Node, Shaders } from 'gl-react';
import { Surface } from 'gl-react-dom';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';

import compileGraph from '../../engine/compile-graph';
import generateSDFFragment from '../../engine/generate-sdf-fragment';

import { setCamera } from '../../actions/preview';

import './index.css';

class Preview extends Component {
  constructor() {
    super();

    this.onRef       = this.onRef.bind(this);
    this.onScroll    = this.onScroll.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
  }

  onScroll(e) {
    e.preventDefault();

    this.props.setCamera({
      dist: Math.max(0, this.props.camera.get('dist') + e.deltaY / 100)
    });
  }

  onMouseDown(e) {
    const clickX = e.clientX;
    const clickY = e.clientY;

    const startRotation = this.props.camera.get('rotation');
    const startHeight   = this.props.camera.get('height');

    const onDrag = (e) => {
      const dx = clickX - e.clientX;
      const dy = clickY - e.clientY;

      const rotation = startRotation + dx;
      const height   = Math.min(180, Math.max(-180, startHeight - dy));

      this.props.setCamera({ rotation, height });
    };

    const onUp = () => {
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', onUp);
  }

  onRef(ref) {
    this.ref = ref;

    this.ref.addEventListener('mousewheel', this.onScroll);
  }

  componentWillUmount() {
    this.ref.removeEventListener('mousewheel', this.onScroll);
  }

  render() {
    const { windowSize, nodes, edges, camera } = this.props;

    const width    = windowSize.get('width');
    const height   = windowSize.get('height');
    const compiled = compileGraph({ nodes, edges });

    let shaders;

    if (compiled) {
      const frag = generateSDFFragment(compiled);
      shaders = Shaders.create({ sdf: { frag } });

      // console.log(compiled);
      // console.log(frag);
    }

    return <div className='preview' style={{ width: width / 2 }} ref={ this.onRef } onMouseDown={ this.onMouseDown }>
      {
        compiled && <Surface width={ width / 2 } height={ height }>
          <Node
            shader={ shaders.sdf }
            uniforms={{
              width: width / 2,
              height,
              camRotation: camera.get('rotation'),
              camHeight: camera.get('height'),
              camDist: camera.get('dist')
            }}
          />
        </Surface>
      }
    </div>;
  }
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
  camera:     state.get('camera'),
  windowSize: state.get('windowSize')
});

const mapDispatchToProps = (dispatch) => ({
  setCamera: (camera) => dispatch(setCamera(camera))
});

const areStatePropsEqual = (a, b) => [ 'nodes', 'edges', 'windowSize', 'camera' ].every(key => a[key].equals(b[key]));

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: true, areStatePropsEqual })(Preview);
