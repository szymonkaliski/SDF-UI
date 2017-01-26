/* global firebase */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import thunk from 'redux-thunk';
import { connect, Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import Editor from './components/editor';
import Navbar from './components/navbar';
import Preview from './components/preview';

import appStore from './reducers';
import { updateWindowSize } from './actions/window-size';

import './index.css';

const store = createStore(appStore, applyMiddleware(thunk));

firebase.initializeApp({
  apiKey:            process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain:        'sdf-ui.firebaseapp.com',
  databaseURL:       'https://sdf-ui.firebaseio.com',
  storageBucket:     'sdf-ui.appspot.com',
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID
});

class App extends Component {
  constructor() {
    super();

    this.onResize = this.onResize.bind(this);
  }

  componentDidMount() {
    this.onResize();
    window.addEventListener('resize', this.onResize);
  }

  componentWillUmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize() {
    this.props.updateWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  render() {
    return <div className='app'>
      <Editor/>
      <Preview/>
      <Navbar/>
    </div>
  }
};

const mapDispatchToProps = (dispatch) => ({
  updateWindowSize: (windowSize) => dispatch(updateWindowSize(windowSize))
});

const AppConnected = connect(null, mapDispatchToProps)(App);

ReactDOM.render(
  <Provider store={ store }>
    <AppConnected />
  </Provider>,
  document.getElementById('root')
);
