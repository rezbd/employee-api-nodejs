const express = require('express');
const router = express.Router();
const Leave = require('../models/leaveApplication');
const verifyLogin = require('../middlewares/jwtAuth');
const verifyAdmin = require('../middlewares/verifyAdmin');

// Get all leave applications
router.get('/all', async (req, res, next) => {
    try{
        const result = await Leave.find();
        if(result){
            res.status(200).json({
                action: 'Read',
                success: true,
                msg: 'Content read successfully',
                body: result
            })
        }
        else{
            res.status(204).json({
                success: true,
                msg: "No content found",
                body: {}
            })
        }
    }
    catch(err){
        res.status(500).json({
            action: 'read',
            success: false,
            msg: 'Read Failed',
            body: err
        })
    }

})

// Post a leave application
router.post('/', async (req, res, next) => {
    try{
        const leaveAppl = new Leave({
            employeeId: req.body.employeeId,
            fromDate: req.body.fromDate,
            toDate: req.body.toDate,
            reason: req.body.reason,
            applicationStatus: req.body.applicationStatus
        })
        const result = await leaveAppl.save();
        res.status(201).json({
            action: 'Create',
            success: true,
            msg: 'Created Successfully',
            body: result
        });
    }
    catch(err){
        res.status(500).json({
            action: 'Create',
            success: false,
            Msg: err.message,
            Error: err
        })
    }
})


// update a leave application
router.patch('/:applId', async (req, res, next) => {
    const id = req.params.applId;
    const applId = req.body;
    try{
        const result = await Leave.findOneAndUpdate(
            {_id: id},
            {$set: applId},
            {new: true}
        )
        if(result){
            res.status(200).json({
                action: "Update",
                success: true,
                msg: "updated leave application successfully",
                body: result
            })
        } else {
            res.status(204).json({
                action: "Update",
                success: false,
                msg: "No leave application found"
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


// delete a leave application
router.delete('/:applId', async (req, res, next) => {
    const id = req.params.applId;
    try{
        const result = await Leave.findOneAndDelete(
            {_id: id}
        )
        if(result){
            res.status(200).json({
                action: 'Delete',
                success: true,
                body: result
            })
        } else {
            res.status(204).json({
                action: 'Delete',
                success: false,
                msg: "No leave application found"
            })
        }
    }
    catch(err){}
})


// Leave will be approved or rejected by admin

// admin can approve an application
router.patch('/approve/:applId', verifyLogin.verifyJWT, verifyAdmin.isAdmin, async (req, res, next) => {
    try{
        const output = await Leave.findOneAndUpdate(
            {_id: req.params.applId},
            {$set: {applicationStatus: "approved"}},
            {new: true}
        );
        if(output){
            res.status(200).json({
                action: 'Update',
                success: true,
                msg: 'Leave Application approved successfully',
                body: output
            })
        } else {
            res.status(204).json({
                action: 'Update',
                success: false,
                msg: 'Leave application not found'
            })
        }
    }
    catch(err){
        res.status(500).json({
            action: 'Update',
            success: false,
            msg: err.message,
            Error: err
        })
    }
})


// admin can reject an application
router.patch('/reject/:applId', verifyLogin.verifyJWT, verifyAdmin.isAdmin, async (req, res, next) => {
    try{
        const output = await Leave.findOneAndUpdate(
            {_id: req.params.applId},
            {$set: {applicationStatus: "rejected"}},
            {new: true}
        );
        if(output){
            res.status(200).json({
                action: 'Update',
                success: true,
                msg: 'Leave Application rejected successfully',
                body: output
            })
        } else {
            res.status(204).json({
                action: 'Update',
                success: false,
                msg: 'Leave application not found'
            })
        }
    }
    catch(err){
        res.status(500).json({
            action: 'Update',
            success: false,
            msg: err.message,
            Error: err
        })
    }
})



module.exports = router;