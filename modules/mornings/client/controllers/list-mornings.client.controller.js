(function () {
  'use strict';

  angular
    .module('mornings')
    .controller('MorningsListController', MorningsListController);

  MorningsListController.$inject = ['MorningsService'];

  function MorningsListController(MorningsService) {
    var vm = this;

    vm.mornings = MorningsService.query();
  }
}());
