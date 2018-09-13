/* /public/src/javascripts/box.js */
import React from 'react';
import { Link } from 'react-router-dom';

const Box = (props) => {
  return (
    <div className='box'>
      <div className='content'>
        <Header />
        <Body {...props} />
      </div>
    </div>
  );
}

const Header = () => {
  return (
    <div className='header'>
      <div className='title'><h3>List</h3></div>
      <button className='hide'>TIMELINE</button>
    </div>
  );
}

const Body = (props) => {
  const {
    match, 
    options, 
    selectedValue, 
    handleClickOnInput, 
    handleBlurOnInput, 
    handleSelect, 
    shouldBlur
  } = props;
  return (
    <div className='body'>
      {/* time selector */}
      <div className='time'>
        <label>
          <input 
            readOnly={true}
            className={`${options.inputStyle}`} 
            onClick={handleClickOnInput} 
            onBlur={shouldBlur ? handleBlurOnInput : () => {}} 
            onChange={({target}) => handleSelect(target.value)}
            placeholder='...' 
            value={selectedValue}
          />
          <span className='trangle'></span>
        </label>
        <div 
          className={`options ${options.visible}`}
          onMouseOver={() => shouldBlur(false)} 
          onMouseOut={() => shouldBlur(true)}
        >
          <ul>
            <li><Link to={`${match.url}/2018/09`} onClick={() => {handleSelect('2018/09'); handleBlurOnInput();}}>2018/09</Link></li>
          </ul>
        </div>
      </div>
      {/* separate line */}
      <Line />
      {/* reading list */}
      <div className='list'>
        <ul>
          <li><a>09/17 ...</a></li>
        </ul>
      </div>
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