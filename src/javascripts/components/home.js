/* /public/src/javascript/components/home.js */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { homeActions } from 'actions/home';
import '@/stylesheets/home.styl';

class Home extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    document.addEventListener('touchmove', function (e) {
        e.preventDefault()
    })
    let c = document.getElementsByTagName('canvas')[0],
        x = c.getContext('2d'),
        pr = window.devicePixelRatio || 1,
        w = window.innerWidth,
        h = window.innerHeight,
        f = 120,
        q,
        m = Math,
        r = 0,
        u = m.PI*2,
        v = m.cos,
        z = m.random
    c.width = w*pr
    c.height = h*pr
    x.scale(pr, pr)
    x.globalAlpha = 0.6

    function i(){
        x.clearRect(0, 0, w, h)
        q=[{ x: 0, y: h * .7 + f },{ x: 0, y: h * .7 - f }]
        while(q[1].x < w + f) d(q[0], q[1])
    }
    function d(i,j){   
        x.beginPath()
        x.moveTo(i.x, i.y)
        x.lineTo(j.x, j.y)
        let k = j.x + (z() * 2 - 0.25) * f,
            n = y(j.y)
        x.lineTo(k, n)
        x.closePath()
        r -= u / -50
        // x.fillStyle = '#'+(v(r)*127+128<<16 | v(r+u/3)*127+128<<8 | v(r+u/3*2)*127+128).toString(16)
        x.fillStyle = '#7e1083'
        x.fill()
        q[0] = q[1]
        q[1] = { x: k, y: n }
    }
    function y(p){
        let t = p + ( z() * 2 - 1.1) * f
        return ( t > h / 2 || t < 0 ) ? y(p) : t
    }
    // document.onclick = i
    // document.ontouchstart = i
    i()
  }

  render() {
    
    return (
      <div className='home'>
        <section>
          <div className='pic-wrapper'>
            <span>Nogizaka 46</span>
            <div className='pic' />
            <div className='bottom' />
            <div className='bottom-middle' />
            <div className='bottom' />
          </div>
        </section>
        <section>
          <div className='search-wrapper'>
            <canvas />
            <Search />
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
})

export const Search = connect(mapStateToProps, mapDispatchToProps)((props) => {
  const { hint, handleInput } = props;
  const _handleInput = (e) => handleInput(e.target.value);
  return (
    <div className='search'>
      <input 
        type='text' 
        placeholder=' INPUT A NAME...' 
        onChange={_handleInput} 
        onFocus={_handleInput}
        onBlur={() => setTimeout(handleInput, 150)}
        value={hint.value} 
      />
      <div className={`data-list ${hint.visible}`}>
        <ul>
          {hint.list.map(({ info }, index) => 
            <li key={index}>
              <Link 
                onClick={() => handleInput(info.name)}
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