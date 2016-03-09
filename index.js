const Twitter = require('twitter')
const credentials = require('./credentials.json')
const bole = require('bole')

const log = bole('richard')
createClient({ logLevel: 'debug' })

function createClient (config) {
  bole.output({ level: config.logLevel, stream: process.stdout })

  log.info('bot started')

  const client = new Twitter(credentials)
  const query = 'when is mens day'
  client.stream('statuses/filter', { track: query }, function (stream) {
    stream.on('data', function (tweet) {
      const message = tweet.text
      const user = tweet.user.screen_name
      const tweetId = tweet.id_str

      // let's not tweet at ourselves
      if (/Nov 19 RT/.test(message)) return

      sendTweet(user, message, tweetId)
    })
    stream.on('error', log.error)
  })

  function sendTweet (user, msg, tweetId) {
    var status = 'Nov 19 RT '
    status += '@' + user + ': '
    status += msg
    status = status.substr(0, 139)

    const data = {
      in_reply_status_id: tweetId,
      status: status
    }

    client.post('statuses/update', data, function (error, tweet, response) {
      if (error) log.error(error)
      log.info('tweet: ' + tweet.text)
    })
  }
}
