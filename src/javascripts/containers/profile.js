import { connect } from 'react-redux';
import { impureActions } from 'sagas/actions';
import Profile from 'components/profile';

const mapStateToProps = ({ impure: { prof } }) => ({
  prof
})

const mapDispatchToProps = dispatch => ({
  loadProf: (name) => dispatch(impureActions.fetch.prof.requested(name)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile);