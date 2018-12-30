// src/javascripts/containers/files.js
import { connect } from 'react-redux';
import { impureActions } from 'sagas/actions';
import Files from 'components/files';

const mapStateToProps = ({ impure: { contents } }) => ({
  contents
})

const mapDispatchToProps = dispatch => ({
  loadContents: (name) => dispatch(impureActions.fetch.contents.requested(name)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Files);