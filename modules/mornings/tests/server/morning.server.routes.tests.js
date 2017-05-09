'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Morning = mongoose.model('Morning'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  morning;

/**
 * Morning routes tests
 */
describe('Morning CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Morning
    user.save(function () {
      morning = {
        name: 'Morning name'
      };

      done();
    });
  });

  it('should be able to save a Morning if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Morning
        agent.post('/api/mornings')
          .send(morning)
          .expect(200)
          .end(function (morningSaveErr, morningSaveRes) {
            // Handle Morning save error
            if (morningSaveErr) {
              return done(morningSaveErr);
            }

            // Get a list of Mornings
            agent.get('/api/mornings')
              .end(function (morningsGetErr, morningsGetRes) {
                // Handle Mornings save error
                if (morningsGetErr) {
                  return done(morningsGetErr);
                }

                // Get Mornings list
                var mornings = morningsGetRes.body;

                // Set assertions
                (mornings[0].user._id).should.equal(userId);
                (mornings[0].name).should.match('Morning name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Morning if not logged in', function (done) {
    agent.post('/api/mornings')
      .send(morning)
      .expect(403)
      .end(function (morningSaveErr, morningSaveRes) {
        // Call the assertion callback
        done(morningSaveErr);
      });
  });

  it('should not be able to save an Morning if no name is provided', function (done) {
    // Invalidate name field
    morning.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Morning
        agent.post('/api/mornings')
          .send(morning)
          .expect(400)
          .end(function (morningSaveErr, morningSaveRes) {
            // Set message assertion
            (morningSaveRes.body.message).should.match('Please fill Morning name');

            // Handle Morning save error
            done(morningSaveErr);
          });
      });
  });

  it('should be able to update an Morning if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Morning
        agent.post('/api/mornings')
          .send(morning)
          .expect(200)
          .end(function (morningSaveErr, morningSaveRes) {
            // Handle Morning save error
            if (morningSaveErr) {
              return done(morningSaveErr);
            }

            // Update Morning name
            morning.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Morning
            agent.put('/api/mornings/' + morningSaveRes.body._id)
              .send(morning)
              .expect(200)
              .end(function (morningUpdateErr, morningUpdateRes) {
                // Handle Morning update error
                if (morningUpdateErr) {
                  return done(morningUpdateErr);
                }

                // Set assertions
                (morningUpdateRes.body._id).should.equal(morningSaveRes.body._id);
                (morningUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Mornings if not signed in', function (done) {
    // Create new Morning model instance
    var morningObj = new Morning(morning);

    // Save the morning
    morningObj.save(function () {
      // Request Mornings
      request(app).get('/api/mornings')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Morning if not signed in', function (done) {
    // Create new Morning model instance
    var morningObj = new Morning(morning);

    // Save the Morning
    morningObj.save(function () {
      request(app).get('/api/mornings/' + morningObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', morning.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Morning with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/mornings/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Morning is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Morning which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Morning
    request(app).get('/api/mornings/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Morning with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Morning if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Morning
        agent.post('/api/mornings')
          .send(morning)
          .expect(200)
          .end(function (morningSaveErr, morningSaveRes) {
            // Handle Morning save error
            if (morningSaveErr) {
              return done(morningSaveErr);
            }

            // Delete an existing Morning
            agent.delete('/api/mornings/' + morningSaveRes.body._id)
              .send(morning)
              .expect(200)
              .end(function (morningDeleteErr, morningDeleteRes) {
                // Handle morning error error
                if (morningDeleteErr) {
                  return done(morningDeleteErr);
                }

                // Set assertions
                (morningDeleteRes.body._id).should.equal(morningSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Morning if not signed in', function (done) {
    // Set Morning user
    morning.user = user;

    // Create new Morning model instance
    var morningObj = new Morning(morning);

    // Save the Morning
    morningObj.save(function () {
      // Try deleting Morning
      request(app).delete('/api/mornings/' + morningObj._id)
        .expect(403)
        .end(function (morningDeleteErr, morningDeleteRes) {
          // Set message assertion
          (morningDeleteRes.body.message).should.match('User is not authorized');

          // Handle Morning error error
          done(morningDeleteErr);
        });

    });
  });

  it('should be able to get a single Morning that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Morning
          agent.post('/api/mornings')
            .send(morning)
            .expect(200)
            .end(function (morningSaveErr, morningSaveRes) {
              // Handle Morning save error
              if (morningSaveErr) {
                return done(morningSaveErr);
              }

              // Set assertions on new Morning
              (morningSaveRes.body.name).should.equal(morning.name);
              should.exist(morningSaveRes.body.user);
              should.equal(morningSaveRes.body.user._id, orphanId);

              // force the Morning to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Morning
                    agent.get('/api/mornings/' + morningSaveRes.body._id)
                      .expect(200)
                      .end(function (morningInfoErr, morningInfoRes) {
                        // Handle Morning error
                        if (morningInfoErr) {
                          return done(morningInfoErr);
                        }

                        // Set assertions
                        (morningInfoRes.body._id).should.equal(morningSaveRes.body._id);
                        (morningInfoRes.body.name).should.equal(morning.name);
                        should.equal(morningInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Morning.remove().exec(done);
    });
  });
});
