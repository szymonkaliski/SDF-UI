import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Editor from './components/editor';
import Preview from './components/preview';

import FlexColumn from './ui/flex/column';
import FlexRow from './ui/flex/row';

import './index.css';

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
  <App />,
  document.getElementById('root')
);
