/* /src/javascript/components/nav.js */
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '@/images/others/ngzk.jpg';

const Nav = (props) => {
  return (
    <div className='nav'>
      <div className='content'>
        <div className='search-wrapper'>
          <Logo />
          <Search {...props} />
        </div>
        <div>
          <Menu />
        </div>
        <div>
          <User />
        </div>
      </div>
    </div>
  );
}

const Logo = () => {
  return (
    <div className='logo'>
      <Link to='/'>
        <img src={logo} />
      </Link>
    </div>
  );
}

const Search = (props) => {
  const { handleInput, shouldBlur, cacheInput, hint, blur, cache, loadProf } = props;
  const _handleInput = ({target}) => handleInput(target.value);
  const _handleClick = (item) => {
    handleInput(item.info.name); 
    handleInput(); 
    cacheInput(item.info);
    blur(true);
    loadProf(item.info.roma.replace(/\s/, '_'));
  }
  return (
    <div className='search'>
      <div className='input-wrapper'>
        <label className={`input-label ${hint.inputStyle}`}>
          <input 
            name='name'
            type='text'
            id='search-input'
            placeholder='Input a name...' 
            onChange={_handleInput}
            onFocus={_handleInput}
            onBlur={shouldBlur ? handleInput : () => {}}
            value={hint.value}
          />
        </label>
      </div>
      <div 
        className={`data-list ${hint.visible}`} 
        onMouseOver={() => blur(false)} 
        onMouseOut={() => blur(true)}
      >
        <ul>
          {hint.list.map((item, index) => (
            <li key={index}>
              <Link onClick={() =>_handleClick(item)} to={`/blog/${item.info.roma.replace(/\s/, '_')}`}>
                {`${item.info.name} (${item.info.roma})`}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const Menu = () => {
  return (<div className='menu'></div>)
}

const User = () => {
  return (<div className='user'></div>)
}

export default Nav;