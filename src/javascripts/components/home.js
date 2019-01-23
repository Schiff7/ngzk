// src/javascript/components/home.js
import React, { Component } from 'react';
import { Motion, spring } from 'react-motion';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 0,
      innerHeight: 0,
      offset: 0
    };
    this.slider = React.createRef();
  }

  componentDidMount() {
    this.setState({ 
      size: this.slider.current.children.length,
      innerHeight: window.innerHeight
    });
  }

  onWheel = (event) => {
    const { size, innerHeight, offset } = this.state;
    const fullHeight = size * innerHeight;
    if (event.deltaY > 0) {
      this.setState({ offset: offset - innerHeight < - fullHeight + innerHeight ? - fullHeight + innerHeight : offset - innerHeight });
    } else {
      this.setState({ offset: offset + innerHeight > 0 ? 0 : offset + innerHeight });
    }
  }

  render() {
    return (
      <div onWheel={this.onWheel} className='home'>
        <Motion defaultStyle={{ offset: 0 }} style={{ offset: spring(this.state.offset) }} >
          {({ offset }) => 
            <div className='slider' ref={this.slider} style={{ transform: `translateY(${offset}px)` }}>
              {this.props.children}
            </div>
          }
        </Motion>
      </div>
    );
  }
}


export default Home;