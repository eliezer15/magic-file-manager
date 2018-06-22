const express = require('express');
const router = express.Router();
const s3Service = require('../services/S3Service');

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

  const uploadedFile = req.files.file;
  s3Service.uploadFile(uploadedFile, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        status: 'InternalServerError',
        message: 'Error uploading file!'
      });
    } else {
      return res.json(data);
    }
  })
});

module.exports = router;
