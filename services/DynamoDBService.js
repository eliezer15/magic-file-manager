const AWS = require('aws-sdk');
AWS.config.loadFromPath('config/aws.json');

const dynamoDb = new AWS.DynamoDB();
const config = require('../config/config');


module.exports = {

  /**
   * 
   */
  putFileItem: function(fileInfo, callback) {
    const params = {
      Item: {
        'Id': {
          'S': fileInfo.id 
        },
        'Filename': {
          'S': fileInfo.filename
        },
        'ByteSize': {
          'N': fileInfo.byteSize.toString()
        },
        'DateUploaded': {
          'S': fileInfo.dateUploaded
        }
      },
      TableName: config.TableName
    };

    dynamoDb.putItem(params, callback);
  },

  getFileItem(id, callback) {
    const params = {
      Key: {
        'Id': {
          'S': id
        }
      },
      TableName: config.TableName
    };

    dynamoDb.getItem(params, callback);
  }
}
