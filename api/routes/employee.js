const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// imported user schema
const Employee = require('../models/employee');

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
                msg: 'Created user successfully',
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
});

// update an employee
router.patch('/:empId', async (req, res, next) => {
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

router.delete('/:empId', (req, res, next) => {
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

module.exports = router;