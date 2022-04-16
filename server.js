// we import the express module
const express = require('express');

// we must import mysql2 module to connect to MySQL database
const mysql = require('mysql2');


///////////////////////////////////////////


// we set the PORT we will use
// the process.env.PORT expression makes the PORT variable
// because Heroku uses a different PORT than our local one
// 3001 is the PORT we use locally
const PORT = process.env.PORT || 3001;


///////////////////////////////////////////////


// put express() function into a variable
// this way it is easier to chain stuff
const app = express();


////////////////////////////////////////////////


// we add the Express middleware
// app.use() intercepts data before it reaches endpoint
// this expression lets us accept data as key value pairs
// the expression in brackets says there may be sub-arrays within data
// but false means we wont be sending sub-arrays
app.use(express.urlencoded({ extended: false }));
// this expression parses JSON data and places it in req.body object
app.use(express.json());


////////////////////////////////////////////////////


// we use mysql2 to connect to MySQL database
// we set equal to a variable named db
const db = mysql.createConnection (

    // we have an object here with the following properties
    {
        host: 'localhost',
        // MySQL username
        user: 'root',
        // MySQL password
        password: 'Splinter_6',
        // select the database we're using
        database: 'election'

    },

    console.log('Connected to the election database.')
    
);


////////////////////////////////////////////////


// we will create a test GET request

// the '/' expression is a path to the endpoint
// req = request, res = response
// res.json is the same as res.send
// except its better for more data
// res.json is sending an object with a message whose value is
// "hello world"
/* app.get('/', (req, res) => {
    res.json({
        message: "Hello World"
    });
}); */


///////////////////////////////////////////////


// we create a query to our MySQL database!
// our db object created above is using query() method
// in the callback function we get the error (err) response
// if there are NO err, err becomes NULL
// and we also obtain the database query response (rows)
// this returns an array of objects, with each object being a row
db.query(`SELECT * FROM candidates`, (err, rows) => {
    console.log(rows);
});


//////////////////////////////////////////////


// we create another query to the database, this time to retrieve only
// one candidate
db.query(`SELECT * FROM candidates WHERE id=1`, (err, row) => {
    if (err) {
        console.log(err);
    }
    console.log(row);
});


////////////////////////////////////////////////


// we will create another query to delete a candidate from the db
// the question mark ? indicates a placeholder
// this is called a PREPARED STATEMENT, allows execution with
// different values each time
// the 1 after the statement is a parameter that hardcodes a value
// to use instead of ?
// we can make this parameter an array with many values!
db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
    if (err) {
        console.log(err);
    }
    console.log(result);
});


///////////////////////////////////////////////////////////


// this query will create a candidate
// we make a variable with our template literal for inserting data
// again we are using placeholders for our values
const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) VALUES (?, ?, ?, ?)`;

// we make a variable with our params array
// this is an array of different values that we can use as params!
const params = [1, 'Ronald', 'Firbank', 1];

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


// we need to add error handling for bad responses (404s)
// this response occurs when user uses incompatible endpoints
// this is called a 'catchall' route
app.use((req, res) => {
    res.status(404).end();
});


///////////////////////////////////////////////


// we will place our GET/POST requests before this function
// we must start the Express server on our PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
    
});

