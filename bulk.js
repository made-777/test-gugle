const fs = require('fs');
const axios = require('axios');

const API_BASE_URL = 'https://test-gugle-mades-projects.vercel.app/addcontact';

// Function to remove lines with the same phone number from a text file
const removeLinesWithSamePhoneNumber = async (filename) => {
  try {
    const data = await fs.promises.readFile(filename, 'utf-8');
    const lines = data.split('\n');
    const uniqueLines = [];
    const seenPhoneNumbers = new Set();

    for (const line of lines) {
      const parts = line.split(':');
      if (parts.length > 1) {
        const phoneNumber = parts[1].trim();
        if (!seenPhoneNumbers.has(phoneNumber)) {
          seenPhoneNumbers.add(phoneNumber);
          uniqueLines.push(line);
        }
      }
    }

    const cleanedData = uniqueLines.join('\n');
    await fs.promises.writeFile(filename, cleanedData);
  } catch (err) {
    throw err;
  }
}

// Function to add contacts from a text file
async function addContacts(filename) {
  try {
    const data = await fs.promises.readFile(filename, 'utf-8');
    const lines = data.split('\n');
    for (const line of lines) {
      const parts = line.split(':');
      if (parts.length > 1) {
        const name = parts[0].trim();
        const phoneNumber = parts[1].trim();
        console.log(phoneNumber);
        try {
          const response = await axios.get(`https://test-gugle-mades-projects.vercel.app/addcontact?phone=${phoneNumber}`);
          console.log(response);
          if (response.status === 200) {
            console.log(`Contact with name '${name}' and phone number ${phoneNumber} added successfully.`);
          } else {
            console.error(`Failed to add contact${phoneNumber}.`);
          }
        } catch (error) {
          console.error(`Error adding contact with name '${name}' and phone number ${phoneNumber}: ${error}`);
        }
      }
    }
  } catch (error) {
    throw error;
  }
}

async function main() {
  const filename = 'numbers.txt';
  try {
    await removeLinesWithSamePhoneNumber(filename);
    console.log('Lines with the same phone number removed from numbers.txt.');

    await addContacts(filename);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

main();
