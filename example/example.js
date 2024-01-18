var moduleon = require('sql-moduleon');

var sql = '{{? shouldSelect }}SELECT * FROM table WHERE id= {{= id }}{{?}}';

var sqlFn = moduleon( sql );

var {sql, values} = sqlFn({ shouldSelect : true, id : 3 });

console.log('query : ', sql);
console.log('values : ', values);

// execute the parameterized query
// db.query(sql, values)
