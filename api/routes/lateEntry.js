const express = require('express');
const router = express.Router();
const Late = require('../models/lateEntry');

router.get('/', async (req, res, next) => {
    try{
        const result = await Late.find();
        if(result){
            res.status(200).json(result)
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

router.get('/:empId', async (req, res, next) => {
    const id = req.params.empId;
    try{
        const result = await Late.findById(id);
        if(result){
            res.status(200).json(result)
        } else{
            res.status(204).json({
                msg: "No content found"
            })
        }
    }
    catch(err){
        res.status(500).json({
            error: err
        })
    }
})

router.post('/', async (req, res, next) => {
    try{
        const lateMsg = new Late({
            userId: req.body.userId,
            header: req.body.header,
            description: req.body.description,
            time: req.body.time,
            date: req.body.date        
        })
        const result = await lateMsg.save();
        res.status(201).json(result)
    }
    catch(err){
        res.status(500).json({
            error: err
        })
    }
})

router.patch('/:empId', async (req, res, next) => {
    const id = req.params.empId;
    const msg = req.body;
    try{
        const result = await Late.findOneAndUpdate(
            {_id: id},
            {$set: msg},
            {new: true}
        )
        if(result){
            res.status(200).json(result)
        } else{
            res.status(204).json({
                msg: "No content found"
            })
        }
    }
    catch(err){
        res.status(500).json({
            error: err
        })
    }
})

router.delete('/:empId', async (req, res, next) => {
   const id = req.params.empId;
    try{
     const result = await Late.findOneAndDelete({_id: Object(id)});
     if(result){
        res.status(200).json(result)
     } else{
         res.status(204).json({
             msg: "No content found"
         })
     }
   }
   catch(err){
       res.status(500).json({
           error: err
       })
   }
})

module.exports = router;