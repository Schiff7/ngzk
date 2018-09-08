/* /public/src/javascript/containers/box.js */
import { connect } from 'react-redux';
import Box from 'components/box';
import { toggleOptions, hideOptions } from 'actions/box';

const mapStateToProps = ({ box: { options } }) => ({
  options
})

const mapDispatchToProps = dispatch => ({
  handleClickOnInput: () => dispatch(toggleOptions()),
  handleBlurOnInput: () => dispatch(hideOptions())
})

export default connect(mapStateToProps, mapDispatchToProps)(Box);