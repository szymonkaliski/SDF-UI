import React, { Component } from 'react';
import { connect } from 'react-redux';

class Editor extends Component {
  render() {
    console.log(this.props);

    return <div>
      Editor
    </div>;
  }
}

export default connect(({ graph }) => graph)(Editor);
