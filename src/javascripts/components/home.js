// src/javascript/components/home.js
import React, { Component } from 'react';
import { Motion, spring } from 'react-motion';
import Search from 'containers/search';

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
      this.setState({ offset: offset - innerHeight < - fullHeight ? fullHeight : offset - innerHeight });
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
              <section>
                <div className='pic-wrapper'>
                  <div className='dream'>
                    <span className='_ngzk' data-text='Nogizaka'>Nogizaka </span>
                    <span className='_46' data-text='46'>46</span>
                  </div>
                  <div className='pic' />
                  <div className='bottom' />
                  <div className='bottom-middle' />
                  <div className='bottom' />
                </div>
              </section>
              <section>
                <div className='search-wrapper'>
                  <Search size={5} />
                </div>
              </section>
              <section>
                <div className='grid-wrapper'>

                </div>
              </section>
            </div>
          }
        </Motion>
      </div>
    );
  }
}


export default Home;