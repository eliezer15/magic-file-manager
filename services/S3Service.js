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
   * @param {string} id
   * @param {buffer} fileData
   * @param {function} callback 
   */
  uploadFile: function(id, fileData) {
    const uploadParams = {
      Bucket: config.BucketName,
      Key: id,
      Body: fileData
    };

    return new Promise((resolve, reject) => {
      s3.putObject(uploadParams, async (err, resp) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(resp);
        }
      });
    });
  },

  /**
   * Download File by Id
   * @param {string} id
   */
  downloadFile: function(id) {
    const params = {
      Key: id,
      Bucket: config.BucketName
    };

    return new Promise((resolve, reject) => {
      s3.getObject(params, (err, resp) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(resp);
        }
      });
    });
  }
};