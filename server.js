require('dotenv').load();

const express = require('express'),
      app = express(),
      path = require('path'),
      TwitterStream = require('./utils/twitterStream'),
      webpack = require('webpack'),
      webpackConfig = require('./webpack.config.dev'),
      server = require('http').createServer(app),
      io = require('socket.io')(server);

const compiler = webpack(webpackConfig);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath,
}));

app.use(require('webpack-hot-middleware')(compiler));

TwitterStream.on('tweet', function (tweet) {
  const { text, id } = tweet;
  const { screen_name, profile_image_url } = tweet.user;
  const parsedTweet = {
    id,
    text,
    screen_name,
    profile_image_url,
  };
  console.log(parsedTweet);
  io.emit('tweet', parsedTweet);
});

TwitterStream.on('connect', res => console.log('connecting'));
TwitterStream.on('connected', res => console.log('connected'));


TwitterStream.on('error', function (err) {
  TwitterStream.stop();
  setTimeout(() => {
    TwitterStream.start();
  }, 2000);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));
