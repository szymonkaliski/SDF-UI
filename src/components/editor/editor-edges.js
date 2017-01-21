import React, { Component } from 'react';
import classNames from 'classnames';
import enhanceWithClickOutside from 'react-click-outside';
import { connect } from 'react-redux';

import nodeSpecs from '../../engine/nodes';

import {
  deleteEdge
} from '../../actions/graph';

import './editor-edges.css';

const prop = (key) => (obj) => obj[key];

// TODO: export Edge and Edges, same as Node and Nodes

class EditorEdges extends Component {
  constructor() {
    super();

    this.state = { selectedId: undefined };

    this.onClickEdge = this.onClickEdge.bind(this);
    this.onKeyDown   = this.onKeyDown.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  onClickEdge(id) {
    this.setState({ selectedId: id });
  }

  handleClickOutside() {
    this.setState({ selectedId: undefined });
  }

  onKeyDown({ keyCode }) {
    const { selectedId } = this.state;

    if (selectedId && keyCode === 8) {
      this.props.deleteEdge(selectedId);
      this.setState({ selectedId: undefined });
    }
  }

  render() {
    const { selectedId } = this.state;
    const { width, height, edges, nodes } = this.props;

    return <svg className='edges' width={ width } height={ height }>
      {
        edges.valueSeq().map(edge => {
          const id = edge.get('id');

          const fromNode = nodes.get(edge.getIn([ 'from', 'id' ]));

          if (!fromNode) { return null; }

          const toNode = nodes.get(edge.getIn([ 'to', 'id' ]));

          let targetX, targetY;

          if (toNode) {
            const toNodeInlets = nodeSpecs[toNode.get('type')].spec.inlets.map(prop('id'));
            const inletIdx     = toNodeInlets.indexOf(edge.getIn([ 'to', 'inlet' ]));

            targetX = toNode.get('x') + 12 + 34 * inletIdx;
            targetY = toNode.get('y') + 8;
          }
          else if (id === 'dragging') {
            targetX = edge.get('x');
            targetY = edge.get('y');
          }

          return <line
            key={ id }
            onClick={ () => this.onClickEdge(id) }
            className={ classNames('edge', { 'edge--selected': selectedId === id }) }
            x1={ fromNode.get('x') + 12 }
            y1={ fromNode.get('y') + 96 }
            x2={ targetX }
            y2={ targetY }
          />
        })
      }
    </svg>;
  }
}

const mapDispatchToProps = (dispatch) => ({
  deleteEdge: (id) => dispatch(deleteEdge(id))
});

export default connect(null, mapDispatchToProps)(enhanceWithClickOutside(EditorEdges));
