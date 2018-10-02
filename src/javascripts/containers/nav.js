/* /public/src/javascripts/container/nav.js */
import { connect } from 'react-redux';
import { navActions } from 'actions/nav';
import { impureActions } from 'sagas/actions';
import Nav from 'components/nav';


const mapStateToProps = ({ pure: { nav: { hint, cache, shouldBlur } } }) => ({
  hint,
  cache,
  shouldBlur,
})

const mapDispatchToProps = dispatch => ({
  handleInput: (name) => dispatch(
    typeof name !== 'string'
    ? navActions.nav.search.value.reset() 
    : navActions.nav.search.value.set(name)
  ),
  blur: (bool) => dispatch(
    bool
    ? navActions.nav.search.blur.enable() 
    : navActions.nav.search.blur.disable()
  ),
  cacheInput: (name) => dispatch(navActions.nav.search.cache.push(name)),
  loadProf: (name) => dispatch(impureActions.fetch.prof.requested(name)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Nav);