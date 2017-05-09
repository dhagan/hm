'use strict';

describe('Mornings E2E Tests:', function () {
  describe('Test Mornings page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/mornings');
      expect(element.all(by.repeater('morning in mornings')).count()).toEqual(0);
    });
  });
});
