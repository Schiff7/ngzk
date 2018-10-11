import React, { Component } from 'react';
import { connect } from 'react-redux';
import { impureActions } from 'sagas/actions';
import { isEqual } from 'lodash';

class Article extends Component {
  constructor() {
    super()
  }

  componentDidMount() {
    const { loadArticle, match: { params: { name, y, m, d } } } = this.props;
    setTimeout(() => loadArticle(`${name}/${y}/${m}/${d}`), 300);
  }

  componentWillReceiveProps(nextProps) {
    const { loadArticle, match: { params: { name, y, m, d } }, article: { status } } = nextProps;
    if (!isEqual(this.props.match, nextProps.match)) {
      setTimeout(() => loadArticle(`${name}/${y}/${m}/${d}`), 300);
      NProgress.set(0.6);
    }
    if (status === 'succeeded') setTimeout(() => NProgress.done(), 500);
  }

  render() {
    const { article: { info: { title, content } } } = this.props;
    return (
      <div className='article'>
        <div>
          <h3>{title}</h3>
          <div className='text' dangerouslySetInnerHTML={{ __html: content }} ></div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = ({ impure: { article } }) => ({
  article
})

const mapDispatchToProps = dispatch => ({
  loadArticle: (name) => dispatch(impureActions.fetch.article.requested(name)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Article);