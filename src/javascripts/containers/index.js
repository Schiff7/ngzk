/* /public/src/javascripts/containers/index.js */
import React from 'react';
import Box from './box';
import Profile from './profile';
import Paper from './paper';

export const Blog = ({match}) => {
  return (
    <div className='blog'>
      <div className='left'>
        <Profile />
        <Box match={match} />
      </div>
      <div className='right'>
        <Paper />
      </div>
    </div>
  );
}