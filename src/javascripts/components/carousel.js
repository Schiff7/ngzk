import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

class Carousel extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className='carousel'>
        <div className='carousel-inner'>
          <ul>
            <li></li>
          </ul>
        </div>
      </div>
    );
  }
}