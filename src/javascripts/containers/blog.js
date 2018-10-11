/* /public/src/javascripts/container/blog.js */
import React, { Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import Profile from 'components/profile';
import Files from 'components/files';
import Article from 'components/article';
import Nav from 'components/nav';

export default () => <Route path='/blog' render={() => (
  <div className='container'>
    <Route path='/blog' component={Nav} />
    <div className='blog'>
      <Switch>
        <Route path='/blog/recent' render={() => <div />} />
        <Route path='/blog/:name' render={() =>
          <Fragment>
            <div className='left'>
              <Route path='/blog/:name' component={Profile} />
              <Route path='/blog/:name' component={Files} />
            </div>
            <div className='right'>
              <Route path='/blog/:name/:y/:m/:d' component={Article} />
            </div> 
          </Fragment>
        } />
      </Switch>
    </div>
  </div>
)}/>