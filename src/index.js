/* global firebase */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import thunk from 'redux-thunk';
import { connect, Provider } from 'react-redux';
import { createStore, applyMiddleware, bindActionCreators } from 'redux';

import get from 'lodash.get';
import querystring from 'querystring';

import Editor from './components/editor';
import Navbar from './components/navbar';
import Preview from './components/preview';

import appStore from './reducers';
import { readFromFirebase } from './actions/firebase';
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
    // read from firebase if we have ?id=...
    const urlId = get(querystring.parse(window.location.search.replace('?', '')), 'id');
    if (urlId) { this.props.readFromFirebase(urlId); }

    // setup resize handler
    this.onResize();
    window.addEventListener('resize', this.onResize);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.databaseKey) {
      const queryString = `?id=${nextProps.databaseKey}`;

      if (history.pushState) {
        const path = `${window.location.protocol}//${window.location.host}${window.location.pathname}${queryString}`;
        window.history.pushState({ path }, '', path);
      }
      else {
        window.location.search = queryString;
      }
    }
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

const mapStateToProps = (state) => ({
  databaseKey: state.get('databaseKey')
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ updateWindowSize, readFromFirebase }, dispatch);

const AppConnected = connect(mapStateToProps, mapDispatchToProps)(App);

ReactDOM.render(
  <Provider store={ store }>
    <AppConnected />
  </Provider>,
  document.getElementById('root')
);
