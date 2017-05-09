(function () {
  'use strict';

  angular
    .module('mornings')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('mornings', {
        abstract: true,
        url: '/mornings',
        template: '<ui-view/>'
      })
      .state('mornings.list', {
        url: '',
        templateUrl: 'modules/mornings/client/views/list-mornings.client.view.html',
        controller: 'MorningsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Mornings List'
        }
      })
      .state('mornings.create', {
        url: '/create',
        templateUrl: 'modules/mornings/client/views/form-morning.client.view.html',
        controller: 'MorningsController',
        controllerAs: 'vm',
        resolve: {
          morningResolve: newMorning
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Mornings Create'
        }
      })
      .state('mornings.edit', {
        url: '/:morningId/edit',
        templateUrl: 'modules/mornings/client/views/form-morning.client.view.html',
        controller: 'MorningsController',
        controllerAs: 'vm',
        resolve: {
          morningResolve: getMorning
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Morning {{ morningResolve.name }}'
        }
      })
      .state('mornings.view', {
        url: '/:morningId',
        templateUrl: 'modules/mornings/client/views/view-morning.client.view.html',
        controller: 'MorningsController',
        controllerAs: 'vm',
        resolve: {
          morningResolve: getMorning
        },
        data: {
          pageTitle: 'Morning {{ morningResolve.name }}'
        }
      });
  }

  getMorning.$inject = ['$stateParams', 'MorningsService'];

  function getMorning($stateParams, MorningsService) {
    return MorningsService.get({
      morningId: $stateParams.morningId
    }).$promise;
  }

  newMorning.$inject = ['MorningsService'];

  function newMorning(MorningsService) {
    return new MorningsService();
  }
}());
