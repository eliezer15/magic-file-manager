const AWS = require('aws-sdk');
AWS.config.loadFromPath('config/aws.json');

const dynamoDb = new AWS.DynamoDB();
const config = require('../config/config');


module.exports = {

  /**
   * Save a File Item to the Table
   * @param {object} fileInfo
   */
  putFileItem: function(fileInfo) {
    const params = {
      Item: {
        'Id': {
          'S': fileInfo.Id 
        },
        'Filename': {
          'S': fileInfo.Filename
        },
        'ByteSize': {
          'N': fileInfo.ByteSize.toString()
        },
        'DateUploaded': {
          'S': fileInfo.DateUploaded
        }
      },
      TableName: config.TableName
    };

    return new Promise((resolve, reject) => {
      dynamoDb.putItem(params, (err, resp) => {
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
   * Get File Item by Id, returns empty object if not found
   * @param {*} id 
   */
  getFileItem: function(id) {
    const params = {
      Key: {
        'Id': {
          'S': id
        }
      },
      TableName: config.TableName
    };

    return new Promise((resolve, reject) => {
      dynamoDb.getItem(params, (err, resp) => {
        if (err) {
          reject(err);
        }
        else if (resp.Item) {
          const fileInfo = {
            Id: resp.Item.Id.S,
            Filename: resp.Item.Filename.S,
            ByteSize: resp.Item.ByteSize.N,
            DateUploaded: new Date(resp.Item.DateUploaded.S)
          };
          resolve(fileInfo);
        }
        else {
        resolve(undefined);
        }
      });
    });
  }
};
