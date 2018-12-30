// src/javascripts/containers/search.js
import { connect } from 'react-redux';
import Search from 'components/search';
import actions from 'actions';

const mapStateToProps = ({ pure: { search } }) => ({
  search
})

const mapDispatchToProps = dispatch => ({
  set: (value) => dispatch(actions.search.value.set(value)),
  init: (options) => dispatch(actions.search.history.init(options)),
  push: (value) => dispatch(actions.search.history.push(value)),
  clear: () => dispatch(actions.search.history.clear())
})

export default connect(mapStateToProps, mapDispatchToProps)(Search);