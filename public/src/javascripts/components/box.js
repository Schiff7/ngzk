/* /public/src/javascripts/box.js */
import React from 'react';

const Box = ({
  handleClickOnInput,
  handleBlurOnInput,
  options
}) => {
  return (
    <div className='box'>
      <div className='content'>
        <Header />
        <Body options={options} handleClickOnInput={handleClickOnInput} handleBlurOnInput={handleBlurOnInput} />
      </div>
    </div>
  );
}

const Header = () => {
  return (
    <div className='header'>
      <div className='title'><h3>Blog List</h3></div>
      <button>TIMELINE</button>
    </div>
  );
}

const Body = ({options, handleClickOnInput, handleBlurOnInput}) => {
  return (
    <div className='body'>
      <Time options={options} handleClickOnInput={handleClickOnInput} handleBlurOnInput={handleBlurOnInput} />
      <Line />
      <List />
    </div>
  );
}

const Time = ({options, handleClickOnInput, handleBlurOnInput}) => {
  return (
    <div className='time'>
      <label>
        <input 
          className={`${options.inputStyle}`} 
          onClick={handleClickOnInput} 
          onBlur={handleBlurOnInput} 
          placeholder='...' 
        />
        <span className='trangle'></span>
      </label>
      <div className={`options ${options.visible}`}>
        <ul>
          <li><a>2018/09</a></li>
        </ul>
      </div>
    </div>
  );
}

const List = () => {
  return (
    <div className='list'>
      <ul>
        <li><a>09/17 ...</a></li>
      </ul>
    </div>
  );
}

const Line = () => {
  return (
    <div className='line'>
      <span className='sep'></span>
      <span>BLOG</span>
      <span className='sep'></span>
    </div>
  );
}


export default Box;