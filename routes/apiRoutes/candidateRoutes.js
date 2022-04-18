const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

///////////////////////////////////////////////


// we create a query to our MySQL database!
// our db object created above is using query() method
// in the callback function we get the error (err) response
// if there are NO err, err becomes NULL
// and we also obtain the database query response (rows)
// this returns an array of objects, with each object being a row
// now wrap all of this in a get request!
// we name our endpoint as /api/candidates
router.get('/candidates', (req, res) => {


    // the template literal is selecting from the candidates table
    // since we are selecting from both tables we use . notation
    // we still use the wildcard after the . notation to say we want
    // everything from the table. 
    // we are only selecting 'name' from parties table
    // we rename 'name' to party_name using AS (alias)
    // we join the parties table with the condition that
    // the party_id field in candidates has a match in the id field 
    // of the parties table
    const sql = `SELECT candidates.*, parties.name AS party_name FROM candidates LEFT JOIN parties ON candidates.party_id = parties.id`;
  
    db.query(sql, (err, rows) => {
      if (err) {
        // here we chain two methods to our response
        // we state the status if there's an error
        // and we use json to send an object with two properties
        // err.message should describe the issue
        res.status(500).json({ error: err.message });
        return;
      }
      // if no error we send an object with our data
      // our data is called 'rows'
      res.json({
        message: 'success',
        data: rows
      });
    });
  });


//////////////////////////////////////////////


// we create another query to the database, this time to retrieve only
// one candidate
// this endpoint has a parameter of id, which can be any id
router.get('/candidate/:id', (req, res) => {

    // the WHERE statement lets us select a specific value form the table
    // in this case we use a placeholder 
    const sql = `SELECT candidates.*, parties.name AS party_name FROM candidates LEFT JOIN parties ON candidates.party_id = parties.id WHERE candidates.id = ?`;

    // in our parameters array we specify that req.params object has
    // a single element of id
    const params = [req.params.id];

    // the id that is specified at the endpoint will be queried to
    // the database, we get a single row so we write 'row'
    db.query(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      
      res.json({
        message: 'success',
        data: row
      });
      
    });
  });


//////////////////////////////////////////////////


// we will create another query to delete a candidate from the db
// the question mark ? indicates a placeholder
// this is called a PREPARED STATEMENT, allows execution with
// different values each time
// the 1 after the statement is a parameter that hardcodes a value
// to use instead of ?
// we can make this parameter an array with many values!
// delete() is an HTTP request method
router.delete('/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];
  
    db.query(sql, params, (err, result) => {
      if (err) {
        res.statusMessage(400).json({ error: res.message });
      } 
        // if there are no rows affected (meaning no deletions)
        // then we will send object with message 'candidate not found'
        else if (!result.affectedRows) {
        res.json({
          message: 'Candidate not found'
        });
      } 
        // if there IS affectedRows, then we will display those
        else {
        res.json({
          message: 'deleted',
          changes: result.affectedRows,
          id: req.params.id
        });
      }
    });
  });


///////////////////////////////////////////////////////////




// the PUT request is better for updating
// Update a candidate's party
router.put('/candidate/:id', (req, res) => {

    // we will call our inputCheck() function to make sure
    // that a party id has been provided
    const errors = inputCheck(req.body, 'party_id');
  
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }
  
    const sql = `UPDATE candidates SET party_id = ? 
                 WHERE id = ?`;
    
    // req.body to update body, req.params for endpoint
    const params = [req.body.party_id, req.params.id];
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        // check if a record was found
      } else if (!result.affectedRows) {
        res.json({
          message: 'Candidate not found'
        });
      } else {
        res.json({
          message: 'success',
          data: req.body,
          changes: result.affectedRows
        });
      }
    });
  });


//////////////////////////////////////////////////////////////



// we want this request to be sent to /api/candidate endpoint
// this way it gets added to the candidate data
// normally in the callback response we would put req.body
// but here we are 'destructuring' the object to get the body property
router.post('/candidate', ({ body }, res) => {
    // this inputCheck function was provided to us
    // it is in inputCheck.js
    // we need to import this module at the top
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }
    // now if there are no errors we want to make a query to the db
    // this query will create a candidate
    // we make a variable with our template literal for inserting data
    // again we are using placeholders for our values
    // we create template literal for mysql commands
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected) VALUES (?,?,?)`;
    // we make a variable with our params array
    // this is an array of different values that we can use as params!
    const params = [body.first_name, body.last_name, body.industry_connected];

    // pass our variable arguments in, put err and result in callback
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            // we display body data if successful
            data: body
        });
    });
});


const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) VALUES (?, ?, ?, ?)`;


const params = [0, 'Ronald', 'Firbank', 1];

// now the actual query function
// we pass our template literal for data insertion in as argument
// followed by parameter array
// and finally our callback function
db.query(sql, params, (err, result) => {
    if (err) {
        console.log(err);
    }
    console.log(result);
});


//////////////////////////////////////////////////////////


module.exports = router;
