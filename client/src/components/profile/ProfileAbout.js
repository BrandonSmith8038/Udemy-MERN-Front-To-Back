import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from '../../validation/is-empty';

class ProfileAbout extends Component {
  render() {
    const { profile } = this.props;
    let firstName;

    // Get First Name
    if (profile.user) {
      firstName = profile.user.name.trim().split(' ')[0];
    }

    // Skills List
    let skills;
    if (profile.skills) {
      skills = profile.skills.map((skill, index) => (
        <div key={index} className="p-3">
          <i className="fa fa-check" /> {skill}
        </div>
      ));
    }

    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <div className="card card-body bg-light mb-3">
              <h3 className="text-center text-info">{firstName}'s Bio</h3>
              <p className="lead text-center">
                {isEmpty(profile.bio) ? (
                  <span>{firstName} Does Not Have A Bio</span>
                ) : (
                  <span>{profile.bio}</span>
                )}
              </p>
              <hr />
              <h3 className="text-center text-info">Skill Set</h3>
              <div className="row">
                <div className="d-flex flex-wrap justify-content-center align-items-center mx-auto">
                  {skills}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ProfileAbout.propTypeps = {
  profile: PropTypes.object.isRequired,
};
export default ProfileAbout;
