var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var models = require('../models')
var spies = require('chai-spies');

chai.use(spies);

var Page = models.Page;

describe('Page model', function () {

  describe('Virtuals', function () {
	var page;
	beforeEach('Sync and empty our student table', function (done) {
        Page.sync({force: true})
            .then(function () {
                done();
            })
            .catch(done);
    });

	beforeEach(function(){
		page = Page.build({
			title: 'Cool Cats',
			content: 'Cats are really really cool',
			status: 'open',
			tags: ['cats','cool']
		});

		page.save();
	});

    describe('route', function () {
      it('returns the url_name prepended by "/wiki/"', function(){
      	page.urlTitle = "Cool_Cats";
      	expect(page.route).to.equal('/wiki/Cool_Cats');
      });
    });
    describe('renderedContent', function () {
      it('converts the markdown-formatted content into HTML', function(){
      	page.content = 'This is a paragraph';
      	expect(page.renderedContent).to.equal('<p>This is a paragraph</p>\n');
      });
    });
  });

  describe('Class methods', function () {
	var page;
	beforeEach('Sync and empty our student table', function (done) {
        Page.sync({force: true})
            .then(function () {
                done();
            })
            .catch(done);
    });

	beforeEach(function(){
		page = Page.build({
			title: 'Cool Cats',
			content: 'Cats are really really cool',
			status: 'open',
			tags: ['cats','cool']
		});

		page.save();
	});

    describe('findByTag', function () {
      it('gets pages with the search tag', function(){
      	return Page.findByTag('cats')
      		.then(function(page){
      			expect(page).to.have.lengthOf(1);
      		});
      });
      it('does not get pages without the search tag',function(){
      	return Page.findByTag('dog')
      		.then(function(page){
      			expect(page).to.have.lengthOf(0);
      		});      	
      });
    });
  });

  describe('Instance methods', function () {
	var page;
	beforeEach('Sync and empty our student table', function (done) {
        Page.sync({force: true})
            .then(function () {
                done();
            })
            .catch(done);
    });
	var cat;
	beforeEach(function(){
		var buildPage1 = Page.build({
			title: 'Cool Cats',
			content: 'Cats are really really cool',
			status: 'open',
			tags: ['cats','cool']
		});

		var buildPage2 = Page.build({
			title: 'Cool Dogs',
			content: 'Dogs are cool, but not as cool as cats',
			status: 'open',
			tags: ['cats','cool','dog']
		});

		var buildPage3 = Page.build({
			title: 'Testing',
			content: 'I hate testing',
			status: 'open',
			tags: ['testing','programming','grace hopper']
		});		
		cat = buildPage1.save();
		buildPage2.save();
		buildPage3.save();
	});

    describe('findSimilar', function () {
      it('never gets itself', function(){
  	    Page.findByTag('testing')
  		.then(function(pages){
  			assert(pages[0].title === "Testing");
  			return pages[0].findSimilar();
  		}).then(function(pages) {
  			expect(pages).to.have.lengthOf(0);
  		});
      });
      it('gets other pages with any common tags', function() {
      	cat.then(function(page) {
      		return page.findSimilar();
      	})
      	.then(function(pages) {
      		expect(pages).to.have.lengthOf(1);
      	})
      });
      it('does not get other pages without any common tags', function() {
      	cat.then(function(page) {
      		assert(page.title === "Cool Cats");
      		return page.findSimilar();
      	})
      	.then(function(pages) {
      		expect(pages).to.not.have.lengthOf(2);
      	})
      });
    });
  });

  describe('Validations', function () {
  	var page;
	beforeEach('Sync and empty our student table', function (done) {
        Page.sync({force: true})
            .then(function () {
                done();
            })
            .catch(done);
    });
	var cat, dog, nope;
	beforeEach(function(){
		var buildPage1 = Page.build({
			content: 'Cats are really really cool',
			status: 'open',
			tags: ['cats','cool']
		});

		var buildPage2 = Page.build({
			title: 'Cool Dogs',
			status: 'open',
			tags: ['cats','cool','dog']
		});

		nope = Page.build({
			title: 'Testing',
			//urlTitle: 'Testing',
			content: 'I hate testing',
			status: 'wrong',
			tags: ['testing','programming','grace hopper']
		});		
		cat = buildPage1.validate();
		dog = buildPage2.validate();
		//nope = buildPage3.save();
	});	


    it('errors without title', function(){
    	return cat.then(function(page){
    		assert(page.errors !== undefined);
    		assert(page.errors[0].message === 'title cannot be null');
    		expect(page).to.be.an('object');
    	})
    });
    it('errors without content', function(){
    	return dog.then(function(page){
    		assert(page.errors !== undefined);
    		assert(page.errors[1].message === 'content cannot be null');
    		expect(page).to.be.an('object');
    	})
    });
    it('errors given an invalid status', function(){
    	nope.save().then().catch(function(err) {
    		expect(err.message).to.contain('enum_pages_status');
    	})
    });
  });

  describe('Hooks', function () {
  	var page;
	beforeEach('Sync and empty our student table', function (done) {
        Page.sync({force: true})
            .then(function () {
                done();
            })
            .catch(done);
    });
 	beforeEach(function(){
		page = Page.build({
			title: 'Cool Cats',
			content: 'Cats are really really cool',
			status: 'open',
			tags: ['cats','cool']
		});
	});   


    it('it sets urlTitle based on title before validating',function(){
    	page.save()
    	.then(function(page){
    		console.log(page);
    		expect(page.urlTitle).to.equal('Cool_Cats');
    	});
    	page.update({title: 'Cooler Cats'})
    	.then(function(page){
    		expect(page.urlTitle).to.equal('Cooler_Cats');
    	});
    });
  });

});