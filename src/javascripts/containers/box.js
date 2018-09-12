/* /public/src/javascript/containers/box.js */
import { connect } from 'react-redux';
import Box from 'components/box';
import { toggleOptions, hideOptions, blur, select } from 'actions/box';

const mapStateToProps = ({ box: { options, selectedValue, blur } }) => ({
  options,
  selectedValue,
  blur
})

const mapDispatchToProps = dispatch => ({
  handleClickOnInput: () => dispatch(toggleOptions()),
  handleBlurOnInput: () => dispatch(hideOptions()),
  shouldBlur: (bool) => dispatch(blur(bool)),
  handleSelect: (value) => dispatch(select(value))
})

export default connect(mapStateToProps, mapDispatchToProps)(Box);