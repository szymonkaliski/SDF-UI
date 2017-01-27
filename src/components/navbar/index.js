import React from 'react';
import { connect } from 'react-redux';

import { saveToFirebase } from '../../actions/firebase';

import './navbar.css';

const Navbar = ({ saveToFirebase }) => {
  return <div className='navbar' onClick={ saveToFirebase }>SAVE</div>
};

const mapDispatchToProps = (dispatch) => ({
  saveToFirebase: () => dispatch(saveToFirebase())
});

export default connect(null, mapDispatchToProps)(Navbar);
