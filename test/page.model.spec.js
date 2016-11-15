var chai = require('chai');
var expect = chai.expect;
var models = require('../models')
var spies = require('chai-spies');
chai.use(spies);

var page = models.Page;


describe('Page model', function () {
  describe('A subcategory', function () {
    it('tests something');
    it('tests another aspect of the same thing');
  });
  describe('A different subcategory');
});