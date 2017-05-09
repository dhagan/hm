(function () {
  'use strict';

  angular
    .module('mornings')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Mornings',
      state: 'mornings',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'mornings', {
      title: 'List Mornings',
      state: 'mornings.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'mornings', {
      title: 'Create Morning',
      state: 'mornings.create',
      roles: ['user']
    });
  }
}());
