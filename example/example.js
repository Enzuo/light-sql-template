var moduleon = require('sql-moduleon');

var sql = '{{? shouldSelect }}SELECT * FROM table WHERE id= {{= id }}{{?}}';

var template = moduleon( sql );

var query = template({ shouldSelect : true, id : 3 });

console.log('request : '+query.sql);
console.log('values : '+query.values);
