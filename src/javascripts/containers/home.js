/* /public/src/javascript/containers/home.js */
import React from 'react';
import { Route } from 'react-router-dom';
import Home from 'components/home';

export default () => <Route exact path='/' component={Home} />