import React, { Component } from 'react';
import autobind from 'react-autobind';
import classNames from 'classnames';
import enhanceWithClickOutside from 'react-click-outside';

import nodeSpecs from '../../engine/nodes';

import './editor-node.css';

class EditorNode extends Component {
  clickX = 0;
  clickY = 0;

  constructor() {
    super();

    this.inletsDivs = {};

    this.state = { selected: false };

    autobind(this);
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

  onKeyDown(e) {
    const { key, target } = e;
    const { selected }    = this.state;

    if (selected && key === 'Backspace' && target.localName === 'body') {
      this.props.onDelete();
    }
  }

  onMouseDown(e, callbacks) {
    // adjust for scroll position of editor content
    const boundingRect = this.props.contentRef.getBoundingClientRect();

    this.clickX = e.clientX - this.props.x - boundingRect.left;
    this.clickY = e.clientY - this.props.y - boundingRect.top;

    const onDrag = (e) => {
      callbacks.onDrag({
        relative: {
          x: e.clientX - this.clickX - boundingRect.left,
          y: e.clientY - this.clickY - boundingRect.top
        },
        absolute: {
          x: e.clientX - boundingRect.left,
          y: e.clientY - boundingRect.top
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

  onMouseDownOutlet(e, outlet) {
    this.onMouseDown(e, {
      onDrag: ({ absolute }) => { this.props.onDragEdge(absolute, outlet); },
      onUp:   () => { this.props.onDragEdgeDone(); }
    });
  }

  onUpdateMetadata(metadata) {
    this.props.onUpdateMetadata(metadata);
  }

  handleClickOutside() {
    this.setState({ selected: false });
  }

  renderInlets() {
    const { selected } = this.state;
    const { type }     = this.props;
    const { inlets }   = nodeSpecs[type].spec;

    const typeNames = {
      float: 'f',
      vec3:  '3'
    };

    return <div className='node__inlets'>
      {
        inlets && inlets.map(inlet => {
          return <div
            key={ inlet.id }
            className={ classNames('node__inlet', { 'node__inlet--selected': selected }) }
            ref={ (ref) => this.inletsDivs[inlet.id] = ref }>
            { inlet.id }
            <span className='node__inlet-type'>{ typeNames[inlet.type] }</span>
          </div>
        })
      }
    </div>;
  }

  renderOutlets() {
    const { selected } = this.state;
    const { type }     = this.props;
    const { outlet }   = nodeSpecs[type].spec;

    const typeNames = {
      float: 'f',
      vec3:  '3'
    };

    return <div className='node__outlets'>
      {
        outlet && <div
          className={ classNames('node__outlet', { 'node__outlet--selected': selected }) }
          onMouseDown={ (e) => this.onMouseDownOutlet(e, outlet) }>
          { outlet.id }
          <span className='node__outlet-type'>{ typeNames[outlet.type] }</span>
        </div>
      }
    </div>;
  }

  renderCustomUI() {
    const { metadata, type } = this.props;
    const CustomUI           = nodeSpecs[type].ui;

    return <CustomUI
      metadata={ metadata ? metadata.toJS() : {} }
      onUpdateMetadata={ this.onUpdateMetadata }/>
  }

  render() {
    const { selected }   = this.state;
    const { x, y, type } = this.props;
    const hasCustomUI    = !!nodeSpecs[type].ui;

    return <div className='node__wrapper' style={{ top: y, left: x }}>
      { this.renderInlets() }

      <div className={ classNames('node', { 'node--selected': selected }) } onMouseDown={ this.onMouseDownNode }>
        <div className='node__content'>
          { hasCustomUI ? this.renderCustomUI() : type }
        </div>
      </div>

      { this.renderOutlets() }
    </div>;
  }
}

export default enhanceWithClickOutside(EditorNode);
