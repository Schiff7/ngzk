import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import utils from 'utils';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: props.size || 5,
      hint: [],
      history: [],
      inputValue:  props.defaultValue || '',
      visible: 'hide',
      currentIndex: 0
    };
  }

  onChange(event) {
    this.setState({ 
      inputValue: event.target.value, 
      visible: 'show-block', 
      hint: utils.match(event.target.value, this.state.size)
    });
  }

  onFocus(event) {
    this.setState({ 
      inputValue: event.target.value, 
      visible: 'show-block', 
      hint: utils.match(event.target.value, this.state.size)
    });
  }

  onBlur() {
    setTimeout(() => {
      this.setState({ visible: 'hide' });
    }, 350);
  }

  onKeyDown(event) {
    const { currentIndex, size } = this.state;
    const { history } = this.props;
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
          onChange={this.onChange} 
          onFocus={this.onFocus}
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


export const Searc = connect(mapStateToProps, mapDispatchToProps)((props) => {
  const { history, hint, handleInput, moveUpCurrent, moveDownCurrent, setCurrent } = props;
  const item = hint.list.length === 0 ? { name: '', roma: '' } : hint['list'][hint.current]['info'];
  const _handleInput = (e) => handleInput(e.target.value);
  const _handlekeyDown = (e) =>{ 
    switch (e.keyCode) { 
      case 38:
        moveUpCurrent(); break;
      case 40:
        moveDownCurrent(); break;
      case 13:
      setCurrent(0);
        handleInput(item.name);
        handleInput();
        history.push({ pathname: `/blog/${item.roma.replace(/\s/, '_')}` }); 
        break;
      default:
        break;
    }
  }
  return (
    <div className='search'>
      <input 
        type='text' 
        placeholder=' INPUT A NAME...' 
        onChange={_handleInput} 
        onFocus={_handleInput}
        onBlur={() => setTimeout(handleInput, 150)}
        onKeyDown={hint.visible ? _handlekeyDown : () => {}}
        value={hint.value} 
      />
      <div className='under-line'></div>
      <div className={`data-list ${hint.visible}`}>
        <ul>
          {hint.list.map(({ info }, index) => 
            <li className={index === hint.current ? 'active' : '_'} key={index}>
              <Link 
                onClick={() => handleInput(info.name)}
                onMouseEnter={() => setCurrent(index)}
                to={`/blog/${info.roma.replace(/\s/, '_')}`}
                children={`${info.name} (${info.roma})`}
              />
            </li>
          )}
        </ul>
      </div>
    </div>
  );
})

export default withRouter(Search);