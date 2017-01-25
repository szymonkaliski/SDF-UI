import React, { Component } from 'react';
import { Node, Shaders } from 'gl-react';
import { Surface } from 'gl-react-dom';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';

import compileGraph from '../../engine/compile-graph';
import generateSDFFragment from '../../engine/generate-sdf-fragment';

import './index.css';

class Preview extends Component {
  constructor() {
    super();

    this.state = {
      camRotation: 0,
      camHeight:   0,
      camDist:     5
    };

    this.onRef       = this.onRef.bind(this);
    this.onScroll    = this.onScroll.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
  }

  onScroll(e) {
    e.preventDefault();

    this.setState({
      camDist: Math.max(0, this.state.camDist + e.deltaY / 100)
    });
  }

  onMouseDown(e) {
    const clickX = e.clientX;
    const clickY = e.clientY;

    const startRotation = this.state.camRotation;
    const startHeight   = this.state.camHeight;

    const onDrag = (e) => {
      const dx = clickX - e.clientX;
      const dy = clickY - e.clientY;

      const camRotation = startRotation + dx;
      const camHeight   = Math.min(180, Math.max(-180, startHeight - dy));

      this.setState({ camRotation, camHeight });
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
    const { windowSize, nodes, edges }        = this.props;
    const { camRotation, camHeight, camDist } = this.state;

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
              camRotation,
              camHeight,
              camDist
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
  windowSize: state.get('windowSize')
});

const areStatePropsEqual = (a, b) => [ 'nodes', 'edges', 'windowSize' ].every(key => a[key].equals(b[key]));

export default connect(mapStateToProps, null, null, { pure: true, areStatePropsEqual })(Preview);
