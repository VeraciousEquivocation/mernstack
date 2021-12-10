const axios = require('axios');
const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// LIST OF FUNCTIONS TO CALL for reusability //

// this method grabs all records
const findAll = function (callback) {
  let db_connection = dbo.getDb("employees");
  if(typeof(db_connection) === 'undefined') throw(new Error('DB IS UNDEFINED'))
  try {
  db_connection
    .collection("records")
    .find({})
    .toArray(callback);
  } catch(err) {
    callback(err,'')
  }
    
}

// A method to grab next/prev results based on a page size
const grabPage = function (page_size,last_id,direction, callback) {
  let db_connection = dbo.getDb("employees");
  if(typeof(db_connection) === 'undefined') throw(new Error('DB IS UNDEFINED'))
  
  if(last_id === undefined) {
    try {
      db_connection
        .collection("records")
        .find({})
        .limit(page_size)
        .toArray(callback);
    } catch(err) {
      callback(err,'')
    }
  } else {
    let ltORgt = '$gt';
    let sortOrder = {'_id': 1};
    if(direction==='prev') { 
      ltORgt = '$lt'
      sortOrder = {'_id': -1}
    }

    let query = {
      '_id': {
        [ltORgt]: last_id
      }
    }

    try {
      db_connection
        .collection("records")
        .find(query)
        .sort(sortOrder)
        .limit(page_size)
        .toArray(callback);
    } catch(err) {
      callback(err,'')
    }
  }

}

const findByNameNum = function (myQuery,callback) {
  let db_connection = dbo.getDb("employees");
  if(typeof(db_connection) === 'undefined') throw(new Error('DB IS UNDEFINED'))

  try {
  db_connection
    .collection("records")
    .findOne(myQuery, callback);
  } catch(err) {
    callback(err,'')
  }
};

const findByID = function (myQuery,callback) {
  let db_connection = dbo.getDb("employees");
  if(typeof(db_connection) === 'undefined') throw(new Error('DB IS UNDEFINED'))
  try {
    db_connection
    .collection("records")
    .findOne(myQuery, callback);
  } catch(err) {
    callback(err,'')
  }
};

const addNew = function (myobj,callback) {
  let db_connection = dbo.getDb();
  if(typeof(db_connection) === 'undefined') throw(new Error('DB IS UNDEFINED'))

  let  nameNum = {
    person_name: myobj.person_name,
    person_phone: myobj.person_phone,
  };
  
  let existingRecord = null;

  findByNameNum(nameNum, function (err, res) {
    if (err) throw err;
    existingRecord = res;
    
    if(existingRecord !== null) {
      callback(null,`A record for ${nameNum.person_name} with number ${nameNum.person_phone} already exists`)
      return;
    }

    try {
    db_connection
      .collection("records")
      .insertOne(myobj,callback);
    } catch(err) {
      callback(err,'')
    }
  })

};
const updateByID = function (myquery, newvalues,callback) {
  let db_connection = dbo.getDb();
  if(typeof(db_connection) === 'undefined') throw(new Error('DB IS UNDEFINED'))

  try {
    db_connection
      .collection("records")
      .updateOne(myquery,newvalues,callback);
  } catch(err) {
    callback(err,'')
  }
};
const updateMultipleByID = (myquery, newvalues,callback) => {
  let db_connection = dbo.getDb();
  if(typeof(db_connection) === 'undefined') throw(new Error('DB IS UNDEFINED'))

  try {
    db_connection
      .collection("records")
      .updateMany(myquery,newvalues,callback);
  } catch(err) {
    callback(err,'')
  }
}
const softDelete = function (req,callback) {
  let db_connection = dbo.getDb();
  if(typeof(db_connection) === 'undefined') throw(new Error('DB IS UNDEFINED'))
  let myquery = { _id: ObjectId( req.params.id )};
  let newvalues = {
    $set: {
      deleted: true
    },
  };

  try {
    db_connection
      .collection("records")
      .updateOne(myquery,newvalues,callback);
  } catch(err) {
    callback(err,'')
  }
};

// This section will help you get a list of all the records.
recordRoutes.route("/record").get( function (req, res, next) {
  let page_size = parseInt(req.query.page_size);

  // need to ObjectId it for it to work
  let last_id = req.query.last_id ? ObjectId(req.query.last_id) : undefined;
  let direction = req.query.direction;

  if(typeof(page_size) !== 'number') next(new Error('PAGE SIZE IS NOT A NUMBER'))

  grabPage(page_size,last_id, direction,(err,result)=>{
    if(err) next(err)
    else {
      if(direction === 'prev') {
        result = result.reverse()
      }
      res.json(result)
    }
  })
  
  // findAll((err,result)=>{
  //   if(err) next(err)
  //   else res.json(result)
  // })
});

// This section will help you get a single record by id
recordRoutes.route("/record/:id").get(function (req, res, next){
  let db_connect = dbo.getDb();
  let myQuery = { _id: ObjectId( req.params.id )};
  
  findByID(myQuery,(err,result)=>{
    if(err) next(err)
    else res.json(result)
  })
});

// This section will help you create a new record.
recordRoutes.route("/record/add").post(function (req, response, next) {
    let db_connect = dbo.getDb();
    let myobj = {
      person_name: req.body.person_name,
      person_position: req.body.person_position,
      person_level: req.body.person_level,
      person_phone: req.body.person_phone,
    };
    addNew(myobj, function (err, res) {
      if (err) next(err);
      response.json(res);
    })
  });
  
// This section will help you update a record by id.
recordRoutes.route("/update/:id").post(function (req, response, next) {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId( req.params.id )};
    let newvalues = {
      $set: {
        person_name: req.body.person_name,
        person_position: req.body.person_position,
        person_level: req.body.person_level,
        person_phone: req.body.person_phone,
      },
    };
    updateByID(myquery, newvalues, function (err, res) {
      if (err) next(err);
      console.log("1 document updated");
      response.json(res);
    })
  });

recordRoutes.route("/updatemultiple").post(function (req, response, next) {
  let db_connect = dbo.getDb();
  let idList = req.body.ids.map(i => ObjectId(i))

  let myquery = { _id: {
      $in: idList,
  }};
  let newvalues = {
    $set: {
      deleted: req.body.delete
    },
  };

  updateMultipleByID(myquery, newvalues, function (err, res) {
    if (err)  next(err);
    console.log("documents updated");
    response.json(res);
  })
});
  
// This section will help you delete a record
recordRoutes.route("/OLD/:id").delete((req, response, next) => {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId( req.params.id )};
    db_connect.collection("records").deleteOne(myquery, function (err, obj) {
      if (err) next(err);
      console.log("1 document deleted");
      response.status(obj);
    });
  });

// This section will soft-delete a record
recordRoutes.route("/:id").delete((req, res,next) => {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId( req.params.id )};
    softDelete(req,(err,result)=>{
      if(err) next(err)
      else res.json(result)
    })
  });
  
  module.exports = recordRoutes;