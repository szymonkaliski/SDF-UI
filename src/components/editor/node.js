import React, { Component } from 'react';

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
    this.clickY = e.clientX - this.props.x;

    window.addEventListener('mousemove', this.onDrag);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseUp() {
    window.removeEventListener('mousemove', this.onDrag);
    window.removeEventListener('mouseup', this.onMouseUp);

    this.clickX = 0;
    this.clickY = 0;
  }

  render() {
    const { x, y, type } = this.props;

    return <div
      className='node'
      onMouseDown={ this.onMouseDown }
      style={{ top: y, left: x }}>
      { type }
    </div>;
  }
}
