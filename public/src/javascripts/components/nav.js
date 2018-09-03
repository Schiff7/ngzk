/* /public/src/javascript/components/nav.js */
import React from 'react';
import { Field, reduxForm } from 'redux-form';

const Nav = ({ handleSubmit, handleInput, hint }) => {
  return (
    <div className='nav'>
      <div className='content'>
        <div>
          <Logo />
          <Search handleSubmit={handleSubmit} handleInput={handleInput} hint={hint} />
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
  return (<div className='logo'></div>);
}

const Search = ({ handleSubmit, handleInput, hint }) => {
  return (
    <div className='search'>
      <Form onSubmit={handleSubmit} handleInput={handleInput} hint={hint} />
    </div>
  );
}

const renderField = ({input, type, handleInput}) => {
  return (
    <input id='search-input' placeholder='Input a name...' {...input} type={type} onInput={({target}) => handleInput(target.value)} />
  );
}

const Form = reduxForm({ form: 'search' })(
  ({handleSubmit, handleInput, hint}) => {
    return (
      <form className='form' onSubmit={handleSubmit}>
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