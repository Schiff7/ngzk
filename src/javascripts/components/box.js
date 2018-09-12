/* /public/src/javascripts/box.js */
import React from 'react';
import { Link } from 'react-router-dom';

const Box = ({
  handleClickOnInput,
  handleBlurOnInput,
  handleSelect,
  shouldBlur,
  selectedValue,
  options,
  blur,
  match
}) => {
  return (
    <div className='box'>
      <div className='content'>
        <Header />
        <Body 
          blur={blur}
          options={options}
          selectedValue={selectedValue}
          handleClickOnInput={handleClickOnInput} 
          handleBlurOnInput={handleBlurOnInput} 
          handleSelect={handleSelect}
          shouldBlur={shouldBlur}
          match={match}
        />
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

const Body = ({match, blur, options, selectedValue, handleClickOnInput, handleBlurOnInput, handleSelect, shouldBlur}) => {
  return (
    <div className='body'>
      {/* time selector */}
      <div className='time'>
        <label>
          <input 
            readOnly={true}
            className={`${options.inputStyle}`} 
            onClick={handleClickOnInput} 
            onBlur={blur.shouldBlur ? handleBlurOnInput : () => {}} 
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