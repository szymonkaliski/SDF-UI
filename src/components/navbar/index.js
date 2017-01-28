import React, { Component } from 'react';
import { connect } from 'react-redux';

import { saveToFirebase } from '../../actions/firebase';

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

    this.onClickToggle       = this.onClickToggle.bind(this);
    this.onClickCloseOverlay = this.onClickCloseOverlay.bind(this);
  }

  onClickToggle(key) {
    this.setState({ [key]: !this.state[key] });
  }

  onClickCloseOverlay() {
    this.setState({
      helpVisible: false,
      glslVisible: false
    });
  }

  renderGLSLOverlay() {
    return <pre>
      { this.props.fragment }
    </pre>;
  }

  render() {
    return <div className='navbar'>
      <div className='navbar__item' onClick={ () => this.onClickToggle('helpVisible') }>HELP</div>
      <div className='navbar__item' onClick={ this.props.saveToFirebase }>SAVE</div>
      <div className='navbar__item' onClick={ () => this.onClickToggle('glslVisible') }>GLSL</div>
      { this.state.helpVisible && <Overlay onClickClose={ this.onClickCloseOverlay } content='test' /> }
      { this.state.glslVisible && <Overlay onClickClose={ this.onClickCloseOverlay } content={ this.renderGLSLOverlay() } /> }
    </div>;
  }
};

const mapStateToProps = (state) => ({
  fragment: state.get('fragment')
});

const mapDispatchToProps = (dispatch) => ({
  saveToFirebase: () => dispatch(saveToFirebase())
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
