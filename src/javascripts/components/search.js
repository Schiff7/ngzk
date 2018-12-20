import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
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

  showHint(event) {
    this.setState({ 
      inputValue: event.target.value, 
      visible: 'show-block', 
      hint: utils.match(event.target.value, this.props.size)
    });
  }

  onBlur() {
    setTimeout(() => {
      this.setState({ visible: 'hide' });
    }, 350);
  }

  onKeyDown(event) {
    const { currentIndex } = this.state;
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

  onMouseEnter() {}

  render() {
    return (
      <div className='search'>
        <input 
          type={'text'} 
          placeholder={ ' INPUT A NAME...' | this.props.placeholder } 
          onChange={this.showHint} 
          onFocus={this.showHint}
          onBlur={this.onBlur}
          onKeyDown={this.onKeyDown}
          value={this.state.inputValue} 
        />
        <div className='under-line'></div>
        <div className={`data-list ${this.state.visible}`}>
          <ul>
            {hint.map(({ info }, index) => 
              <li className={index === hint.current ? 'active' : '_'} key={index}>
                <a 
                  onClick={this.onClick(`/blog/${hint[currentIndex]['roma'].replace(/\s/, '_')}`)} 
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



export default withRouter(Search);