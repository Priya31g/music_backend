const express = require('express');
const router = express.Router();
const {body,validationResult} = require("express-validator");

const Songs = require('../models/song.model');

// Get Operation
router.get('/',async(req,res)=>{
    const page = +req.query.page||1;
    const size = +req.query.size||5;
    const offset = (page-1)*5;
    const songs = await Songs.find().skip(offset).limit(size).lean().exec();
    const totalUserCount = await Songs.find().count();
    const total_pages=Math.ceil(totalUserCount/size);
 
    res.send({songs,total_pages});
})

router.get('/:id',async (req,res)=>{
    const songs = await Songs.findById(req.params.id).lean().exec();
    res.send({songs,total_pages:1})
})


//Post Operation 
router.post('/',
body('name').notEmpty().withMessage("Song name is required"),
body('duration').notEmpty().withMessage('Need To Specify Duration'),
async(req,res)=>{
    const errors = validationResult(req);
        let final_error=null;
        if(!errors.isEmpty()){
            console.log(errors)
            final_error=errors.array().map(errors=>{
                return {
                    param:errors.param,
                    msg:errors.msg,
                    value:errors.value
                }
            })
            return res.status(400).json({error:final_error});
        }
       // console.log(final_error)
       const songs = await Songs.create(req.body);
    res.send(songs);
})

// Patch Operation
router.patch('/:id',async(req,res)=>{
    const songs = await Songs.findByIdAndUpdate(req.params.id,req.body,{new:true}).lean().exec();
    res.send({songs,total_pages:1})
})


// Delete Operation
router.delete('/:id',async(req,res)=>{
    const songs = await Songs.findByIdAndDelete(req.params.id);
    res.send({songs,total_pages:1})
})

module.exports = router;