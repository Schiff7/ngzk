/* /public/src/javascript/components/paper.js */
import React from 'react';

const Paper = () => {
  return (
    <div className='paper'>
      <div className='content'>
        <Header />
        <Body />
        <Bottom />
      </div>
    </div>
  );
}

const Header = () => {
  return (
    <div className='header'>
      <div className='brace'>
        <div className='date'>
          <div className='year-month'>2018/02</div>
          <div className='day'>22</div>
          <div className='week'>Mon</div>
        </div>
        <div className='author-and-title'>
          <div className='author'>与田祐希</div>
          <div className='title'>たろうとゆうきとごんぞうと。  個人ブログスタート！与田祐希</div>
        </div>
      </div>
    </div>
  );
}

const Body = () => {
  return (
    <div className='body'></div>
  );
}

const Bottom = () => {
  return (
    <div className='bottom'></div>
  );
}

const Tools = () => {
  return (
    <div className='tools'></div>
  );
}

export default Paper;