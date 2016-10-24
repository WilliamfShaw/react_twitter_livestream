import React, { Component } from 'react';

const propTypes = {
  tweetData: React.PropTypes.object.isRequired,
}

const Tweet = ({ tweetData }) => {
  const { text, screen_name, profile_image_url } = tweetData;
  return (
    <div className="panel panel-default">
      <div className="panel-body text-center">
        <img src={profile_image_url} alt="..." className="img-rounded" />
        <p className="lead">{text}</p>
        <a className="btn btn-default" href={`https://twitter.com/search?q=${screen_name}`} role="button">{screen_name}</a>
      </div>
    </div>
  );
};

Tweet.propTypes = propTypes;

export default Tweet;
