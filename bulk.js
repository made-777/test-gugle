const fs = require('fs');
const axios = require('axios');
const readline = require('readline');

const API_BASE_URL = 'http://localhost:3000/addContact';

// Function to remove duplicate phone numbers and delete same lines from a text file
function removeDuplicatesAndDeleteSameLines(filename) {
  const uniquePhoneNumbers = new Set();
  const updatedLines = [];
  const fileStream = fs.createReadStream(filename);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  rl.on('line', (line) => {
    const parts = line.split(':');
    if (parts.length >= 1) {
      const phoneNumber = parts[1];
      if (phoneNumber && !uniquePhoneNumbers.has(phoneNumber)) {
        uniquePhoneNumbers.add(phoneNumber);
        updatedLines.push(line);
      }
    }
  });

  rl.on('close', () => {
    fs.writeFileSync(filename, updatedLines.join('\n'));
  });

  return Array.from(uniquePhoneNumbers);
}

// Function to add contacts for a list of phone numbers
async function addContacts(phoneNumbers) {
  console.log('sini a');
  for (const phoneNumber of phoneNumbers) {
    try {
      const response = await axios.get(API_BASE_URL, {
        params: {
          phone: phoneNumber,
        },
      });
      console.log(response);
      if (response.status === 200) {
        console.log(`Contact with phone number ${phoneNumber} added successfully.`);
      } else {
        console.error(`Failed to add contact with phone number ${phoneNumber}.`);
      }
    } catch (error) {
      console.error(`Error adding contact with phone number ${phoneNumber}: ${error.message}`);
    }
  }
}

(async () => {
  try {
    const phoneNumbers = removeDuplicatesAndDeleteSameLines('numbers.txt');
    console.log('sini b');
    await addContacts(phoneNumbers);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
})();
