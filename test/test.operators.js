'use strict';

require('should');
var assert = require('assert');
var moduleon = require('../index');

describe('Operators : template tags', function() {

	it('should return the sql intact when no template tags', function (done) {

		var _sql = 'SELECT * FROM table';

		var tplFunc = moduleon(_sql);
		var request_obj = tplFunc({});

		(request_obj.sql).should.be.equal(_sql);
		done();
	});

	describe('value tags', function() {

		it('should replace {{= id }} by ? in the sql and add the value to the values array ', function (done) {

			var _sql = 'SELECT * FROM table WHERE id = {{= id}}';

			var tplFunc = moduleon(_sql);
			var request_obj = tplFunc({ id: 3 });

			//sql
			assert.equal(request_obj.sql   , 'SELECT * FROM table WHERE id = ?');

			//values
			assert.equal(request_obj.values.length, 1);
			assert.equal(request_obj.values[0], 3 );
			done();
		});

		it('should replace several tags {{= id }} {{= iduser }}', function (done) {

			var _sql = 'SELECT * FROM table WHERE iduser = {{= idUser }} AND id = {{= id }}';

			var tplFunc = moduleon(_sql);
			var request_obj = tplFunc({ id: 3 , idUser : 42 });

			//sql
			assert.equal(request_obj.sql   , 'SELECT * FROM table WHERE iduser = ? AND id = ?');

			//values
			assert.equal(request_obj.values.length, 2);
			assert.equal(request_obj.values[0], 42 );
			assert.equal(request_obj.values[1], 3 );

			done();
		});

		it('should transform array {{= my_array }}', function (done) {

			var _sql = 'SELECT * FROM table WHERE id IN ({{= my_array }})';

			var tplFunc = moduleon(_sql);
			var request_obj = tplFunc({ my_array: [3,5] });

			//sql
			assert.equal(request_obj.sql   , 'SELECT * FROM table WHERE id IN (?,?)');

			//values
			assert.equal(request_obj.values.length, 2);
			assert.equal(request_obj.values[0], 3 );
			assert.equal(request_obj.values[1], 5 );

			done();
		});

		it('should be able to access nested values {{= obj.id }}', function (done) {

			var _sql = 'SELECT * FROM table WHERE id = {{= obj.id }}';

			var tplFunc = moduleon(_sql);
			var request_obj = tplFunc({ obj: { id: 7 } });

			//sql
			assert.equal(request_obj.sql   , 'SELECT * FROM table WHERE id = ?');

			//values
			assert.equal(request_obj.values.length, 1);
			assert.equal(request_obj.values[0], 7 );

			done();
		});
	});

	describe('condition tags', function(){

		it('should not add sql code between conditions tags {{?}} when the condition is false', function (done){

			var _sql = 'SELECT * {{? id }} FROM table {{?}}';

			var tplFunc = moduleon(_sql);
			var request_obj = tplFunc({ id: false });

			assert.equal(request_obj.sql, 'SELECT * ');
			done();
		});

		it('should not add sql code between conditions tags {{?}} when the condition variable is undefined', function (done){

			var _sql = 'SELECT * {{? id }} FROM table {{?}}';

			var tplFunc = moduleon(_sql);
			var request_obj = tplFunc({});

			assert.equal(request_obj.sql, 'SELECT * ');
			done();
		});

		it('should add sql code between conditions tags {{?}} when the condition is true', function (done){

			var _sql = 'SELECT * {{? id }} FROM table {{?}}';

			var tplFunc = moduleon(_sql);
			var request_obj = tplFunc({ id: true });

			assert.equal(request_obj.sql.trim(), 'SELECT *  FROM table');
			done();
		});

		it('should add {{= value }} between conditions tags {{?}} when the condition is true', function (done){

			var _sql = 'SELECT * FROM table {{? id }} WHERE id = {{= value }} {{?}}';

			var tplFunc = moduleon(_sql);
			var request_obj = tplFunc({ id: true , value : 42 });

			//sql
			assert.equal(request_obj.sql.trim(), 'SELECT * FROM table  WHERE id = ?');

			//values
			assert.equal(request_obj.values.length, 1);
			assert.equal(request_obj.values[0], 42 );
			done();
		});

		it('should not add {{= value }} between conditions tags {{?}} when the condition is false', function (done){

			var _sql = 'SELECT * FROM table {{? id }} WHERE id = {{= value }} {{?}}';

			var tplFunc = moduleon(_sql);
			var request_obj = tplFunc({ id: false , value : 42 });

			//sql
			assert.equal(request_obj.sql.trim(), 'SELECT * FROM table');

			//values
			assert.equal(request_obj.values.length, 0);
			done();
		});
	});

	describe('javascript tags', function(){
	it('should append javascript as is with {{ code }}', function (done){
		var _sql = 'SELECT * FROM table {{ var a = 5; }} WHERE id = {{ out += a; }} AND {{ out += \'"Column"\'; }} = \'constant\'';
		var tplFunc = moduleon(_sql);
		var request_obj = tplFunc();
		assert.equal(request_obj.sql.trim(), 'SELECT * FROM table  WHERE id = 5 AND "Column" = \'constant\'' );
		done();
	});

	it('should append javascript as is with {{ code }} and do loops', function (done){
		var _sql = '{{ for(var i=0; i < data.nbIter; i++){ }} SELECT * FROM table ; {{ } }}';
		var tplFunc = moduleon(_sql);
		var request_obj = tplFunc({nbIter: 3});
		assert.equal(request_obj.sql.trim(), 'SELECT * FROM table ;  SELECT * FROM table ;  SELECT * FROM table ;' );
		done();
	});
});
