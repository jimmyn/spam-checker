'use strict';

const request = require('request');
const emojiStrip = require('emoji-strip');

const headers = {
  'Access-Control-Allow-Origin': '*', // Required for CORS support to work
  'Access-Control-Allow-Credentials': true // Required for cookies, authorization headers with HTTPS
};

module.exports.check = (event, context, callback) => {
  const input = JSON.parse(event.body);
  const email =
    "Message-ID: <4F452339.1040102@moonmail.io'>" +
    "\nDate: " + new Date().toUTCString() +
    '\nFrom: no-reply@email-campaign-manager.com' +
    '\nMIME-Version: 1.0' +
    '\nTo: "MoonMail" <hi@moonmail.io>' +
    '\nSubject: ' + emojiStrip(input.subject) +
    '\nContent-Type: text/plain; charset=utf-8' +
    '\n\n' + input.body;

  const options = {
    uri: 'https://spamcheck.postmarkapp.com/filter',
    method: 'POST',
    json: {email}
  };

  request(options, (error, response, body) => {
    console.log(error, response, body);
    if (error) callback(error);
    callback(null, {
      headers,
      statusCode: response.statusCode,
      body: JSON.stringify(body)
    });
  });
};
