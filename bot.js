var HTTPS = require('https');

function getID (group) {
  var kv = {
    process.env.RISKY_GROUP: process.env.RISKY_ID,
    process.env.VEGAS_GROUP: process.env.VEGAS_ID,
    process.env.TEST_GROUP: process.env.TEST_ID,
    'default': process.env.TEST_ID
  };
  return kv[group] || kv['default'];
}

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /\/roll/;
  var botID;

  console.log(request.group_id, getID(request.group_id));
  if(request.text && botRegex.test(request.text)) {
    this.res.writeHead(200);
    postMessage(botID);
    this.res.end();
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage(botID) {
  var botResponse, options, body, botReq;

  botResponse = "" + (Math.floor(Math.random() * 6) + 1);

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };
  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
    console.log(res.statusMessage)
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;
