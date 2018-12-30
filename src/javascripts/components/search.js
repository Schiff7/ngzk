// src/javascripts/components/search.js
import React, { Component } from 'react';
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

  onBlur = () => {
    setTimeout(() => {
      this.setState({ visible: 'hide' });
    }, 350);
  }

  onKeyDown = (event) => {
    const { hint, currentIndex } = this.state;
    const { history, size } = this.props;
    switch (event.keyCode) { 
      case 38:
        this.setState({ currentIndex: currentIndex === 0 ? size - 1 : currentIndex - 1 });
        break;
      case 40:
        this.setState({ currentIndex: currentIndex === size - 1 ? 0 : currentIndex + 1 });
        break;
      case 13:
        history.push({ pathname: `/blog/${hint[currentIndex]['roma'].replace(/\s/, '_')}` });
        break;
      default:
        break;
    }
  }

  onClick = (pathname) => () => {
    const { history } = this.props;
    history.push(pathname); 
  }

  onMouseEnter = (index) => {
    this.setState({ currentIndex: index });
  }

  render() {
    return (
      <div className='search'>
        <input 
          type={'text'} 
          placeholder={ ' INPUT A NAME...' || this.props.placeholder } 
          onChange={this.showHint} 
          onFocus={this.showHint}
          onBlur={this.onBlur}
          onKeyDown={this.onKeyDown}
          value={this.props.search.value} 
        />
        <div className='under-line'></div>
        <div className={`data-list ${this.state.visible}`}>
          <ul>
            {this.state.hint.map(({ info }, index) => 
              <li className={index === this.state.currentIndex ? 'active' : '_'} key={index}>
                <a 
                  onClick={this.onClick(`/blog/${this.state.hint[this.state.currentIndex]['roma'].replace(/\s/, '_')}`)} 
                  onMouseEnter={this.onMouseEnter}
                  children={`${info.name} (${info.roma})`}
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