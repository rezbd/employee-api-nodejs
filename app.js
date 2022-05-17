const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const employeeRoute = require('./api/routes/employee');
const lateEntryRoute = require('./api/routes/lateEntry');

app.use(morgan('dev'));

// extended false to keep it simple
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

//routes to handle requests
app.use('/employee', employeeRoute)
app.use('/late', lateEntryRoute);

app.get('/hello', (req, res, next) => {
    res.json({message: "works!"});
})

// connect to database
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mflix.s7byk.mongodb.net/employee_db?retryWrites=true&w=majority`);



// To handle CORS errors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS'){
        res.header("Access-Control-Allow-Methods", 'PUT, POST, PATCH, DELETE')
        return res.status(200).json({});
    }
});



// middleware - to handle error requests

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

app.get('/hi',(req, res, next) => {
    res.json({
        message: "OK"
    })
})

module.exports = app;