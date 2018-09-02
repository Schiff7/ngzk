/* /public/src/javascript/components/nav.js */
import React from 'react';
import { Field, reduxForm } from 'redux-form';

const Nav = ({ 
  handleSelect, 
  handleSubmit, 
  handleClickOnBack, 
  handleClickOnList, 
  handleClickOnProfile, 
  display, 
  profile, 
  readingList, 
}) => {
  return (
    <div className={`nav ${display.nav}`}>
      <div className='content'>
        <Top handleSubmit={handleSubmit} display={display} />
        <Left 
          handleSelect={handleSelect} 
          handleClickOnList={handleClickOnList} 
          handleClickOnProfile={handleClickOnProfile} 
          display={display} 
          profile={profile} 
          readingList={readingList} 
        />
      </div>
    </div>
  );
}

const Left = ({ 
  handleSelect, 
  handleClickOnList, 
  handleClickOnProfile, 
  display, 
  profile, 
  readingList, 
}) => {
  return (
    <div className={`left ${display.left}`}>
      <div className='content'>
        <Profile handleClickOnProfile={handleClickOnProfile} profile={profile} />
        <ReadingList handleSelect={handleSelect} handleClickOnList={handleClickOnList} readingList={readingList} />
      </div>
    </div>
  );
}

const Profile = ({ handleClickOnProfile, profile }) => {
  return (
    <div className='profile'>
      <div className='content'>
        <div className='avatar'></div>
        <div className='data'></div>
      </div>
    </div>
  );
}

const ReadingList = ({ handleSelect, handleClickOnList, readingList }) => {
  return (
    <div className='reading-list'></div>
  );
}

const Top = ({ handleSubmit, display }) => {
  return (
    <div className={`top ${display.top}`}>
      <div className='content'>
        <div>
          <Logo />
          <Search handleSubmit={handleSubmit} />
        </div>
        <div>
          <Menu />
        </div>
        <div>

        </div>
      </div>
    </div>
  );
}

const Logo = () => {
  return (<div className='logo'></div>);
}

const Search = ({ handleSubmit }) => {
  return (
    <div className='search'>
      <Form onSubmit={handleSubmit} />
    </div>
  );
}

const Menu = () => {
  return (<div className='menu'></div>)
}

const Form = reduxForm({ form: 'search' })(
  ({handleSubmit}) => {
    return (
      <form className='form' onSubmit={handleSubmit}>
        <div className='input-wrapper'>
          <label className='input-label'>
            <Field id='search-input' name='name' component='input' type='text' />
            <button type='submit'>***</button>
          </label>
        </div>
      </form>
    );
  }
)

export default Nav;