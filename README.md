#What is it ?

sql-Moduleon is a very simple template engine for .sql

no sql file loading, no database query execution

just the parsing of your sql template


- Write your .sql with templates tags
- **Transform your sql into a template function** *<-- sql-Moduleon's job*
- Use this function to create sql requests
- Pass those requests to your query engine

#Available templates tags
	
- **Condition** 

		{{? value }} SELECT * FROM table {{?}}

	will add the sql inbetween the tags only if he condition is fullfilled

- **Value**

		SELECT * FROM table WHERE id = {{= value }} 

	will replace this tag by a ? and fill the array values

- **Javascript Code** (not yet implemented)

 		SELECT * FROM {{ out += '"Table"'; }} 

 	simply throw in javascript code in the template function


#Usage

```
var moduleon = require('sql-moduleon');
var fs = require('fs');

var sql = fs.readFileSync('./your/sqlfile.sql').toString();

//get the templating function corresponding to your sql file
//If 'filename' has already been registered it'll return the already parsed function
//If no sql is provided and 'filename' hasn't been registered it will return false
var sqlTemplateFunction = moduleon( 'filename' , sql );

var sqlRequest = sqlTemplateFunction({ key : value });

//use your DB enigne to execute the generated request 
db.query(sqlRequest.sql, sqlRequest.values);
```

#Installation

##tests

```
npm install --dev
npm test
```
