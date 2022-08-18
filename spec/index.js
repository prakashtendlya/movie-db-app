const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');

chai.should();

chai.use(chaiHttp);

describe('GET /', () => {
  it('should return success...', (done) => {
    chai
        .request(server)
        .get('/')
        .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('message').eql('success');
        done(err);
        });
    });
});