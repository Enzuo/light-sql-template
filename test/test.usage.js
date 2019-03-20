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

		console.log('sql before--->', sql);

		//get the templating function corresponding to your sql file
		//If the .sql file has already been parse it'll load the appropriate function corresponding to 'filename'
		var sqltFunc = moduleon( sql );

		var sqlObj = sqltFunc({ id : 2 });

		console.log('------------SQL-------> ');
		console.log(sqlObj.sql);

		done();

	});

});
