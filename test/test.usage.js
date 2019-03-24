'use strict';

require('should');
var fs = require('fs');
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

});
