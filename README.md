#What is it ?

sql-Moduleon is a very simple template engine for .sql running in node.js
- no sql file loading, no database query execution
- just the parsing of your sql template

###Logic

- Write your .sql with templates tags
- Load your .sql files
- **Transform your sql into a template function and generate requests** *<-- sql-Moduleon's job*
- Pass those requests to your query engine

#Available templates tags

- **Condition**

		{{? value }} SELECT * FROM table {{?}}

	will add the sql inbetween the tags only if the condition is fullfilled

- **Value**

		SELECT * FROM table WHERE id = {{= value }}

	will replace this tag by a sql parameter (?) and add value to the values array

- **Javascript Code**

 		SELECT * FROM {{ out += '"Table"'; }}

 	simply throw in javascript code in the template function


#Usage

```javascript
var moduleon = require('sql-moduleon');
moduleon.setConfig({engine:'pg'});

var fs = require('fs');
var sql = fs.readFileSync('./your/sqlfile.sql').toString();

var sqlTemplateFunction = moduleon( 'filename' , sql );
var sqlRequest = sqlTemplateFunction({ key : value });

//use your DB enigne to execute the generated request
db.query(sqlRequest.sql, sqlRequest.values);
```

sql-Moduleon remembers the template from one use to the other and you can parse your sql only once
```javascript
var sqlt = moduleon( 'filename' )
if( sqlt === false){
	sqlt = moduleon( 'filename' , sql );
}
```

#Installation

`npm install sql-moduleon --save`

##tests

```
npm install --dev
npm test
```

This module was tested in a postgres environement and may not work with other DBMS
