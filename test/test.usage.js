'use strict';

require('should');
var fs = require('fs');
var assert = require('assert');

var moduleon = require('../index');

describe('Global usage', function() {

	it('should create a template function from a sql string', function (done) {

		var tplFunc = moduleon('SELECT * FROM table');

		(tplFunc).should.be.a.Function();

		done();
	});

	it('should be able to handle messy sql strings', function(done){

		var sql = fs.readFileSync(__dirname + '/in.sql').toString();

		console.log('---------SQL before------->');
		console.log(sql);

		//get the templating function corresponding to your sql file
		var tplFunc = moduleon( sql );
		(tplFunc).should.be.a.Function();
		var sqlObj = tplFunc({ id : 2 });

		console.log('---------SQL after------->');
		console.log(sqlObj.sql);

		done();

  });

  it('should be able to handle complete file', function() {
    this.timeout(10000);
    var sql = fs.readFileSync(__dirname + '/complete.sql').toString();
    var tplFunc = moduleon(sql);
    var query = tplFunc({
      ids: [1,2,3,4],
      col1: 'test1',
      col3: 5,
    });
    console.log(query.sql);
    assert.equal(query.values[0], 1)
    assert.equal(query.values[1], 2)
    assert.equal(query.values[2], 3)
    assert.equal(query.values[3], 4)
    assert.equal(query.values[4], 'test1')
    assert.equal(query.values[5], 5)
    assert.equal(query.values[6], 5)
  });


  // 2679ms for 100 000 runs
  it('should measure performances : build', function() {
    this.timeout(10000);
    var sql = fs.readFileSync(__dirname + '/complete.sql').toString();
    benchmark(100000, function(){
      moduleon(sql);
    });
  });

  // 19ms for 100 000 runs
  it('should measure performances : execute', function() {
    var sql = fs.readFileSync(__dirname + '/complete.sql').toString();
    var tpl = moduleon(sql);
    var values = {
      ids: [1,2,3,4],
      col1: 'test1',
      col2: 'test2',
      col3: 5,
    };
    benchmark(100000, function(){
      tpl(values);
    });
  });

});


function benchmark(nbRuns, testFunction){
  var startTime = Date.now();
  for (var i=0; i<nbRuns; i++) {
    testFunction();
  }
  var endTime = Date.now();
  var diffTime = endTime - startTime;
  var log = `total ${diffTime}ms, avg ${diffTime/nbRuns}ms`;
  console.log(log);
}
