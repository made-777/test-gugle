const fs = require('fs');
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/addContact';

// Function to remove duplicates from a text file
const removeDuplicatesFromFile = async (filename) => {
  try {
    const data = await fs.promises.readFile(filename, 'utf-8');
    const lines = data.split('\n');
    const uniqueLines = Array.from(new Set(lines));
    const cleanedData = uniqueLines.join('\n');
    await fs.promises.writeFile(filename, cleanedData);
  } catch (err) {
    throw err;
  }
};

// Function to add contacts from a text file
async function addContacts(filename) {
  try {
    const data = await fs.promises.readFile(filename, 'utf-8');
    const phoneNumbers = data.split('\n').map(line => {
      const parts = line.split(':');
      if (parts.length > 1) {
        return parts[1].trim();
      }
      return '';
    });

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
  } catch (error) {
    throw error;
  }
}

async function main() {
  const filename = 'numbers.txt';
  try {
    await removeDuplicatesFromFile(filename);
    console.log('Duplicates removed from numbers.txt.');

    //await addContacts(filename);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

main();
