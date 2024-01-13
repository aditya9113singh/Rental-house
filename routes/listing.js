const express=require("express");
const router=express.Router();
const expressError=require("../utility/expressError.js");
const wrapAsync=require("../utility/wrapasync.js");

const Listing=require("../models/listing.js");


var bodyParser = require('body-parser');

//Create Route 
router.use(bodyParser.json()) // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true }))
router.post("/",wrapAsync(async(req, res, next) => { 
    
    const newListing =new Listing(req.body.list);
    await newListing.save();
    res.redirect(`/listings`);
    
})
); 


router.get("/",wrapAsync(async (req,res)=>{
    const allLists=await Listing.find({});
    res.render("listings/index.ejs",{allLists});
})
);


//create new 
router.get("/new",(req,res)=>{
    res.render("listings/new2.ejs");
})


//edit route
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let{id}=req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}))

//show route
router.get("/:id",wrapAsync(async (req,res)=>{
    let{id}=req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}));


//update route
router.put("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});//...is used to convert a JS object intoseperate data variables
    

    res.redirect("/listings");
}))





//delete route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let{id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}))

module.exports=router;