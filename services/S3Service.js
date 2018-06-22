const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const config = require('../config');

/**
 * S3 Service, abstracts the communication with S3
 */
module.exports = {

  /**
   * Upload File to pre-configured bucket
   * @param {*} file
   * @param {function} callback 
   */
  uploadFile: function(file, callback) {
    const uploadParams = {
      Bucket: config.BucketName,
      Key: file.name,
      Body: file.data
    };

    s3.putObject(uploadParams, callback);
  }
}