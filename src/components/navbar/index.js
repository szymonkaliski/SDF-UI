import React from 'react';
import { connect } from 'react-redux';

import { saveGraph } from '../../actions/graph';

import './navbar.css';

const Navbar = ({ saveGraph }) => {
  return <div className='navbar' onClick={ saveGraph }>SAVE</div>
};

const mapDispatchToProps = (dispatch) => ({
  saveGraph: () => dispatch(saveGraph())
});

export default connect(null, mapDispatchToProps)(Navbar);
