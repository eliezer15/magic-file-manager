const express = require('express');
const router = express.Router();

const s3Service = require('../services/S3Service');
const dynamoDbService = require('../services/DynamoDBService');
const idGenerator = require('../services/IdGenerator');

router.get('/api/files', (req, res) => {
  return res.status(200).send('You did it!');
});

router.post('/api/files', (req, res) => {
  if (!req.files) {
    return res.status(400).json({
      status: 'BadRequest',
      message: 'No file received'
    });
  }
  
  const file = req.files.file;

  const fileInfo = {
    id: idGenerator.generateRandomId(),
    filename: file.name,
    byteSize: file.data.byteLength,
    dateUploaded: new Date().toISOString()
  };

  s3Service.uploadFile(fileInfo.id, file.data, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        status: 'InternalServerError',
        message: 'Error uploading file!'
      });
    } 
    else {

      dynamoDbService.putFile(fileInfo, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            status: 'InternalServerError',
            message: 'Error uploading file!'
          });
        }
        else {
          return res.json(fileInfo);
        }
      });
    }
  })
});

module.exports = router;
