#What is it ?

Make the use of template tags possible in .sql files
As such making those requests modulable and reusable

###Conditional template tag
`{{? value }} SELECT * FROM table {{?}}`
will translate to
`if( typeof value !== && value !== false ){ out += 'SELECT * FROM table' }`





#Usage

```
var lsqlt = require('light-sql-tpl');
var fs = require('fs');

var sql = fs.readFileSync('./your/sqlfile.sql').toString();

//get the templating function corresponding to your sql file
//If the .sql file has already been parse it'll load the appropriate function corresponding to 'filename'
var sqltFunc = lsqlt( 'filename' , sql );

var sqlObj = sqltFunc({ key : value });

//use your DB enigne to execute the generated request 
db.query(sqlObj.sql, sqlObj.values);
```

#Installation

##tests

`npm install --dev`
`npm test`