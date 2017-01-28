import React, { Component } from 'react';
import autobind from 'react-autobind';
import raf from 'raf';
import { Node, Shaders } from 'gl-react';
import { Surface } from 'gl-react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { setCamera } from '../../actions/preview';

import './index.css';

class Preview extends Component {
  constructor() {
    super();

    this.state = { time: 0 };

    autobind(this);
  }

  componentDidMount() {
    const interval = 1000 / 60; // 60 FPS

    let start, last = 0;

    const loop = (t) => {
      if (!start) { start = t; }

      if (t - last > interval) {
        last = t;
        this.setState({ time: t - start });
      }

      raf(loop);
    };

    this.handle = raf(loop);
  }

  componentWillUmount() {
    raf.cancel(this.handle);

    this.ref.removeEventListener('mousewheel', this.onScroll);
  }

  onRef(ref) {
    this.ref = ref;

    this.ref.addEventListener('mousewheel', this.onScroll);
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

  render() {
    const { time } = this.state;
    const { windowSize, camera, fragment, fullscreen } = this.props;

    const winWidth = windowSize.get('width')
    const width    = fullscreen ? winWidth : winWidth / 2;
    const height   = windowSize.get('height');

    let shaders;

    if (fragment) {
      shaders = Shaders.create({ sdf: { frag: fragment } });
    }

    return <div className='preview' style={{ width }} ref={ this.onRef } onMouseDown={ this.onMouseDown }>
      {
        fragment && <Surface width={ width } height={ height }>
          <Node
            shader={ shaders.sdf }
            uniforms={{
              width,
              height,
              time,
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
  windowSize: state.get('windowSize'),
  fullscreen: state.get('fullscreen')
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ setCamera }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Preview);
