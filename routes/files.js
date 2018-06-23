const express = require('express');
const router = express.Router();

const s3Service = require('../services/S3Service');
const dynamoDbService = require('../services/DynamoDBService');
const idGenerator = require('../services/IdGenerator');

router.get('/api/files', async(req, res) => {
  try {
    const files = await dynamoDbService.getAllFileItems();
    return res.json(files);
  }
  catch(err) {
    console.log(err);
    return res.status(500).json({
      status: 'InternalServerError',
      message: 'An unexpected error occured'
    });
  }
});

router.get('/api/files/:fileId', async (req, res) => {
  try {
    const fileInfo = await dynamoDbService.getFileItem(req.params.fileId);
    if (fileInfo) {
      res.json(fileInfo)
    }
    else {
      return res.status(404).send({
        status: 'NotFound',
        message: 'File not found'
      });
    }
  }
  catch(err) {
    console.log(err);
    return res.status(500).json({
      status: 'InternalServerError',
      message: 'An unexpected error occured'
    });
  }
});

router.get('/api/files/:fileId/download', async (req, res) => {
  try {
    const fileInfo = await dynamoDbService.getFileItem(req.params.fileId);
    if (fileInfo) {
      const fileData = await s3Service.downloadFile(fileInfo.Id);
      res.set('Content-Disposition', `attachment; filename=${fileInfo.Filename}`);
      res.send(fileData.Body);
    }
    else {
      return res.status(404).send({
        status: 'NotFound',
        message: 'File not found'
      });
    }
  }
  catch(err) {
    console.log(err);
    return res.status(500).json({
      status: 'InternalServerError',
      message: 'An unexpected error occured'
    });
  }
});

router.post('/api/files', async (req, res) => {

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

  try {
    await s3Service.uploadFile(fileInfo.Id, file.data);
    await dynamoDbService.putFileItem(fileInfo);
    return res.json(fileInfo);
  }
  catch(err) {
    console.log(err);
    return res.status(500).json({
      status: 'InternalServerError',
      message: 'An unexpected error occured'
    });
  }
});

module.exports = router;
