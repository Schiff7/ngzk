// src/javascripts/components/search.js
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import utils from 'utils';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hint: [],
      visible: 'hide',
      currentIndex: 0
    };
  }

  showHint = (event) => {
    const { set } = this.props;
    set(event.target.value);
    this.setState({ 
      visible: 'show-block', 
      hint: utils.matches(event.target.value, this.props.size)
    });
  }

  handleBlur = () => {
    setTimeout(() => {
      this.setState({ visible: 'hide' });
    }, 350);
  }

  handleKeyDown = (event) => {
    const { hint, currentIndex } = this.state;
    const { history, size, set } = this.props;
    const _size = !size ? hint.length : size;
    switch (event.keyCode) { 
      case 38:
        this.setState({ currentIndex: currentIndex === 0 ? _size - 1 : currentIndex - 1 });
        break;
      case 40:
        this.setState({ currentIndex: currentIndex === _size - 1 ? 0 : currentIndex + 1 });
        break;
      case 13:
        set(hint[currentIndex]['member']['name']);
        history.push({ pathname: `/blog/${hint[currentIndex]['member']['roma']['replace'](/\s/, '_')}` });
        break;
      default:
        break;
    }
  }

  handleMouseEnter = (index) => () => {
    this.setState({ currentIndex: index });
  }

  handleClick = (value) => () => {
    const { set } = this.props;
    set(value);
  }

  render() {
    const { hint, currentIndex, visible } = this.state;
    return (
      <div className='search'>
        <input 
          type={'text'} 
          placeholder={ ' INPUT A NAME...' || this.props.placeholder } 
          onChange={this.showHint} 
          onFocus={this.showHint}
          onBlur={this.handleBlur}
          onKeyDown={this.handleKeyDown}
          value={this.props.search.value} 
        />
        <div className='under-line'></div>
        <div className={`data-list ${visible}`}>
          <ul>
            {hint.map(({ member }, index) => 
              <li className={index === currentIndex ? 'active' : '_'} key={index}>
                <Link 
                  onClick={this.handleClick(member['name'])}
                  to={`/blog/${member['roma']['replace'](/\s/, '_')}`} 
                  onMouseEnter={this.handleMouseEnter(index)}
                  children={`${member.name} (${member.roma})`}
                />
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }
}

export default Search;