var chai = require('chai');
var expect = chai.expect;
var spies = require('chai-spies');
chai.use(spies);

//console.log("Twas brillig and the slithy toves");
describe('simple test', function(){
  it('can do 2+2 = 4', function(){
    expect(2 + 2).to.equal(4);
  });
});

describe('asynchronous', function(){
  it('can set timeout for ~1000ms', function(){
    var start = new Date();
    //can also do it with passing in done and calling done at end instead of return
    return setTimeout(function() {
      var duration = new Date() - start;
      expect(duration).to.be.within(1000, 1020);
    }, 1000);
  });
});

describe('spy', function(){
  it('forEach invokes its function once for every element', function(){
    var randArray = [1, 2, 3, 4, 5, 6, 7, 8];
    var func = function(num) {return -num;};
    var spyer = chai.spy(func);
    randArray.forEach(spyer);
    expect(spyer).to.have.been.called(randArray.length);
  });
});
