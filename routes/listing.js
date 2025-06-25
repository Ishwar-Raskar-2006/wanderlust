const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const {listingSchema,reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

let listingController = require("../controllers/listing.js");

const multer  = require('multer');
const {storage} = require("../cloudconfig.js");
const upload = multer( {storage} );

router.route("/")
.get( wrapAsync(listingController.index))
.post(isLoggedIn, upload.array('image'),validateListing, wrapAsync(listingController.createNewListing));

// upload.array('image') to upload multiple images
// upload.single(listing[image]) to upload single image

//Create Route
router.get("/new", isLoggedIn, listingController.createRoute);

router.get("/search", wrapAsync(listingController.search));

router.route("/:id")
.delete(isLoggedIn, isOwner,wrapAsync(listingController.destroyRoute))
.patch(isLoggedIn,  upload.array('image'), isOwner,validateListing, wrapAsync(listingController.updateListing))
.get(wrapAsync(listingController.showListing));

//Edit Route
router.get("/:id/edit",isLoggedIn, isOwner,wrapAsync(listingController.renderEditRoute));


// get show page image
router.get("/image/:id", isLoggedIn,wrapAsync(listingController.showpageimage));

router.get("/:id/image/:id", (req, res)=>{
    let{id} = req.params;
    console.log(id);
//    res.render("./listings/updateshowimg.ejs", {id});
});

router.post("/updated", (req, res)=>{
    res.send("updated zala ka");
})

module.exports = router;

