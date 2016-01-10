'use strict';

require('should');
var fs = require('fs');
var lsqlt = require('../index');

describe('Global usage', function() {

  it('should create a template function from a sql string', function (done) {

  	var tplFunc = lsqlt('my_tpl', 'SELECT * FROM table');

  	(tplFunc).should.be.a.Function();

    done();
  });

  it('should retrieve already created templates instead of creating new ones', function(done) {

  	var tplFunc = lsqlt('remaining_tpl', 'SELECT * FROM table');
  	(tplFunc).should.be.a.Function();

  	var tplFunc2 = lsqlt('remaining_tpl', 'DROP TABLE');
  	(tplFunc2).should.be.a.Function();

  	//tplFunc2 should be equal to tplFunc and not equal to tplFunc3
  	var tplFunc3 = lsqlt('3_tpl', 'DROP TABLE');
  	(tplFunc3).should.be.a.Function();	

  	//2 == 1
  	(tplFunc2.toString()).should.be.equal(tplFunc.toString());
  	(tplFunc2).should.be.equal(tplFunc);
  	//2 != 3
  	(tplFunc3.toString()).should.not.be.equal(tplFunc2.toString());

  	done();
  });

  it('should return false when we need to create a template but didn\'t provide SQL to generate it from', function(done){
  	var tplFunc = lsqlt('another_tpl');
  	console.log(JSON.stringify( tplFunc.toString(), null, 2 ));
  	(tplFunc).should.be.equal(false);
  	done();
  });

  it('should keep in memory the already loaded templates', function(done){
  	var lsqlt = require('../index');
   	var tplFunc = lsqlt('my_tpl', 'SELECT * FROM table');
  	(tplFunc).should.be.a.Function();
    done(); 	
  });

  it('should be able to handle messy sql strings', function(done){

		var sql = fs.readFileSync(__dirname + '/in.sql').toString();

		console.log('sql before--->', sql);

		//get the templating function corresponding to your sql file
		//If the .sql file has already been parse it'll load the appropriate function corresponding to 'filename'
		var sqltFunc = lsqlt( 'imported_sql' , sql );

		var sqlObj = sqltFunc({ id : 2 });

		console.log('------------SQL-------> ', sqlObj.sql);

		done();
  
  });

});