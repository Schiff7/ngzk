/* /public/src/javascript/containers/profile.js */
import { connect } from 'react-redux';
import Profile from 'components/profile';

const mapStateToProps = ({ impure: { prof } }) => ({
  prof
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile);