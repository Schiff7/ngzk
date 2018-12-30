/* /public/src/javascript/containers/home.js */
import React from 'react';
import { Route } from 'react-router-dom';
import { Home } from 'containers';

export default () => <Route exact path='/' component={Home} />