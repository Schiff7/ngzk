import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Search } from './home';

class Nav extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <nav className='nav'>
        <Search history={this.props.history} />
        <div className='menu'>
          <NavLink to='/'>home</NavLink>
          <span>•</span>
          <NavLink exact to='/blog/recent' activeClassName="selected">recent</NavLink>
        </div>
      </nav>
    );
  }
}

export default Nav;