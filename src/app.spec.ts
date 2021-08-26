import { expect } from 'chai';
import 'mocha';
import crypto from "crypto";
import request from 'request';
import dotenv from 'dotenv';
import { UserProfile } from './models/userModels';

dotenv.config();

const port = process.env.URL_PORT ? process.env.URL_PORT : 8080;
const uri = `http://localhost:${port}`;
const getCustomAuth = () => {
  const timestamp = Date.now();
  const hash = crypto.createHash('sha256').update(timestamp + process.env.SECRET).digest('hex');
  return timestamp + ':' + hash;
}

describe('TopView Test Application', () => {
  it('should return 406 when Accept header is not set properly', (done) => {
    request(uri, {}, (error, response, body) => {
      expect(response.statusCode).equal(406);
      done()
    });
  })

  it('should return 401 when no custom-auth header is missing', (done) => {
    request(uri, {
      headers: {
        "Accept": "application/json"
      }
    }, (error, response, body) => {
      expect(response.statusCode).equal(401);
      done()
    });
  })

  it('should return 401 when timestamp in custom-auth header is older than 5 seconds', (done) => {
    const customAuth = getCustomAuth();
    setTimeout(() => {
      request(uri, {
        headers: {
          "Accept": "application/json",
          "custom-auth": customAuth
        }
      }, (error, response, body) => {
          expect(response.statusCode).equal(401);
          done();
      })
    }, 5000);
  }).timeout(6000);

  it('should return Hello message on base url when headers are ok', (done) => {
    request(uri, {
      headers: {
        "Accept": "application/json",
        "custom-auth": getCustomAuth()
      }
    }, (error, response, body) => {
        expect(body).to.equal(JSON.stringify({msg: "Hello TopView!"}))
        done();
    });
  });

  it('should return array of ids on host/users url', done => {
    request(uri+'/users', {
      headers: {
        "Accept": "application/json",
        "custom-auth": getCustomAuth()
      }
    }, (error, response, body) => {
      let bodyObj = JSON.parse(body);
      expect(bodyObj).to.be.an('array');
      for(let el in bodyObj) {
        expect(el).to.be.an('string');
      }
      
      done();
    });
  });

  it('should return 404 when non-existing id is passed', done => {
    request(uri+'/users/' + "1234", {
      headers: {
        "Accept": "application/json",
        "custom-auth": getCustomAuth()
      }
    }, (error, response, body) => {
      expect(response.statusCode).equal(404);
      done();
    });
  })

  it.only('should return user info on host/users/:userId', done => {
    const userId = "4Oouu1hOdYWuuh3TBGh8K7WwHN2";

    request(uri+'/users/'+userId, {
      headers: {
        "Accept": "application/json",
        "custom-auth": getCustomAuth()
      }
    }, (error, response, body) => {
      let bodyObj = JSON.parse(body);
      expect(bodyObj).have.keys('name', 'email', 'bio', 'image');
      done();
    })
  })
});
