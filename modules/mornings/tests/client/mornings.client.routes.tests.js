(function () {
  'use strict';

  describe('Mornings Route Tests', function () {
    // Initialize global variables
    var $scope,
      MorningsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _MorningsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      MorningsService = _MorningsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('mornings');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/mornings');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          MorningsController,
          mockMorning;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('mornings.view');
          $templateCache.put('modules/mornings/client/views/view-morning.client.view.html', '');

          // create mock Morning
          mockMorning = new MorningsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Morning Name'
          });

          // Initialize Controller
          MorningsController = $controller('MorningsController as vm', {
            $scope: $scope,
            morningResolve: mockMorning
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:morningId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.morningResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            morningId: 1
          })).toEqual('/mornings/1');
        }));

        it('should attach an Morning to the controller scope', function () {
          expect($scope.vm.morning._id).toBe(mockMorning._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/mornings/client/views/view-morning.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          MorningsController,
          mockMorning;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('mornings.create');
          $templateCache.put('modules/mornings/client/views/form-morning.client.view.html', '');

          // create mock Morning
          mockMorning = new MorningsService();

          // Initialize Controller
          MorningsController = $controller('MorningsController as vm', {
            $scope: $scope,
            morningResolve: mockMorning
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.morningResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/mornings/create');
        }));

        it('should attach an Morning to the controller scope', function () {
          expect($scope.vm.morning._id).toBe(mockMorning._id);
          expect($scope.vm.morning._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/mornings/client/views/form-morning.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          MorningsController,
          mockMorning;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('mornings.edit');
          $templateCache.put('modules/mornings/client/views/form-morning.client.view.html', '');

          // create mock Morning
          mockMorning = new MorningsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Morning Name'
          });

          // Initialize Controller
          MorningsController = $controller('MorningsController as vm', {
            $scope: $scope,
            morningResolve: mockMorning
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:morningId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.morningResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            morningId: 1
          })).toEqual('/mornings/1/edit');
        }));

        it('should attach an Morning to the controller scope', function () {
          expect($scope.vm.morning._id).toBe(mockMorning._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/mornings/client/views/form-morning.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
