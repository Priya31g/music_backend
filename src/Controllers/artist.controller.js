const express = require('express');
const router = express.Router();
const {body,validationResult} = require("express-validator");

const Artists = require('../models/artist.model');

// Get Operation
router.get('/',async(req,res)=>{
    const page = +req.query.page||1;
    const size = +req.query.size||5;
    const offset = (page-1)*5;
    const artist_ = await Artists.find().skip(offset).limit(size).lean().exec();
    const totalUserCount = await Artists.find().count();
    const total_pages=Math.ceil(totalUserCount/size);
 
    res.send({artist_,total_pages});
})

router.get('/:id',async (req,res)=>{
    const artist_ = await Artists.findById(req.params.id).lean().exec();
    res.send({artist_,total_pages:1})
})


//Post Operation 
router.post('/',
body('name').notEmpty().withMessage("Artist name is required"),
body('email').notEmpty().isEmail().withMessage('Need To Specify Email'),
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
       const artist_ = await Artists.create(req.body);
    res.send(artist_);
})

// Patch Operation
router.patch('/:id',async(req,res)=>{
    const artist_ = await Artists.findByIdAndUpdate(req.params.id,req.body,{new:true}).lean().exec();
    res.send({artist_,total_pages:1})
})


// Delete Operation
router.delete('/:id',async(req,res)=>{
    const artist_ = await Artists.findByIdAndDelete(req.params.id);
    res.send({artist_,total_pages:1})
})

module.exports = router;