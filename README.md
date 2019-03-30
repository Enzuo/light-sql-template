![SqlModuleon](https://raw.githubusercontent.com/Enzuo/sql-moduleon/master/logo.png)

## What is it ?

Sql-Moduleon is a very simple template engine for sql files.

It lets you add template tags and easily write meaningful sql files, while still keeping security in mind.

## Problem it resolves

#### Before
```sql
UPDATE user SET
    surname = ?
  , age = ?
  , fullname = ?
```
You have a complex parameterized query using several unnamed parameter.

Now in your javascript code you have to generate an array paying attention to the order.
```js
['luke', 19, 'luke']
```

#### After
Sql moduleon lets you instead have named parameters right in your sql. You know what you manipulate.

```sql
UPDATE user SET
    surname  = {{= fullname }}
  , age      = {{= age }}
  , fullname = {{= fullname }}
```
```js
{fullname: 'luke', age: 19}
```
- It lets you write plain .sql files without having to mixx it in your javascript while staying simple to build.

- The javascript part doesn't have to know the query structure. It just gives it the data and the query handles it.

## What it won't do for you

- no sql file loading
- no database query execution

# General concept

- Write your .sql files with templates tags
- Load your templatized .sql files
- **Transform your templatized sql into a function that generate a plain parametrized query** *<-- sql-Moduleon's job*
- Use the generated function with your data
- Feed the query to your database

# Available templates tags

- **Condition**

  `{{? value }} SELECT * FROM table {{?}}`

  will add the sql inbetween the tags only if the condition is fullfilled

- **Value**

  `SELECT * FROM table WHERE id = {{= value }}`

  behind the scene it will replace this tag by a sql unnamed parameter (?) and generated the values array

- **Javascript Code**

  `SELECT * FROM {{ out += '"Table"'; }}`

  simply throw in javascript code in the template function to add advanced logic


# Usage example

```javascript
var moduleon = require('sql-moduleon');
moduleon.setDefaultConfig({engine:'pg', array:'string'});

var fs = require('fs');
var sql = fs.readFileSync('./your/sqlfile.sql').toString();

// sql-moduleon
var sqlTemplateFunction = moduleon( sql );
var sqlRequest = sqlTemplateFunction({ key : value });

//use your DB engine to execute the generated request
db.query(sqlRequest.sql, sqlRequest.values);
```

# Installation

`npm install sql-moduleon --save`

or using yarn

`yarn add sql-moduleon`

## tests

```
npm install --dev
npm test
```

This module was tested with postgres and sqlite,
it may not work with other DBMS
