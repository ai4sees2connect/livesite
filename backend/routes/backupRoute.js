const express = require("express");
const dotenv = require("dotenv");
const { google } = require('googleapis');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');



dotenv.config();
const router = express.Router();

const SERVICE_ACCOUNT_KEY_FILE = path.join(__dirname,'..', 'credentials', 'internsnest-4a7ac7e7acaf.json'); // Ensure this path is correct


router.get('/', (req, res) => {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  
  // Update the mongodump command to include parallel collections and batch size
  const dumpCommand = `mongodump --uri="${process.env.MONGO_URI}" --archive --gzip --collection=students --db=test `;

  // Authenticate using the service account key file
  const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_KEY_FILE,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

  auth.getClient().then(client => {
    const drive = google.drive({ version: 'v3', auth: client });

    // Start the mongodump process
    const dumpProcess = exec(dumpCommand);

    let allChunks = [];

    // Handle the stdout (stream data)
    dumpProcess.stdout.on('data', (chunk) => {
      console.log(`Chunk size: ${chunk.length} bytes`);
      
      // Ensure the chunk is a Buffer
      if (typeof chunk === 'string') {
        chunk = Buffer.from(chunk, 'utf8');
      }
      
      allChunks.push(chunk);  // Collect all chunks
      console.log(`Collected ${allChunks.length} chunks so far`);
    });

    // Handle stderr (error during mongodump)
    dumpProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    // Handle process close
    dumpProcess.on('close', () => {
      try {
        // Once the dump process finishes, combine all chunks into one buffer
        const fullBackup = Buffer.concat(allChunks);
        
        // Create a readable stream from the combined buffer
        const readableStream = Readable.from(fullBackup);

        const request = {
          resource: {
            name: `backup_${timestamp}.gz`,
            parents: [process.env.DRIVE_FOLDER_ID],
          },
          media: {
            mimeType: 'application/gzip',
            body: readableStream, // Pass the entire backup as a stream
          },
          fields: 'id',
        };

        // Upload to Google Drive
        drive.files.create(request, (err, file) => {
          if (err) {
            console.error('Error uploading to Google Drive:', err);
            return res.status(500).send('Backup upload failed.');
          }
          console.log('Backup uploaded to Google Drive:', file.data.id);
          res.send('Backup created and uploaded to Google Drive successfully.');
        });
      } catch (uploadError) {
        console.error('Error processing stream for upload:', uploadError);
        res.status(500).send('Backup failed during upload.');
      }
    });
  }).catch(error => {
    console.error('Error authenticating with Google:', error);
    res.status(500).send('Authentication failed.');
  });
});



module.exports = router;