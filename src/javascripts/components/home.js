// /src/javascript/components/home.js
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Motion, spring } from 'react-motion';
import { homeActions } from 'actions/home';

class Home extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    const { scrollInit } = this.props;
    const size = 3;
    const limit = size * window.innerHeight;
    scrollInit(limit, size);
  }

  render() {
    const { scrollUp, scrollDown, offset } = this.props;
    return (
      <div onWheel={e => { if (e.deltaY > 0) scrollDown(); else scrollUp(); }} className='home'>
        <Motion defaultStyle={{ offset: 0 }} style={{ offset: spring(offset.value) }} >
          {({ offset }) => 
            <div className='slider' style={{ transform: `translateY(${offset}px)` }}>
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
                  <Search history={this.props.history} />
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

const mapStateToProps = ({ pure: { home: { hint } } }) => ({
  hint
})

const mapDispatchToProps = dispatch => ({
  handleInput: (value) => dispatch(
    typeof value !== 'string'
    ? homeActions.home.search.value.reset() 
    : homeActions.home.search.value.set(value)
  ),
  cacheInput: (value) => dispatch(homeActions.home.search.cache.push(value)),
  moveUpCurrent: () => dispatch(homeActions.home.search.current.up()),
  moveDownCurrent: () => dispatch(homeActions.home.search.current.down()),
  setCurrent: (value) => dispatch(homeActions.home.search.current.set(value)),
})

export const Search = connect(mapStateToProps, mapDispatchToProps)((props) => {
  const { history, hint, handleInput, moveUpCurrent, moveDownCurrent, setCurrent } = props;
  const item = hint.list.length === 0 ? { name: '', roma: '' } : hint['list'][hint.current]['info'];
  const _handleInput = (e) => handleInput(e.target.value);
  const _handlekeyDown = (e) =>{ 
    switch (e.keyCode) { 
      case 38:
        moveUpCurrent(); break;
      case 40:
        moveDownCurrent(); break;
      case 13:
      setCurrent(0);
        handleInput(item.name);
        handleInput();
        history.push({ pathname: `/blog/${item.roma.replace(/\s/, '_')}` }); 
        break;
      default:
        break;
    }
  }
  return (
    <div className='search'>
      <input 
        type='text' 
        placeholder=' INPUT A NAME...' 
        onChange={_handleInput} 
        onFocus={_handleInput}
        onBlur={() => setTimeout(handleInput, 150)}
        onKeyDown={hint.visible ? _handlekeyDown : () => {}}
        value={hint.value} 
      />
      <div className='under-line'></div>
      <div className={`data-list ${hint.visible}`}>
        <ul>
          {hint.list.map(({ info }, index) => 
            <li className={index === hint.current ? 'active' : '_'} key={index}>
              <Link 
                onClick={() => handleInput(info.name)}
                onMouseEnter={() => setCurrent(index)}
                to={`/blog/${info.roma.replace(/\s/, '_')}`}
                children={`${info.name} (${info.roma})`}
              />
            </li>
          )}
        </ul>
      </div>
    </div>
  );
})



export default connect(
  ({ pure: { home: { offset } } }) => ({
    offset
  }),
  dispatch => ({
    scrollInit: (limit, size) => dispatch(homeActions.home.slider.scroll.init(limit, size)),
    scrollUp: () => dispatch(homeActions.home.slider.scroll.up()),
    scrollDown: () => dispatch(homeActions.home.slider.scroll.down())
  })
)(Home);