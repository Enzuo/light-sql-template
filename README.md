![SqlModuleon](https://raw.githubusercontent.com/Enzuo/sql-moduleon/master/logo.png)

[![Build Status](https://travis-ci.com/Enzuo/sql-moduleon.svg?branch=master)](https://travis-ci.com/Enzuo/sql-moduleon)

## What is it ?

Sql-Moduleon is a very simple template engine for sql files.
It lets us add template tags in sql and let us focus on the queries.
It leverage the tools already in place to make secure queries and let us separate our concerns.


## Why
We want to leverage the performance and convinence of using raw sql in our application BUT using sql in our application code can feel messy especially when our query starts to get big.
We want to **avoid mixxing sql with js** which makes it harder to read, maintain and keep secure.

### Before

```js
  // somewhat better looking but insecure by default
  sql = `UPDATE user SET
                name = ${fullname}
              , age = ${age}
              , fullname = ${fullname}`

  // have to keep track of the ? to get the values in the right order, every change is a pain
  sql = `UPDATE user SET
                name = ?
              , age = ?
              , fullname = ?`
  values = [fullname, age, fullname]
```

### After
Sql file where we focus on the sql
```sql
UPDATE user SET
    name     = {{= fullname }}
  , age      = {{= age }}
  , fullname = {{= fullname }}
```

Js file where we focus on the js
```js
const {sql, values} = moduleon( sql )({fullname: 'luke', age: 19});
```


## What it is not

- no sql file loading
- no database query execution

---

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
