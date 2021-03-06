const Album = require('../models/album.model');
const {body,validationResult} = require("express-validator");
const Artist = require("../models/artist.model")
const express = require('express');

const router = express.Router();

//Get Operation
router.get('/',async(req,res)=>{
    const page = +req.query.page||1;
    const size = +req.query.size||5;
    const offset = (page-1)*5;
    try{
        const album = await Album.find().skip(offset).limit(size).lean().exec();
        const totalAlbumCount = await Album.find().count();
        const total_pages=Math.ceil(totalAlbumCount/size);
    
        res.send({album,total_pages});
    }catch(err){
        console.log(err)
    }
   
})

router.get('/:id',async(req,res)=>{

    const album = await Album.findById(req.params.id).populate('songs').lean().exec();
    const artist = await Artist.findById(album.name).lean().exec();
    res.send({album,total_pages:1,artist})
})

router.get('/filterByName/:name',async(req,res)=>{
    const page = +req.query.page||1;
    const size = +req.query.size||5;
    const offset = (page-1)*5;
    const artist = await Artist.findById(req.params.name).lean().exec();
    if(artist){
        const album = await Album.find({name:artist._id}).populate('songs').skip(offset).limit(size).lean().exec();

        const totalAlbumCount = await Album.find({name:artist._id}).count();
    const total_pages=Math.ceil(totalAlbumCount/size);
        res.send({album,artist,total_pages})
    }else{
        res.send("No Data Found");
    }
    
})
router.get('/filterByGenre/:genre',async(req,res)=>{
    const page = +req.query.page||1;
    const size = +req.query.size||5;
    const offset = (page-1)*5;
    
        const album = await Album.find({genre:req.params.genre}).populate('songs').skip(offset).limit(size).lean().exec();
        const totalAlbumCount = await Album.find({genre:req.params.genre}).count();
        const total_pages=Math.ceil(totalAlbumCount/size);
            res.send({album,total_pages})
    
    
})



router.get('/sort_year',async(req,res)=>{
    const page = +req.query.page||1;
    const size = +req.query.size||5;
    const offset = (page-1)*5;

    const album = await Album.find().sort({year:-1}).populate('songs').skip(offset).limit(size);
    const totalAlbumCount = await Album.find().count();
    const total_pages=Math.ceil(totalAlbumCount/size);

    res.send({album,total_pages});
})

// Post Operation
router.post('/',
body('name').notEmpty().withMessage("Song name is required"),
body('genre').notEmpty().withMessage('Need To Specify Genre'),
body('year').notEmpty().withMessage("year is required"),
body('songs').notEmpty().isArray().withMessage('Need To Specify songs'),

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
   const albums = await Album.create(req.body);
res.send(albums);
})


// Patch Operation
router.patch('/:id',async(req,res)=>{
    const album = await Album.findByIdAndUpdate(req.params.id,req.body,{new:true}).lean().exec();
    res.send({album,total_pages:1})
})

// Delete Operation
router.delete('/:id',async(req,res)=>{
    const albums = await Album.findByIdAndDelete(req.params.id);
    res.send({albums,total_pages:1})
})

module.exports = router;