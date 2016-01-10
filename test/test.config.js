'use strict';

require('should');
var assert = require('assert');
var moduleon = require('../index');

describe('sql Moduleon config', function() {

  it('should be able to take into account the config', function (done) {

  	moduleon.setConfig({'engine': 'pg'})

  	var _sql = 'SELECT * {{= value }} {{= value2 }}';

  	var tplFunc = moduleon('config_pg_tpl', _sql);
  	var request_obj = tplFunc({'value': 1, 'value2': 2 });

  	assert.equal( request_obj.sql , 'SELECT * $1 $2');

  	moduleon.setConfig({'engine': 'mysql'})

    done();
  });

});