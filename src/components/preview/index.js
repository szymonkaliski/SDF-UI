import React, { Component } from 'react';
import { Node, Shaders } from 'gl-react';
import { Surface } from 'gl-react-dom';
import { connect } from 'react-redux';

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
    const { windowSize, camera, fragment } = this.props;

    const width  = windowSize.get('width');
    const height = windowSize.get('height');

    let shaders;

    if (fragment) {
      shaders = Shaders.create({ sdf: { frag: fragment } });
    }

    return <div className='preview' style={{ width: width / 2 }} ref={ this.onRef } onMouseDown={ this.onMouseDown }>
      {
        fragment && <Surface width={ width / 2 } height={ height }>
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

const mapStateToProps = (state) => ({
  fragment:   state.get('fragment'),
  camera:     state.get('camera'),
  windowSize: state.get('windowSize')
});

const mapDispatchToProps = (dispatch) => ({
  setCamera: (camera) => dispatch(setCamera(camera))
});

export default connect(mapStateToProps, mapDispatchToProps)(Preview);
