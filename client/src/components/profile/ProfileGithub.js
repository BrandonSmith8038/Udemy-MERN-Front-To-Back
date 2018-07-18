import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ProfileGithub extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clientId: '613339f3d257273eb1c0',
      clientSecret: 'b04ad2ff1eb6f4b4bb9b3ff6603ea2561dafe4ee',
      count: 5,
      sort: 'created: asc',
      repos: [],
    };
  }

  componentDidMount() {
    const { username } = this.props;
    const { count, sort, clientId, clientSecret } = this.state;

    fetch(
      `https://api.github.com/users/${username}/repos?per_page=${count}&sort=${sort}&client_id=${clientId}&client_secret=${clientSecret}`
    )
      .then(res => res.json())
      .then(data => {
        if (this.refs.myRef) {
          this.setState({
            repos: data,
          });
        }
      })
      .catch(err => console.log(err));
  }
  render() {
    const { repos } = this.state;
    const repoItems = repos.map(repo => (
      <div key={repo.id} className="card card-body mb-2">
        <div className="row">
          <div className="col-md-6">
            <h4>
              <a href={repo.html_url} className="text-info" target="_blank">
                {repo.name}
              </a>
            </h4>
            <p>{repo.description}</p>
          </div>
          <div className="col-md-6">
            <span className="badge bade-info mr-1">Stars: {repo.stargazers_count}</span>
            <span className="badge bade-secondary mr-1">Watchers: {repo.watchers_count}</span>
            <span className="badge bade-sucesss">Forks: {repo.forks_count}</span>
          </div>
        </div>
      </div>
    ));
    return (
      <div ref="myRef">
        <hr />
        <h3 className="mb-4">Latest Github Repos</h3>
        {repoItems}
      </div>
    );
  }
}

ProfileGithub.propType = {
  username: PropTypes.string.isRequired,
};
export default ProfileGithub;
