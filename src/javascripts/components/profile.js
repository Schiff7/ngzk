import React, { Component } from 'react';
import { connect } from 'react-redux';
import { impureActions } from 'sagas/actions';
import { isEqual } from 'lodash';

class Profile extends Component {
  constructor() {
    super()
  }

  componentDidMount() {
    const { loadProf, match: { params: { name } } } = this.props;
    setTimeout(() => loadProf(name), 300);
  }

  componentWillReceiveProps(nextProps) {
    const { loadProf, match: { params: { name } }, prof: { status } } = nextProps;
    if (!isEqual(this.props.match, nextProps.match)) {
      setTimeout(() => loadProf(name), 300);
      NProgress.set(0.6);
    }
    if (status === 'succeeded') setTimeout(() => NProgress.done(), 500);
  }

  render() {
    const { prof: { info : { name, birthdate, constellation, abo, stature } } } = this.props;
    return (
      <div className='profile'>
        <div className='header'>
          <h3 className='title'>profile</h3>
        </div>
        <div className='body'>
          <div className='avatar'>
          </div>
          <div className='info'>
            <h3>{name}</h3>
            <p> 
              {birthdate}生
              <br />
              血液型：{abo}
              <br />
              星座：{constellation}
              <br />
              身長：{stature}
            </p>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = ({ impure: { prof } }) => ({
  prof
})

const mapDispatchToProps = dispatch => ({
  loadProf: (name) => dispatch(impureActions.fetch.prof.requested(name)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile);