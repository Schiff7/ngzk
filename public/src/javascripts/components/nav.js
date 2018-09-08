/* /public/src/javascript/components/nav.js */
import React from 'react';
import { Field, reduxForm } from 'redux-form';
import logo from '@/images/others/ngzk.jpg';

const Nav = ({ handleInput, hint }) => {
  return (
    <div className='nav'>
      <div className='content'>
        <div className='search-wrapper'>
          <Logo />
          <Search handleInput={handleInput} hint={hint} />
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
      <img src={logo} />
    </div>
  );
}

const Search = ({ handleInput, hint }) => {
  return (
    <div className='search'>
      <Form handleInput={handleInput} hint={hint} />
    </div>
  );
}

const renderField = ({input, type, handleInput}) => {
  const _handleInput = ({target}) => handleInput(target.value);
  return (
    <input 
      {...input} 
      type={type} 
      id='search-input' 
      placeholder='Input a name...' 
      onInput={_handleInput}
      onFocus={_handleInput}
      onBlur={() => handleInput('')}
    />
  );
}

const Form = reduxForm({ form: 'search' })(
  ({handleInput, hint}) => {
    return (
      <form className='form'>
        <div className='input-wrapper'>
          <label className={`input-label ${hint.inputStyle}`}>
            <Field name='name' handleInput={handleInput} component={renderField} type='text' />
          </label>
        </div>
        <div className={`data-list ${hint.visible}`}>
          <ul>
            {hint.list.map((item, index) => (
              <li key={index}>
                <a>{`${item.info.name} (${item.info.roma})`}</a>
              </li>
            ))}
          </ul>
        </div>
      </form>
    );
  }
)

const Menu = () => {
  return (<div className='menu'></div>)
}

const User = () => {
  return (<div className='user'></div>)
}

export default Nav;