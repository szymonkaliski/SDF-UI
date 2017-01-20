import React, { Component } from 'react';
import classNames from 'classnames';
import enhanceWithClickOutside from 'react-click-outside';

import nodeSpecs from '../../engine/nodes';

import './node.css';

class EditorNode extends Component {
  clickX = 0;
  clickY = 0;

  constructor() {
    super();

    this.inletsDivs = {};

    this.state = { selected: false };

    this.onMouseDown       = this.onMouseDown.bind(this);
    this.onMouseDownNode   = this.onMouseDownNode.bind(this);
    this.onMouseDownOutlet = this.onMouseDownOutlet.bind(this);
    this.onKeyDown         = this.onKeyDown.bind(this);
  }

  componentDidMount() {
    const { x, y } = this.props;

    const inletsPositions = Object.keys(this.inletsDivs).reduce((memo, key) => {
      const rect = this.inletsDivs[key].getBoundingClientRect();

      return Object.assign(memo, {
        [key]: {
          x: rect.left - x + rect.width / 2,
          y: rect.top  - y
        }
      });
    }, {});

    this.props.setInletsPositions(inletsPositions);

    window.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown({ keyCode }) {
    const { selected } = this.state;

    if (selected && keyCode === 8) {
      this.props.onDelete();
    }
  }

  onMouseDown(e, callbacks) {
    this.clickX = e.clientX - this.props.x;
    this.clickY = e.clientY - this.props.y;

    const onDrag = (e) => {
      callbacks.onDrag({
        relative: {
          x: e.clientX - this.clickX,
          y: e.clientY - this.clickY
        },
        absolute: {
          x: e.clientX,
          y: e.clientY
        }
      });
    };

    const onUp = () => {
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', onUp);

      if (callbacks.onUp) { callbacks.onUp(); }
    };

    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', onUp);

    this.setState({ selected: true });
  }

  onMouseDownNode(e) {
    this.onMouseDown(e, {
      onDrag: ({ relative }) => { this.props.onMove(relative); }
    });
  }

  onMouseDownOutlet(e) {
    this.onMouseDown(e, {
      onDrag: ({ absolute }) => { this.props.onDragEdge(absolute); },
      onUp:   () => { this.props.onDragEdgeDone(); }
    });
  }

  handleClickOutside() {
    this.setState({ selected: false });
  }

  renderInlets() {
    const { selected } = this.state;
    const { type }     = this.props;
    const { inlets }   = nodeSpecs[type].spec;

    return <div className='node__inlets'>
      {
        inlets && inlets.map(inlet => {
          return <div
            key={ inlet.id }
            className={ classNames('node__inlet', { 'node__inlet--selected': selected }) }
            ref={ (ref) => this.inletsDivs[inlet.id] = ref }>
            { inlet.id }
          </div>
        })
      }
    </div>;
  }

  renderOutlets() {
    const { selected } = this.state;
    const { type }     = this.props;
    const { outlet }   = nodeSpecs[type].spec;

    return <div className='node__outlets'>
      {
        outlet && <div
          className={ classNames('node__outlet', { 'node__outlet--selected': selected }) }
          onMouseDown={ this.onMouseDownOutlet }>
          { outlet.id }
        </div>
      }
    </div>;
  }

  render() {
    const { selected }   = this.state;
    const { x, y, type } = this.props;

    return <div className='node__wrapper' style={{ top: y, left: x }}>
      { this.renderInlets() }

      <div className={ classNames('node', { 'node--selected': selected }) } onMouseDown={ this.onMouseDownNode }>
        <div className='node__content'>
          { type }
        </div>
      </div>

      { this.renderOutlets() }
    </div>;
  }
}

export default enhanceWithClickOutside(EditorNode);
