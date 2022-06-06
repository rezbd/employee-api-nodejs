const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtAuth = require('../middlewares/jwtAuth');
const signupValidator = require('../middlewares/signupValidator');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

// user schema
const Employee = require('../models/employee');
// employee activity schema
const Activity = require('../models/dailyActivity');


// get all users
router.get('/', async (req, res, next) => {
    try{
        const user = await Employee.find()
        res.status(200).json(user)
    }
    catch(err){
        res.status(500).json({
            error: err
        })
    }
});


// experimental protected route
router.get('/hi', jwtAuth.verifyJWT, (req, res, next) => {
    res.json({
        message: "Token works!"
    })
})

// find an employee by id
router.get('/:empId', async (req, res, next) => {
    const id = req.params.empId;
    try{
        const result = await Employee.findById(id);
        res.status(202).json(result);
    }
    catch(err){
        res.status(502).json({
            Error: err
        })
    }
})

/* 
* since there is a /sginup route. the following route is no loger necessary
// create a new employee
router.post('/', async (req, res, next) => {
    try{
        const employee = new Employee({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            image: req.body.image
        })
        const result = await employee.save();
        if(result){
            res.status(201).json({
                action: 'Create',
                msg: 'Created Employee successfully',
                body: result
            });
        }
    }
    catch(err){
        res.status(500).json({
            action: 'Create',
            msg: err.message,
            body: err
        })
    }
}); */


// user login api
router.post('/login', (req, res, next) => {
    try{
        // find user with requested email
        Employee.findOne({email: req.body.email}, function(err, user) {
            if(user === null){
                return res.status(400).json({
                    message : "User not found."
                });
            }
            else {
                if(user.validPassword(req.body.password)) {
                    const token = jwt.sign({ email: req.body.email, id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' })
                    return res.status(201).json({
                        message: "User logged in",
                        token: token
                    })
                }
                else{
                    return res.status(400).json({
                        message: "Wrong password"
                    })
                }
            }
        })
        }
    catch(err){
        res.status(500).json({
            action: 'Login',
            msg: err.message,
            body: err
        })
    }
})


// user signup api
router.post('/signup',  signupValidator.userValidator, async (req, res, next) => {
    try{        
        // creating empty user object
        let newUser = await new Employee();

        // initialize newUser object with request data
        newUser._id = new mongoose.Types.ObjectId();
        newUser.userID = newUser._id;
        newUser.name = req.body.name
        newUser.email = req.body.email
        newUser.designation = req.body.designation
        newUser.mobile = req.body.mobile
        newUser.location = req.body.location

        // call setPassword function to hash password
        newUser.setPassword(req.body.password)

        // save newUser object to database
        newUser.save((err, Employee) => {
            if(err){
                if (err.message.split(" ")[0] == "E11000") {
                    let a = err.message.split(" { ")[1].split(" ")[0];
                    let b = a.replace(/:/gi, function () {
                        return "".trim();
                    });
    
                    return res.json({
                        statusCode: 409,
                        success: false,
                        field_name: b,
                        msg: "Already exists."
                    });
                }
            }
            else {
                return res.status(201).json({
                    action: "signup",
                    message: "Employee added successfully"
                })
            }
        })
    }
    catch(err){
        res.status(500).json({
            action: 'signup',
            success: false,
            msg: err.message,
            Error: err
        })
    }
})


// update an employee
router.patch('/:empId', jwtAuth.verifyJWT, async (req, res, next) => {
    const id = req.params.empId;
    const user = req.body;
    try{
        const result = await Employee.findOneAndUpdate(
            {_id: id},
            {$set: user},
            {new: true} //we should set the new option to true to return the document
        );
        if(result){
            res.status(200).json(result);
        } else{
            res.status(204).json({
                msg: "No content found"
            })
        }
    }
    catch(err){
        res.status(500).json({
            Error: err
        })
    }
})


// delete an user
router.delete('/:empId', jwtAuth.verifyJWT, (req, res, next) => {
    const id = req.params.empId;
    try{
        const result = Employee.findOneAndDelete({_id: Object(id)});
        if(result){
            res.status(200).json({
                action: 'Delete',
                msg: 'Content deleted successfully',
                success: true
            })
        } else{
            res.status(204).json({
                action: 'Delete',
                success: false,
                msg: 'No content found'
            })
        }
    }
    catch(err){
        res.status(500).json({
            action: 'Delete',
            success: false,
            msg: 'Contend delete failed'
        })
    }
})


// make an employee admin
router.patch('/admin/:empId', async (req, res, next) => {
    const id = req.params.empId;
    try{
        const result = await Employee.findOneAndUpdate(
            {_id: id},
            {$set: {role: 'admin'}},
            {new: true}
        );
        if(result){
            res.status(200).json({
                action: "Update",
                success: true,
                message: "made an employee admin successfully",
                body: result
            })
        } else {
            res.status(204).json({
                action: "Update",
                success: false,
                message: "No user found"
            })
        }
    }
    catch(err){
        res.status(500).json({
            action: "Update",
            success: false,
            msg: err.message,
            Error: err
        })
    }
})


/* 
    routes for daily employee activity
*/

// post an employee activity
router.post('/activity', async (req, res, next) => {
    try{
        const check_in_time = new Date(req.body.check_in_time);
        const check_out_time = new Date(req.body.check_out_time);
        const lunch_break_start = new Date(req.body.lunch_break_start);
        const lunch_break_end = new Date(req.body.lunch_break_end);
        const tea_break_start = new Date(req.body.tea_break_start);
        const tea_break_end = new Date(req.body.tea_break_end);

        const lunch_break = lunch_break_end.getTime() - lunch_break_start.getTime();
        const tea_break = tea_break_end.getTime() - tea_break_start.getTime();

        const total_work_time = check_out_time.getTime() - check_in_time.getTime();
        const total_work_time_without_breaks = total_work_time - lunch_break - tea_break;
        const total_work_time_without_breaks_in_hours = total_work_time_without_breaks / 1000 / 60 / 60;
        const total_break_time = lunch_break + tea_break;
        const total_break_time_in_hours = total_break_time / 1000 / 60 / 60;

        const activity = new Activity({
            _id: new mongoose.Types.ObjectId(),
            employee_id: req.body.employee_id,
            employee_name: req.body.employee_name,
            employee_email: req.body.employee_email,
            date: req.body.date,
            total_actual_work_time: total_work_time_without_breaks_in_hours,
            total_break_time: total_break_time_in_hours
        })
        const result = await activity.save();
        if(result){
            res.status(201).json({
                action: 'Create',
                msg: 'Created Activity successfully',
                body: result
            });
        }
    }
    catch(err){
        res.status(500).json({
            action: 'Create',
            msg: err.message,
            body: err
        })
    }
})


module.exports = router;