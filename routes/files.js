const express = require('express');
const router = express.Router();

const s3Service = require('../services/S3Service');
const dynamoDbService = require('../services/DynamoDBService');
const idGenerator = require('../services/IdGenerator');

router.get('/api/files/:fileId', (req, res) => {

  dynamoDbService.getFileItem(req.params.fileId, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    console.log('result');
    console.log(result);
    const fileInfo = result.Item;

    s3Service.downloadFile(fileInfo.Id.S, (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).send('Error');
      }
      res.set('Content-Disposition', `attachment; filename=${fileInfo.Filename.S}`);
      res.send(data.Body);
    });
  });
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
    Id: idGenerator.generateRandomId(),
    Filename: file.name,
    ByteSize: file.data.byteLength,
    DateUploaded: new Date().toISOString()
  };

  s3Service.uploadFile(fileInfo.Id, file.data, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        status: 'InternalServerError',
        message: 'Error uploading file!'
      });
    } 
    else {

      dynamoDbService.putFileItem(fileInfo, (err) => {
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
