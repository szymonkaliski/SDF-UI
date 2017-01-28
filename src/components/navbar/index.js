import React, { Component } from 'react';
import autobind from 'react-autobind';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { saveToFirebase } from '../../actions/firebase';
import { toggleFullscreen } from '../../actions/preview';

import './navbar.css';

const Overlay = ({ content, onClickClose }) => {
  return <div className='overlay__wrapper'>
    <div className='overlay__close' onClick={ onClickClose }>
      CLOSE
    </div>
    <div className='overlay'>
      { content }
    </div>
  </div>;
};

class Navbar extends Component {
  constructor() {
    super();

    this.state = {
      helpVisible: false,
      glslVisible: false
    };

    autobind(this);
  }

  onClickToggleOverlay(key) {
    this.setState({ [key]: !this.state[key] });
  }

  onClickCloseOverlay() {
    this.setState({
      helpVisible: false,
      glslVisible: false
    });
  }

  onClickFullscreen() {
    this.props.toggleFullscreen();
  }

  renderGLSLOverlay() {
    return <pre>
      { this.props.fragment }
    </pre>;
  }

  render() {
    return <div className='navbar'>
      <div className='navbar__item' onClick={ () => this.onClickToggleOverlay('helpVisible') }>HELP</div>
      <div className='navbar__item' onClick={ this.props.saveToFirebase }>SAVE</div>
      <div className='navbar__item' onClick={ () => this.onClickToggleOverlay('glslVisible') }>GLSL</div>
      <div className='navbar__item' onClick={ this.onClickFullscreen }>FS</div>

      { this.state.helpVisible && <Overlay onClickClose={ this.onClickCloseOverlay } content='test' /> }
      { this.state.glslVisible && <Overlay onClickClose={ this.onClickCloseOverlay } content={ this.renderGLSLOverlay() } /> }
    </div>;
  }
};

const mapStateToProps = (state) => ({
  fragment: state.get('fragment')
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ saveToFirebase, toggleFullscreen }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
