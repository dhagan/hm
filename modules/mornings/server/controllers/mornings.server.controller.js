'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Morning = mongoose.model('Morning'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Morning
 */
exports.create = function(req, res) {
  var morning = new Morning(req.body);
  morning.user = req.user;

  morning.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(morning);
    }
  });
};

/**
 * Show the current Morning
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var morning = req.morning ? req.morning.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  morning.isCurrentUserOwner = req.user && morning.user && morning.user._id.toString() === req.user._id.toString();

  res.jsonp(morning);
};

/**
 * Update a Morning
 */
exports.update = function(req, res) {
  var morning = req.morning;

  morning = _.extend(morning, req.body);

  morning.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(morning);
    }
  });
};

/**
 * Delete an Morning
 */
exports.delete = function(req, res) {
  var morning = req.morning;

  morning.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(morning);
    }
  });
};

/**
 * List of Mornings
 */
exports.list = function(req, res) {
  Morning.find().sort('-created').populate('user', 'displayName').exec(function(err, mornings) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(mornings);
    }
  });
};

/**
 * Morning middleware
 */
exports.morningByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Morning is invalid'
    });
  }

  Morning.findById(id).populate('user', 'displayName').exec(function (err, morning) {
    if (err) {
      return next(err);
    } else if (!morning) {
      return res.status(404).send({
        message: 'No Morning with that identifier has been found'
      });
    }
    req.morning = morning;
    next();
  });
};
