(function () {
  'use strict';

  // Mornings controller
  angular
    .module('mornings')
    .controller('MorningsController', MorningsController);

  MorningsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'morningResolve'];

  function MorningsController ($scope, $state, $window, Authentication, morning) {
    var vm = this;

    vm.authentication = Authentication;
    vm.morning = morning;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Morning
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.morning.$remove($state.go('mornings.list'));
      }
    }

    // Save Morning
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.morningForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.morning._id) {
        vm.morning.$update(successCallback, errorCallback);
      } else {
        vm.morning.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('mornings.view', {
          morningId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
