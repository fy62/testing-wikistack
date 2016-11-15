var supertest = require('supertest-as-promised')(require('../app'));
var expect = require('chai').expect;
var models = require('../models')
var Page = models.Page;

describe('wiki.js routes', function(){
	beforeEach('Sync and empty our student table', function (done) {
        Page.sync({force: true})
            .then(function () {
                done();
            })
            .catch(done);
    });

    describe('`/` URI', function(){
    	it('GET responds with an empty object at first', function(){
    		return supertest
    		.get('/')
    		.expect(302)
    		.expect(function(res){
    			expect(res.body).to.eql({});
    		});

    	});
    	it('POST creates a new page and possibly a new author if it did not exist', function(){
    		return supertest
    		.post('/')
    		.expect(function(res){
    			expect(res.body).to.eql({});
    		});

    	});
    });

});