const request = require('supertest');

describe('GET /', function() {
  it('should respond with a 200 and html', function(done)  {
    //Arrange
    const app = require('../app');

    //Act & Assert
    request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200, done);
  });
});