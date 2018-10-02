/* /src/javascript/containers/box.js */
import { connect } from 'react-redux';
import Box from 'components/box';
import { boxActions } from 'actions/box';

const mapStateToProps = ({ pure: { box: { options, selectedValue, shouldBlur } } }) => ({
  options,
  selectedValue,
  shouldBlur,
})

const mapDispatchToProps = dispatch => ({
  handleClickOnInput: () => dispatch(boxActions.box.selector.options.toggle()),
  handleBlurOnInput: () => dispatch(boxActions.box.selector.options.hide()),
  blur: (bool) => dispatch(
    bool 
    ? boxActions.box.selector.blur.enable() 
    : boxActions.box.selector.blur.disable()
  ),
  handleSelect: (value) => dispatch(boxActions.box.selector.select(value))
})

export default connect(mapStateToProps, mapDispatchToProps)(Box);