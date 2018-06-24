const request = require('supertest');
const proxyquire = require('proxyquire');
const expect = require('chai').expect;
const sinon = require('sinon');

describe('Files endpoint', function() {
  var app, s3Stub, dynamoStub, route;
  
  beforeEach(function() {
    s3Stub = {
      uploadFile: sinon.stub(),
      downloadFile: sinon.stub()
    };

    dynamoStub = {
      putFileItem: sinon.stub(),
      getFileItem: sinon.stub(),
      getAllFileItems: sinon.stub()
    };

    route = proxyquire('../routes/files.js', {
      '../services/S3Service': s3Stub,
      '../services/DynamoDBService': dynamoStub
    });

    app = proxyquire('../app.js', {
      './routes/files': route
    });
  });

  describe('GET /api/files', function() {
    if ('returns 200 if dynamo request succeeded', function(done) {
      //Arrange
      const files = [{Filename:'test'}];
      dynamoStub.getAllFileItems.resolves(files);

      //Act & Assert
      request(app)
      .get('/api/files/')
      .expect('Content-type', /json/)
      .expect(200, file, done);
    });

    if ('returns 500 if dynamo request failed', function(done) {
      //Arrange
      dynamoStub.getAllFileItems.rejects('error');

      //Act & Assert
      request(app)
      .get('/api/files/')
      .expect('Content-type', /json/)
      .expect(500, done);
    });
  });

  describe('GET /api/files/id', function() {
    it('returns 404 if file does not exist', function(done) {
      //Arrange
      dynamoStub.getFileItem.resolves(undefined);

      //Act & Assert
      request(app)
        .get('/api/files/123')
        .expect('Content-type', /json/)
        .expect(404, done);
    });

    it('returns 500 if an error occurs', function(done) {
      //Arrange
      dynamoStub.getFileItem.rejects('error');

      //Act & Assert
      request(app)
        .get('/api/files/123')
        .expect('Content-type', /json/)
        .expect(500, done);
    });

    it('returns 200 and file if it finds it', function(done) {
      //Arrange
      const file = {Filename: 'test'};
      dynamoStub.getFileItem.resolves(file);

      //Act & Assert
      request(app)
        .get('/api/files/123')
        .expect('Content-type', /json/)
        .expect(200, file, done);
    });
  });

  describe('GET /api/files/id/download', function() {
    it('returns 404 if file does not exist', function(done) {
      //Arrange
      dynamoStub.getFileItem.resolves(undefined);

      //Act & Assert
      request(app)
        .get('/api/files/123/download')
        .expect('Content-type', /json/)
        .expect(404, done);
    });

    it('returns 500 if a dynamo error occurs', function(done) {
      //Arrange
      dynamoStub.getFileItem.rejects('error');

      //Act & Assert
      request(app)
        .get('/api/files/123/download')
        .expect('Content-type', /json/)
        .expect(500, done);
    });

    it('returns 500 if an s3 error occurs', function(done) {
      //Arrange
      dynamoStub.getFileItem.resolves({});
      s3Stub.downloadFile.rejects('error');

      //Act & Assert
      request(app)
        .get('/api/files/123/download')
        .expect('Content-type', /json/)
        .expect(500, done);
    });

    it('returns 200 and file if it finds it', function(done) {
      //Arrange
      const file = {Filename: 'test'};
      const fileData = {Body: '123'};
      dynamoStub.getFileItem.resolves(file);
      s3Stub.downloadFile.resolves(fileData);

      //Act & Assert
      request(app)
        .get('/api/files/123/download')
        .expect('Content-Disposition', `attachment; filename=${file.Filename}`)
        .expect(200, fileData.Body, done);
    });
  });

  describe('POST /api/files', function() {
    it('returns 400 if no file is uploaded', function(done) {
      //Act & Assert
      request(app)
        .post('/api/files')
        .expect('Content-type', /json/)
        .expect(400, done);
    });
  });
});