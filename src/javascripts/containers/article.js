// src/javascripts/container/article.js
import { connect } from 'react-redux';
import { impureActions } from 'sagas/actions';
import Article from 'components/article'

const mapStateToProps = ({ impure: { article } }) => ({
  article
})

const mapDispatchToProps = dispatch => ({
  loadArticle: (name) => dispatch(impureActions.fetch.article.requested(name)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Article);