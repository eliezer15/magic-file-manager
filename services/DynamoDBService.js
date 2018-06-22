const AWS = require('aws-sdk');
AWS.config.loadFromPath('config/aws.json');

const dynamoDb = new AWS.DynamoDB();
const config = require('../config/config');

module.exports = {
  putFile: function(fileInfo, callback) {
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

    console.log(params);

    dynamoDb.putItem(params, callback);
  }
}
