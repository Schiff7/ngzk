/* /public/src/javascripts/container/nav.js */
import { connect } from 'react-redux';
import { submit, input } from '../actions/nav';
import Nav from '../components/nav';

const mapStateToProps = ({ nav: { hint } }) => ({
  hint
})

const mapDispatchToProps = dispatch => ({
  handleSubmit: (name) => dispatch(submit(name)),
  handleInput: (name) => dispatch(input(name))
})

export default connect(mapStateToProps, mapDispatchToProps)(Nav);