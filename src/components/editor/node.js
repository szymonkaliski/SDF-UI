import React, { Component } from 'react';

import nodeSpecs from '../../engine/nodes';

import './node.css';

export default class Node extends Component {
  clickX = 0;
  clickY = 0;

  constructor() {
    super();

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp   = this.onMouseUp.bind(this);
    this.onDrag      = this.onDrag.bind(this);
  }

  onDrag(e) {
    this.props.onMove({
      x: e.clientX - this.clickX,
      y: e.clientY - this.clickY
    });
  }

  onMouseDown(e) {
    this.clickX = e.clientX - this.props.x;
    this.clickY = e.clientY - this.props.y;

    window.addEventListener('mousemove', this.onDrag);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseUp() {
    window.removeEventListener('mousemove', this.onDrag);
    window.removeEventListener('mouseup', this.onMouseUp);

    this.clickX = 0;
    this.clickY = 0;
  }

  renderInlets() {
    const { type }   = this.props;
    const { inlets } = nodeSpecs[type].spec;

    return <div className='node__inlets'>
      {
        inlets.map(inlet => {
          return <div key={ inlet.id } className='node__inlet'>
            { inlet.id }
          </div>
        })
      }
    </div>;
  }

  renderOutlets() {
    return <div className='node__outlets'>
      <div className='node__outlet'>
        p
      </div>
    </div>;
  }

  render() {
    const { x, y, type } = this.props;

    return <div className='node__wrapper' style={{ top: y, left: x }}>
      { this.renderInlets() }

      <div className='node' onMouseDown={ this.onMouseDown }>
        <div className='node__content'>
          { type }
        </div>
      </div>

      { this.renderOutlets() }
    </div>;
  }
}
