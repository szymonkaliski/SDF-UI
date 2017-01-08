import React, { Component } from 'react';

import './row.css'

export default class FlexRow extends Component {
  render() {
    return <div className='flex-row'>
      { this.props.children }
    </div>;
  }
}
