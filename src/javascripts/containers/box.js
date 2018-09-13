/* /public/src/javascript/containers/box.js */
import { connect } from 'react-redux';
import Box from 'components/box';
import { boxActions } from 'actions/box';

const mapStateToProps = ({ box: { options, selectedValue, shouldBlur } }) => ({
  options,
  selectedValue,
  shouldBlur,
})

const mapDispatchToProps = dispatch => ({
  handleClickOnInput: () => dispatch(boxActions.box.selector.options.toggle()),
  handleBlurOnInput: () => dispatch(boxActions.box.selector.options.hide()),
  shouldBlur: (bool) => dispatch(
    bool 
    ? navActions.nav.search.blur.enable() 
    : navActions.nav.search.blur.disable()
  ),
  handleSelect: (value) => dispatch(boxActions.box.selector.select(value))
})

export default connect(mapStateToProps, mapDispatchToProps)(Box);