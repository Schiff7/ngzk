/* /public/src/javascript/components/profile.js */
import React from 'react';

const Profile = () => {
  return (
    <div className='profile'>
      <div className='content'>
        <Header />
        <Body />
      </div>
    </div>
  );
}

const Header = () => {
  return (
    <div className='header'>
      <div className='title'><h3>Profile</h3></div>
      <button>WIKI</button>
    </div>
  );
}

const Body = () => {
  return (
    <div className='body'>
      <div className='avatar'>
        <img />
      </div>
      <div className='info'>
        <h3>生田 絵梨花</h3>
        <p> 
          1997年1月22日生
          <br />
          血液型：A型
          <br />
          星座：みずがめ座
          <br />
          身長：160cm
        </p>
      </div>
    </div>
  );
}

export default Profile;