const express = require('express');
const router = express.Router();

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
  uploadedFile.mv(`${uploadedFile.name}`, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        status: 'InternalServerError',
        message: 'Error uploading file'
      });
    }

    return res.json({
      id: '123',
      fileName: uploadedFile.name,
      fileSizeInBytes: 50,
    });
  });
});

module.exports = router;
