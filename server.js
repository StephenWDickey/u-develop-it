// we import the express module
const express = require('express');

// we import the connection to database
const db = require('./db/connection');

const apiRoutes = require('./routes/apiRoutes');

// this module is in our POST request
const inputCheck = require('./utils/inputCheck');

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

app.use('/api', apiRoutes);





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





//////////////////////////////////////////////




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

