import React, { Component } from 'react';
import classNames from 'classnames';
import enhanceWithClickOutside from 'react-click-outside';

import nodeSpecs from '../../engine/nodes';

import './new-node.css';

const getNodeList = (filterText) => {
  const filterRegex = new RegExp(filterText, 'i');

  return Object.keys(nodeSpecs)
    .filter(key => filterText ? key.search(filterRegex) >= 0 : true);
};

class NewNode extends Component {
  constructor() {
    super();

    this.state = {
      inputText: "",
      selectedIndex: 0
    };

    this.onChangeInput = this.onChangeInput.bind(this);
    this.onSelectNode  = this.onSelectNode.bind(this);
    this.onKeyDown     = this.onKeyDown.bind(this);
    this.onMouseMove   = this.onMouseMove.bind(this);
  }

  handleClickOutside() {
    this.props.onRequestClose();
  }

  onChangeInput(e) {
    this.setState({ inputText: e.target.value });
  }

  onSelectNode(node) {
    this.setState({ inputText: "", selectedIndex: 0 });
    this.props.onSelectNode(node);
  }

  onKeyDown({ keyCode }) {
    const dirs = { 40: +1, 38: -1 };

    if (dirs[keyCode]) {
      const nodeList = getNodeList();
      const newIndex = (this.state.selectedIndex + dirs[keyCode]) % nodeList.length;

      this.setState({
        selectedIndex: newIndex >= 0 ? newIndex : nodeList.length - 1
      });
    }
  }

  onMouseMove({ clientY }) {

    const yPos = clientY - this.props.pos.y;

    this.setState({
      selectedIndex: Math.floor((yPos - 32) / 24)
    })

    console.log(yPos);
  }

  render() {
    const { pos } = this.props;

    const {
      inputText,
      selectedIndex
    } = this.state;

    const nodeList = getNodeList(inputText);

    const onSubmit = (e) => {
      e.preventDefault();
      this.onSelectNode(nodeList[selectedIndex]);
    };

    return <div className='new_node' style={{ top: pos.y, left: pos.x }} onMouseMove={ this.onMouseMove }>
      <form onSubmit={ onSubmit }>
        <input
          className='new_node__input'
          autoFocus
          onChange={ this.onChangeInput }
          onKeyDown={ this.onKeyDown }
          value={inputText}/>
      </form>
      <div>
        {
          nodeList.map((key, i) => {
            return <div
              className={ classNames('new_node__opt', { 'new_node__opt--selected': selectedIndex === i }) }
              key={ key }
              onClick={ () => this.onSelectNode(key) }>
              { key }
            </div>;
          })
        }
      </div>
    </div>;
  }
}

export default enhanceWithClickOutside(NewNode);
