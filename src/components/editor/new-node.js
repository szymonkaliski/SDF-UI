import React, { Component } from 'react';
import enhanceWithClickOutside from 'react-click-outside';

import nodeSpecs from '../../engine/nodes';

import './new-node.css';

class NewNode extends Component {
  handleClickOutside() {
    this.props.onRequestClose();
  }

  onSelectNode(node) {
    this.props.onSelectNode(node);
  }

  render() {
    const { pos } = this.props;

    return <div className='new_node' style={{ top: pos.y, left: pos.x }}>
      {
        Object.keys(nodeSpecs).map((key, i) => {
          return <div
            className='new_node__opt'
            key={ key }
            onClick={ () => this.onSelectNode(key) }>
            { key }
          </div>;
        })
      }
    </div>;
  }
}

export default enhanceWithClickOutside(NewNode);
