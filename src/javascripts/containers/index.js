import React, { Component, Fragment } from 'react';
import Blog from './blog';
import Home from './home';

class App extends Component {
  render() {
    return (
      <Fragment>
        <Blog />
        <Home />
      </Fragment>
    );
  }
}

export default App;