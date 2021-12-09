const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config({ path:"./config.env"});
const port = process.env.port || 5000;
app.use(cors());
app.use(express.json());

app.use(function (err, req, res, next) {
    // logic
    if(err)
      res.status(500).send({ error: 'Something failed!' })
    else
      next()
})

app.use(require("./routes/record"));


//get driver connection
const dbo = require("./db/conn")

app.listen(port, ()=>{
    //perform a DB connection when server starts
    dbo.connectToServer(function(err) {
        if(err) console.log(err);
    });
    console.log(`Server is running on port: ${port}`);
});