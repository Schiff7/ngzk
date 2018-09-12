/* /public/src/javascripts/container/nav.js */
import { connect } from 'react-redux';
import { input, blur, cacheInput } from 'actions/nav';
import Nav from 'components/nav';

const mapStateToProps = ({ nav: { hint, blur, cache } }) => ({
  hint,
  blur,
  cache,
})

const mapDispatchToProps = dispatch => ({
  handleInput: (name) => dispatch(input(name)),
  shouldBlur: (bool) => dispatch(blur(bool)),
  cacheInput: (name) => dispatch(cacheInput(name))
})

export default connect(mapStateToProps, mapDispatchToProps)(Nav);