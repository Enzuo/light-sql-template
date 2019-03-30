'use strict';

var assert = require('assert');
var moduleon = require('../index');

describe('sql Moduleon config', function() {
  afterEach(function(){
    moduleon.setDefaultConfig();
  });

	it('should be able to take into account the config', function () {
    var _sql = 'SELECT * {{= value }} {{= value2 }}';

		moduleon.setDefaultConfig({engine: 'pg'});
		var tplFunc = moduleon(_sql);
		var request_obj = tplFunc({value: 1, value2: 2 });

    assert.equal( request_obj.sql , 'SELECT * $1 $2');
  });

  it('should be able to overidde the default config', function () {
    var _sql = 'SELECT * {{= value }} {{= value2 }}';

		moduleon.setDefaultConfig({engine: 'pg'});
		var tplFunc = moduleon(_sql, {engine: 'mysql'});
		var request_obj = tplFunc({value: 1, value2: 2 });

    assert.equal( request_obj.sql , 'SELECT * ? ?');
  });

});
