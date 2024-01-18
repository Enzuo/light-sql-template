![SqlModuleon](https://raw.githubusercontent.com/Enzuo/sql-moduleon/master/logo.png)

[![Build Status](https://travis-ci.com/Enzuo/sql-moduleon.svg?branch=master)](https://travis-ci.com/Enzuo/sql-moduleon)

## What is it ?

Sql-Moduleon is a very simple template engine to use .sql files in js.
- Add template tags in sql and let us focus on the queries.
- Ensure sql and js logic stay seperated.
- Leverage the power of parameterized query to stay safe.
- Compile into function to be as fast as possible.

[See what it looks like](#with-sql-moduleon)


## Why use sql-moduleon
- We want to leverage the performance and convinence of using raw sql in our application BUT using sql in our application code can feel messy especially when our queries start to get big.
- We want to **avoid mixxing sql with js** which makes it harder to read, harder to maintain and keep secure.

### Without sql-moduleon

```js
  // about as good looking as we can get but insecure by default
  sql = `UPDATE user SET
                name = ${fullname}
              , age = ${age}
              , fullname = ${fullname}`

  // have to keep track of the arguments order, every change in a big query is a pain
  sql = `UPDATE user SET
                name = ?
              , age = ?
              , fullname = ?`
  values = [fullname, age, fullname]

  // using prisma sql is pretty good and safe
  // but you still have to write your sql in your js files
  // not ideal for big queries
  Prisma.sql`UPDATE user SET
                name = ${fullname}
              , age = ${age}
              , fullname = ${fullname}`
```

### With sql-moduleon
Sql file where we focus on the sql
```sql
UPDATE user SET
    name     = {{= fullname }}
  , age      = {{= age }}
  , fullname = {{= fullname }}
```

Js file where we focus on the js
```js
const data = {fullname: 'luke', age: 19}
const {sql, values} = moduleon( sql )( data );
```


## What it is not

- no sql file loading
- no database query execution

---

# General concept

- Write your .sql files with templates tags
- Load your .sql files
- **Transform your sql into a function that generate parametrized queries** *<-- sql-Moduleon's job*
- Call the sql function with your data
- Send the parameterized query to your database

# Installation

`npm install sql-moduleon --save`

or using yarn

`yarn add sql-moduleon`

## Usage example

```javascript
var moduleon = require('sql-moduleon');
moduleon.setDefaultConfig({ engine:'pg', array:'string' });

var fs = require('fs');
var sql = fs.readFileSync('./your/sqlfile.sql', 'utf-8');

// -> sql-moduleon <-
const data = { title : 'value' }
const sqlTemplateFunction = moduleon( sql );
const { sql, values } = sqlTemplateFunction( data );

//use your DB engine to execute the parameterized query
db.query( sql, values );
```



# Documentation

## Available templates tags

- **Condition**

  `{{? value }} SELECT * FROM table {{?}}`

  will add the sql inbetween the tags only if the condition is fullfilled

- **Value**

  `SELECT * FROM table WHERE id = {{= value }}`

  behind the scene it will replace this tag by a sql unnamed parameter (?) and generated the values array

- **Javascript Code**

  `SELECT * FROM {{ out += '"Table"'; }}`

  simply throw in javascript code in the template function to add advanced logic


# Contrib

## Tests

```
npm install --dev
npm test
```

This module was tested with postgres and sqlite,
it may not work with other DBMS
