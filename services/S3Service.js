const AWS = require('aws-sdk');
AWS.config.loadFromPath('config/aws.json');

const s3 = new AWS.S3();
const config = require('../config/config');

/**
 * S3 Service, abstracts the communication with S3
 */
module.exports = {

  /**
   * Upload File to pre-configured bucket
   * @param {*} file
   * @param {function} callback 
   */
  uploadFile: function(id, fileData, callback) {
    const uploadParams = {
      Bucket: config.BucketName,
      Key: id,
      Body: fileData
    };

    s3.putObject(uploadParams, callback);
  }
}