// src/javascripts/components/files.js
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { map, isEqual } from 'lodash';

class Files extends Component {
  constructor() {
    super()
  }

  componentDidMount() {
    const { loadContents, match: { params: { name } } } = this.props;
    setTimeout(() => loadContents(name), 300);
  }

  componentWillReceiveProps(nextProps) {
    const { loadContents, match: { params: { name } }, contents: { status } } = nextProps;
    if (!isEqual(this.props.match, nextProps.match)) {
      setTimeout(() => loadContents(name), 300);
      NProgress.set(0.6);
    }
    if (status === 'succeeded') setTimeout(() => NProgress.done(), 500);
  }

  render() {
    const { match: { params: { name } }, contents: { info: { raw } } } = this.props;
    return (
      <div className='files'>
        <div className='header'>
          <h3 className='title'>list</h3>
        </div>
        <div className='body'>
          <div className='tree'>
            <Tree data={raw} title={'---'} visible={true} location={`/blog/${name}`} />
          </div>
        </div>
      </div>
    );
  }
}

class Tree extends Component {
  constructor(props) {
    super();
    this.state = {
      visible: false | props.visible,
    }
  }
  
  toggle = () => {
    this.setState({visible: !this.state.visible});
  }

  render() {
    const { data, title, location } = this.props;
    const { visible } = this.state;
    const slice = (str, end) => str['slice'](0, end);
    return (
      <Fragment>
        <div onClick={this.toggle}>
          <span>{visible ? '=' : '+'}</span>
          <span>{title}</span>
        </div>
        <ul className={visible ? 'show-block' : 'hide'}>
          {map(data, (v, k) => (
            typeof v === 'string' 
            ? (
              <li key={k}>
                <Link to={`${location}/${slice(k, 4)}`}>{`* ${k}: ${slice(v, 10)}...`}</Link>
              </li>
            )
            : (
              <li key={k}>
                <Tree data={v} title={k} location={`${location}/${k}`} />
              </li>
            )
          ))}
        </ul>
      </Fragment>
    );
  }
}


export default Files;