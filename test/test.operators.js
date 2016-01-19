'use strict';

require('should');
var assert = require('assert');
var lsqlt = require('../index');

describe('Operators : template tags', function() {

  it('should return the sql intact when no template tags', function (done) {

  	var _sql = 'SELECT * FROM table';

  	var tplFunc = lsqlt('operators_normal_tpl', _sql);
  	var request_obj = tplFunc({});

  	(request_obj.sql).should.be.equal(_sql);
    done();
  });

  it('should replace the operator {{= id }} by ? in the sql and add the value to the values array ', function (done) {

  	var _sql = 'SELECT * FROM table WHERE id = {{= id}}';

  	var tplFunc = lsqlt('operators_value_tpl', _sql);
  	var request_obj = tplFunc({ id: 3 });

  	//sql
  	assert.equal(request_obj.sql   , 'SELECT * FROM table WHERE id = ?');

  	//values
  	assert.equal(request_obj.values.length, 1);
  	assert.equal(request_obj.values[0], 3 );
  	done();
  });

  it('should replace several operator {{= id }} {{= iduser }}', function (done) {

  	var _sql = 'SELECT * FROM table WHERE iduser = {{= idUser }} AND id = {{= id }}';

  	var tplFunc = lsqlt('operators_several_value_tpl', _sql);
  	var request_obj = tplFunc({ id: 3 , idUser : 42 });

    //sql
  	assert.equal(request_obj.sql   , 'SELECT * FROM table WHERE iduser = ? AND id = ?');

  	//values
  	assert.equal(request_obj.values.length, 2);
  	assert.equal(request_obj.values[0], 42 );
  	assert.equal(request_obj.values[1], 3 );

  	done();
  });

  it('should not add sql code between conditions tags {{?}} when the condition is false', function (done){

  	var _sql = 'SELECT * {{? id }} FROM table {{?}}';

  	var tplFunc = lsqlt('operators_condition_false_tpl', _sql);
  	var request_obj = tplFunc({ id: false });

  	assert.equal(request_obj.sql, 'SELECT * ');
  	done();
  });

  it('should not add sql code between conditions tags {{?}} when the condition variable is undefined', function (done){

  	var _sql = 'SELECT * {{? id }} FROM table {{?}}';

  	var tplFunc = lsqlt('operators_condition_undefined_tpl', _sql);
  	var request_obj = tplFunc({});

  	assert.equal(request_obj.sql, 'SELECT * ');
  	done();
  });

  it('should add sql code between conditions tags {{?}} when the condition is true', function (done){

  	var _sql = 'SELECT * {{? id }} FROM table {{?}}';

  	var tplFunc = lsqlt('operators_condition_true_tpl', _sql);
  	var request_obj = tplFunc({ id: true });

  	assert.equal(request_obj.sql.trim(), 'SELECT *  FROM table');
  	done();
  });

  it('should add {{= value }} between conditions tags {{?}} when the condition is true', function (done){

  	var _sql = 'SELECT * FROM table {{? id }} WHERE id = {{= value }} {{?}}';

  	var tplFunc = lsqlt('operators_condition_true_value_tpl', _sql);
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

  	var tplFunc = lsqlt('operators_condition_true_value_false', _sql);
  	var request_obj = tplFunc({ id: false , value : 42 });

  	//sql
  	assert.equal(request_obj.sql.trim(), 'SELECT * FROM table');

  	//values
  	assert.equal(request_obj.values.length, 0);
  	done();
  });

  it('should append javascript as is with {{ code }}', function (done){
    var _sql = 'SELECT * FROM table {{ var a = 5; }} WHERE id = {{ out += a; }} AND {{ out += \'"Column"\'; }} = \'constant\'';
    var tplFunc = lsqlt('operators_code', _sql);
    var request_obj = tplFunc();
    assert.equal(request_obj.sql.trim(), 'SELECT * FROM table  WHERE id = 5 AND "Column" = \'constant\'' );
    done();
  });

  it('should append javascript as is with {{ code }} and do loops', function (done){
    var _sql = '{{ for(var i=0; i < data.nbIter; i++){ }} SELECT * FROM table ; {{ } }}';
    var tplFunc = lsqlt('operators_code', _sql);
    var request_obj = tplFunc({nbIter: 3});
    assert.equal(request_obj.sql.trim(), 'SELECT * FROM table ;  SELECT * FROM table ;  SELECT * FROM table ;' );
    done();
  });
});
