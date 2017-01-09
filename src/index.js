import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore } from 'redux';

import Editor from './components/editor';
import Preview from './components/preview';

import FlexColumn from './ui/flex/column';
import FlexRow from './ui/flex/row';

import appStore from './reducers';

import './index.css';

const store = createStore(appStore);

class App extends Component {
  render() {
    return <FlexRow>
      <FlexColumn>
        <Editor/>
      </FlexColumn>

      <FlexColumn>
        <Preview/>
      </FlexColumn>
    </FlexRow>;
  }
}

ReactDOM.render(
  <Provider store={ store }>
    <App />
  </Provider>,
  document.getElementById('root')
);
