const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URL = process.env.REDIRECT_URL;

const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

module.exports = {
  getAuthUrl: () => {
    return oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/contacts'],
    });
  },
  getOAuth2Client: () => {
    return oAuth2Client;
  },
};
