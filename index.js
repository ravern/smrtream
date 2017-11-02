const fs = require('fs');

const Twitter = require('twitter');
const secrets = require('./secrets.json');

var twitter = new Twitter({
  consumer_key: secrets.consumer_key,
  consumer_secret: secrets.consumer_secret,
  access_token_key: secrets.access_token_key,
  access_token_secret: secrets.access_token_secret,
});

const stream = twitter.stream('statuses/filter', {track: 'MRT, SMRT, LRT, Delay'});
const output = fs.createWriteStream('output.txt', {flags: 'a'});

stream.on('data', function(event) {
  if (!event.text.startsWith('RT')) {
    const json = JSON.stringify({
      author: event.user.screen_name,
      content: event.text,
      retweets: event.retweet_count,
      replies: event.reply_count,
    }, null, 4);
    output.write(json);
    output.write("\n");
    console.log('Tweet received!');
    delete event.user;
    console.log(event.text);
  }
});

stream.on('error', function(err) {
  throw err;
});

stream.on('end', function() {
  output.end();
});
