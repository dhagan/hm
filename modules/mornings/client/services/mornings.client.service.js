// Mornings service used to communicate Mornings REST endpoints
(function () {
  'use strict';

  angular
    .module('mornings')
    .factory('MorningsService', MorningsService);

  MorningsService.$inject = ['$resource'];

  function MorningsService($resource) {
    return $resource('api/mornings/:morningId', {
      morningId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
