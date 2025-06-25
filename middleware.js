const Listing = require("./models/listing.js");
const review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");


module.exports.isLoggedIn = (req, res,next)=>{
    // console.log(req.user);   //user information is stored into it
    // console.log(req.originalUrl);    //it will send the url where user want to see before login.
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be loggedin to create listing");
        return res.redirect("/login");
    }
        next();
};


//we use this middleware to store req.session.redirectUrl value into res.locals.redirectUrl because when the user
// login then passport reload the session and the value will get remove from this so we write in local.
module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req, res, next)=>{
let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "you are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req, res, next)=>{
    let {id, reviewId} = req.params;
    let Review = await review.findById(reviewId);
    if(!Review.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "you are not the owner of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next)=>{
let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

module.exports.validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};
