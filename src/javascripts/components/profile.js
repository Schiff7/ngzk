/* /public/src/javascript/components/profile.js */
import React from 'react';

const Profile = (props) => {
  return (
    <div className='profile'>
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
      <div className='title'><h3>Profile</h3></div>
      <button className='hide'>WIKI</button>
    </div>
  );
}

const Body = (props) => {
  const { prof } = props;
  return (
    <div className='body'>
      <div className='avatar'>
        <img src={`https://nyctophilia.github.io/ngzk/src/images/member/${prof.name}.jpg`} />
      </div>
      <div className='info'>
        <h3>{prof.info.name}</h3>
        <p> 
          {prof.info.birthdate}生
          <br />
          血液型：{prof.info.abo}
          <br />
          星座：{prof.info.constellation}
          <br />
          身長：{prof.info.stature}
        </p>
      </div>
    </div>
  );
}

export default Profile;