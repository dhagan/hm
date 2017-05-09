'use strict';

/**
 * Module dependencies
 */
var morningsPolicy = require('../policies/mornings.server.policy'),
  mornings = require('../controllers/mornings.server.controller');

module.exports = function(app) {
  // Mornings Routes
  app.route('/api/mornings').all(morningsPolicy.isAllowed)
    .get(mornings.list)
    .post(mornings.create);

  app.route('/api/mornings/:morningId').all(morningsPolicy.isAllowed)
    .get(mornings.read)
    .put(mornings.update)
    .delete(mornings.delete);

  // Finish by binding the Morning middleware
  app.param('morningId', mornings.morningByID);
};
