import React, { Component } from 'react';

import './column.css'

export default class FlexColumn extends Component {
  render() {
    return <div className='flex-column'>
      { this.props.children }
    </div>;
  }
}
