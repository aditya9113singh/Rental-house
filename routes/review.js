const express=require("express");
const router=express.Router({mergeParams:true});
const expressError=require("../utility/expressError.js");
const wrapAsync=require("../utility/wrapasync.js");

const Listing=require("../models/listing.js");
const Review=require("../models/reviews.js");



//reviews
router.post("/",wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review saved");
    res.redirect(`/listings/${listing._id}`);
}))

//delete review
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});//pull operator will remove all object ids of reviews from review array which match reviewId 
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}))


module.exports=router;
