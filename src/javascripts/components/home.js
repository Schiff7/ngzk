// /src/javascript/components/home.js
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { homeActions } from 'actions/home';

class Home extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    document.addEventListener('touchmove', function (e) {
      e.preventDefault()
    })
    const canvas = document.getElementsByTagName('canvas')[0];
    const context = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const stepLength = 90;

    let functor = 0;

    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    context.scale(pixelRatio, pixelRatio);
    context.globalAlpha = 0.6;

    const main = () => {
      context.clearRect(0, 0, width, height); 
      let [ point, _point ] = [ { x: 0, y: height * .7 + stepLength }, { x: 0, y: height * .7 - stepLength } ];
      while ( _point.x < width + stepLength ) [ point, _point ] = draw(point, _point);
    }

    const draw = (point, _point) => {
      context.beginPath();
      context.moveTo(point.x, point.y);
      context.lineTo(_point.x, _point.y);
      const { x, y } = nextPoint(_point);
      context.lineTo(x, y);
      context.closePath();
      functor += Math.PI * 2 / 50;
      // context.fillStyle = '#7e1083';
      context.fillStyle = '#'+ ( 
        Math.cos(functor) * 127 + 128 << 16 | 
        Math.cos(functor + Math.PI * 2 / 3) * 127 + 128 << 8 | 
        Math.cos(functor + Math.PI * 2 / 3 * 2 ) * 127 + 128 
      ).toString(16);
      context.fill();
      return [ _point, { x, y } ];
    }
    const nextPoint = (point) => {
      const { x, y } = point;
      const _y = y + ( Math.random() * 2 - 1.1 ) * stepLength;
      const _x = x + ( Math.random() * 2 - 0.25 ) * stepLength;
      return ( _y > height || _y < 0 ) ? nextPoint(point) : { x: _x, y: _y };
    }
    // document.onclick = main;
    // document.ontouchstart = main;
    // main();
  }

  render() {
    
    return (
      <div className='home'>
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
            <canvas />
            <Search history={this.props.history} />
          </div>
        </section>
        <section>
          <div className='grid-wrapper'>

          </div>
        </section>
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



export default Home;