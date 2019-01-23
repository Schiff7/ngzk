/* /public/src/javascript/containers/home.js */
import React from 'react';
import { Route } from 'react-router-dom';
import { Home, Search } from 'containers';

export default () => <Route exact path='/' render={() => (
  <Home>
    <section>
      <div className='pic-wrapper'>
        <div className='dream'>
          <span className='_ngzk' data-text='Nogizaka'>Nogizaka </span>
          <span className='_46' data-text='46'>46</span>
        </div>
        <div className='pic' />
        <div className='bottom' />
        <div className='bottom-middle' />
        <div className='bottom' />
      </div>
    </section>
    <section>
      <div className='search-wrapper'>
        <Search size={5} />
      </div>
    </section>
    <section>
      <div className='grid-wrapper'>

      </div>
    </section>
  </Home>
)}/>