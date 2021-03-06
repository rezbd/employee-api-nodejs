const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtAuth = require('../middlewares/jwtAuth');
const signupValidator = require('../middlewares/signupValidator');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const moment = require('moment');
dotenv.config();

// user schema
const Employee = require('../models/employee');
// employee activity schema
const Activity = require('../models/dailyActivity');
// employee working time schema
const WorkingTime = require('../models/workingTime');


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
        
        let total_work_time_without_breaks_in_hours = total_work_time_without_breaks / 1000 / 60 / 60;
        total_work_time_without_breaks_in_hours = total_work_time_without_breaks_in_hours.toFixed(2);

        const total_break_time = lunch_break + tea_break;
        
        let total_break_time_in_hours = total_break_time / 1000 / 60 / 60;
        total_break_time_in_hours = total_break_time_in_hours.toFixed(2);

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


// post an employee activity using momentjs
router.post('/activity/moment', async (req, res, next) => {
    try{
        const check_in_time = moment(req.body.check_in_time);
        const check_out_time = moment(req.body.check_out_time);
        const lunch_break_start = moment(req.body.lunch_break_start);
        const lunch_break_end = moment(req.body.lunch_break_end);
        const tea_break_start = moment(req.body.tea_break_start);
        const tea_break_end = moment(req.body.tea_break_end);

        const lunch_break = lunch_break_end.diff(lunch_break_start);
        const tea_break = tea_break_end.diff(tea_break_start);

        const total_work_time = check_out_time.diff(check_in_time);
        const total_work_time_without_breaks = total_work_time - lunch_break - tea_break;
        
        let total_work_time_without_breaks_in_hours = total_work_time_without_breaks / 1000 / 60 / 60;
        total_work_time_without_breaks_in_hours = total_work_time_without_breaks_in_hours.toFixed(2);

        const total_break_time = lunch_break + tea_break;
        
        let total_break_time_in_hours = total_break_time / 1000 / 60 / 60;
        total_break_time_in_hours = total_break_time_in_hours.toFixed(2);

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


// get all employee activities
router.get('/activity', async (req, res, next) => {
    try{
        const result = await Activity.find();
        if(result){
            res.status(200).json({
                action: 'Get',
                msg: 'Got all activities successfully',
                body: result
            });
        }
    }
    catch(err){
        res.status(500).json({
            action: 'Get',
            msg: err.message,
            body: err
        })
    }
})


// route for calculating total working time of an employee
router.post('/working', async(req, res, next) => {
try{
    let emp_activity = [];
    /* let total_work_time = 0;
    for (let i = 0; i < emp_activity.length; i++) {
        let startTime = emp_activity[i].start;
        let endTime = emp_activity[i].end;
        let startHour = startTime.substring(0, 2);
        let startMinute = startTime.substring(3, 5);
        let endHour = endTime.substring(0, 2);
        let endMinute = endTime.substring(3, 5);
        let startTimeInMinutes = parseInt(startHour) * 60 + parseInt(startMinute);
        let endTimeInMinutes = parseInt(endHour) * 60 + parseInt(endMinute);
        let totalTimeInMinutes = endTimeInMinutes - startTimeInMinutes;
        total_work_time += totalTimeInMinutes;
    }
    let totalHours = Math.floor(total_work_time / 60);
    let totalMinutes = total_work_time % 60;
    let totalWorkingTime = totalHours + ':' + totalMinutes; */
    
    const working = new WorkingTime({
        _id: new mongoose.Types.ObjectId(),
        employee_id: req.body.employee_id,
        employee_email: req.body.employee_email,
        date: moment(req.body.date).format("YYYY-MM-DD"),
        // total_working_time: totalWorkingTime,
        emp_activity: emp_activity
    });

    const result = await working.save();
    if(result){
        res.status(201).json({
            action: 'Create',
            msg: 'Created working time successfully',
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


// router to update working activities
router.patch('/working/:id', async (req, res, next) => {
    try{
        const id = req.params.id;
        const activity = req.body;
        let result
        if(activity.end === ""){
            result = await WorkingTime.updateOne(
            {_id: id},
            {$push: {emp_activity: activity}}
        );}
        else{
            result = await WorkingTime.updateOne(
            {_id: id, "emp_activity.end": ""},
            {$set: {"emp_activity.$.end": activity.end}}
        );
        }
        res.status(200).json({
            action: 'Update',
            msg: 'Updated working time successfully'
        });        
    }
    catch(err){
        res.status(500).json({
            action: 'Update',
            msg: err.message,
            body: err
        })
    }
})


// get all working activities of an employee by id
router.get('/working/:id', async (req, res, next) => {
    const id = req.params.id;
    try{
        const employeeActivity = await WorkingTime.find({_id: id});
        const emp_activity = employeeActivity[0].emp_activity;
        let total_work_time = 0;
        for (let i = 0; i < emp_activity.length; i++) {
        let startTime = emp_activity[i].start;
        let endTime = emp_activity[i].end;
        let startHour = startTime.substring(0, 2);
        let startMinute = startTime.substring(3, 5);
        let endHour = endTime.substring(0, 2);
        let endMinute = endTime.substring(3, 5);
        let startTimeInMinutes = parseInt(startHour) * 60 + parseInt(startMinute);
        let endTimeInMinutes = parseInt(endHour) * 60 + parseInt(endMinute);
        let totalTimeInMinutes = endTimeInMinutes - startTimeInMinutes;
        total_work_time += totalTimeInMinutes;
    }
    let totalHours = Math.floor(total_work_time / 60);
    let totalMinutes = total_work_time % 60;
    let totalWorkingTime = `${totalHours} hours and ${totalMinutes} minutes`;

    res.status(200).json({
        action: 'Get',
        msg: 'Got all working time successfully',
        body: {
            employeeActivity: employeeActivity,
            totalWorkingTime: totalWorkingTime
        }
    });
/*         if(result){
            res.status(200).json({
                action: 'Get',
                msg: 'Got all working time successfully',
                body: result
            });
        } */
    }
    catch(err){
        res.status(500).json({
            action: 'Get',
            msg: err.message,
            body: err
        })
    }
})


module.exports = router;