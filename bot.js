require('dotenv').config();

const tmi = require('tmi.js');

// Define configuration options
const opts = {
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_OAUTH_TOKEN
  },
  channels: [
    'dampe_bot',
    'khufufoofoo'
  ]
};

const regexCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  const [raw, command, argument] = msg.match(regexCommand)

  // If the command is known, let's execute it
  if (command === 'dig') {
    const digs = parseInt(argument)
    if(isNaN(digs)){
        client.say(target, 'Please enter a number!');
    } else {
        const stats = calculateDigProbability(digs)
        client.say(target, `The probability of ${argument} digs is ${stats.percentage}% or 1 in ${stats.odds} odds`);
    }
    console.log(`* Executed ${command} command`);
  } else {
    console.log(`* Unknown command ${command}`);
  }
}

function calculateDigProbability (digs) {
    const p = 0.1;
    const probability = Math.pow((1-p), (digs - 1)) * p ;
    const percentage = Math.round((probability * 100)*100)/100;
    const odds = Math.round(1/probability);
    const stats = {percentage: percentage, odds: odds}
    return stats;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}