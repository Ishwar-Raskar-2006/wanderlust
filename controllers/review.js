const Listing = require("../models/listing.js");
const review = require("../models/review.js");

module.exports.createReview = async(req, res)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id);
    let newReview = new review(req.body.review);
    newReview.author =req.user._id;
    listing.reviews.push(newReview);

    await listing.save();
    await newReview.save();
    req.flash('success', 'New Review Added');
    res.redirect(`/listings/${id}`);
};

module.exports.destroyReview = async(req, res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review Deleted!');
    res.redirect(`/listings/${id}`)
};