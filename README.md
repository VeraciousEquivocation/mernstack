# MERN stack project

A project to learn the MERN stack.

### Server
server.js is the backend file.
You can run it with 
```
nodemon server.js
```

connection the mongodb is in db -> conn.js
This app is utlizing a free online mongodb, via MongoDB Atlas Database. You can modify this to use another.



| **Note:** For mongo methods refer to their [Documentation](https://docs.mongodb.com/manual/reference/method/) |
| --- |


expressjs routes are found in routes -> record.js

A custom express app level middleware was added to catch errors with fetching from mongodb
```
app.use(function (err, req, res, next) {
    // logic
    if(err)
      res.status(500).send({ error: 'Something failed!' })
    else
      next()
})
```

### Client

As of currently, it's a simple crud app for handling the data in the mongodb

A list of employees is displayed with the following structure
```
{
  person_name: string
  person_position: string
  person_level: string
  person_phone: string
  deleted: boolean
}
```

You can create new entries, soft-delete entries and edit entries. You can also select multiple entries and undelete/soft-delete them all at once.

When adding a new entry, code is in place to prevent duplicate entries. The person's name, and phone, is utlizied as a potential unique combination to find entries.
If an entry is found, the user is alerted that a record already exists.

Features that may be added:
  - [ ] An "admin" switch to fetch all records including deleted, while only initially fetching records where deleted is false.
  - [ ] Pagination - to work with mongodbs limit, count, and $gt features
  - [ ] Search
  - [ ] Filters
  
