const express = require('express');
const { google } = require('googleapis');
const auth = require('./auth');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

function formatPhoneNumber(phoneNumber) {
  const formattedNumber = phoneNumber.replace(/^0/, '+62');
  return formattedNumber;
}

app.get('/auth', (req, res) => {
  const authUrl = auth.getAuthUrl();
  res.redirect(authUrl);
});

app.get('/auth/google/callback', async (req, res) => {
  try {
    const code = req.query.code;
    const oAuth2Client = auth.getOAuth2Client();

    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    res.send('Login Suksesx');
  } catch (error) {
    res.send('Error during authentication');
  }
});

app.get('/addContact', async (req, res) => {
  const phoneNumber = req.query.phone;

  if (!phoneNumber) {
    return res.send('Phone number not provided');
  }

  const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

  try {
    const contacts = google.people({ version: 'v1', auth: auth.getOAuth2Client() });

    const response = await contacts.people.connections.list({
      resourceName: 'people/me',
      personFields: 'phoneNumbers'
    });

    const connections = response.data.connections || [];

    const contactExists = connections.some((contact) => {
    const phones = contact.phoneNumbers || [];
      return phones.some((phone) => {
        const canonicalForm = phone.canonicalForm || '';
        console.log(`originalPhoneNumber: ${phoneNumber}`);
        console.log(`res canonicalForm: ${canonicalForm}`);
        console.log(`formattedPhoneNumber: ${formattedPhoneNumber}`);
        return formattedPhoneNumber === canonicalForm;
      });
    });

    if (contactExists) {
      res.send('Contact already exists');
    } else {
      const phoneWithoutHyphens = phoneNumber.replace(/-/g, '');
      const newContact = {
        names: [
          {
            givenName: 'agen',
            familyName: phoneNumber,
          },
        ],
        phoneNumbers: [
          {
            value: phoneWithoutHyphens,
          },
        ],
      };

      await contacts.people.createContact({
        requestBody: newContact,
      });

      res.send('Contact added successfully');
    }
  } catch (error) {
    console.log(error);
    res.send('Error checking or adding contact');
  }
});




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
