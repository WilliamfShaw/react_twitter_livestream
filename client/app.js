import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import Tweet from './tweet'

class App extends Component {
  constructor() {
    super();
    const host = location.origin.replace(/^http/, 'ws');
    const socket = io.connect(host);
    this.state = {
      socket,
      tweets: [],
      wordCount: {
        cubs: 0,
        indians: 0,
      },
    };
  }

  componentDidMount() {
    this.state.socket.on('tweet', (data) => {
      let tweetsArray = this.state.tweets;
      tweetsArray.length > 25 ? tweetsArray = [data] : tweetsArray.unshift(data);
      this.wordFreq(data.text)
      this.setState({
        tweets: tweetsArray,
      });
    });
  }

  wordFreq(string) {
    const words = string.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()@]/g,"").split(/\s/);
    const countMap = this.state.wordCount;
    words.forEach((word) => {
      const key = word.toLowerCase();
      if (!countMap[key]) {
        countMap[key] = 0;
      }
      countMap[key] += 1;
    });

    this.setState({
      wordCount: countMap,
    });
  }

  render() {
    return (
      <div>
        <div className="col-md-offset-1 col-md-10 container col-md-offset-1">
          <div className="jumbotron">
            <h1>Who gets Tweeted More</h1>
            <h3>The Cubbies: {this.state.wordCount.cubs}</h3>
            <h3>The Indians: {this.state.wordCount.indians}</h3>
          </div>
        </div>
        <div className="col-md-6 col-md-offset-3">
          <div className="row text-center">
            <h2>Live World Series Tweets</h2>
          </div>
          {
            this.state.tweets.map((tweet) => {
              return (
                <Tweet
                  tweetData={tweet}
                  key={tweet.id}
                />
              );
            })
          }
        </div>
      </div>
    );
  }
};

ReactDOM.render(<App />, document.querySelector('.root'));
