/* /public/src/javascripts/container/nav.js */
import { connect } from 'react-redux';
import { navTop, navLeft, navHide } from '../actions/nav';
import Nav from '../components/nav';

const mapStateToProps = ({ nav: { display } }) => ({
  display,
  profile: {},
  readingList: {},
})

const mapDispatchToProps = dispatch => ({
  handleSubmit: h => dispatch(navLeft(h)),
  handleSelect: () => {},
  handleClickOnBack: h => dispatch(navTop(h)), 
  handleClickOnList: () => {}, 
  handleClickOnProfile: () => {}, 
})

export default connect(mapStateToProps, mapDispatchToProps)(Nav);