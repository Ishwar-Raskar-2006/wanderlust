const Listing = require("../models/listing.js");

module.exports.index = async (req, res)=>{
    const alllistings = await Listing.find({});
    res.render("./listings/index.ejs", {alllistings});
};

module.exports.search = async (req, res)=>{
    let {q} = req.query;
   
     if (!q) {
        return res.redirect("/listings"); // If no query, go back to all listings
    }

    let listings = await Listing.find({ title: { $regex: new RegExp(`^${q}$`, "i") } });
    
    
    if (listings.length===0) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

   res.render("./listings/search.ejs", {listings});
};

module.exports.createRoute = (req, res)=>{
    res.render("./listings/new.ejs")
};

module.exports.destroyRoute = async (req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing Deleted Successfully!');
    res.redirect("/listings");
};


module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
if(req.files && req.files.length>0){

    //for single image
        // let url = req.file.path;
        // let filename = req.file.filename
        // listing.image = {url, filename};

    //for multiple images
        listing.image = [];
            for(let file of req.files){
            listing.image.push({
            url: file.path,
            filename: file.filename
})
}
        await listing.save();
    };
  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${listing._id}`);
};


module.exports.renderEditRoute = async (req, res)=>{
    let {id}=req.params;
    let list = await Listing.findById(id);
    if(!list){
        req.flash('error', 'listing you requested for doesnot exist');
        res.redirect("/listings");
    }
 
    //     let originalListingUrl = list.image.url;
    //     console.log(originalListingUrl);
    //    originalListingUrl= originalListingUrl.replace("/upload", "/upload/h_200/");
        res.render("./listings/edit.ejs", {list});
    
    
};

module.exports.createNewListing = async (req, res)=>{
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  // ✅ Multiple image support
newListing.image = [];
for(let file of req.files){
newListing.image.push({
    url: file.path,
    filename: file.filename
});
}
//single image support 
// let url = req.file.path;
// let filename = req.file.filename;
// newListing.image = {url, filename};
  await newListing.save();
  req.flash("success", "Listing created successfully!");
  res.redirect('/listings');
};


module.exports.showListing = async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!listing){
       req.flash("error", "Listing you requested for doesnot exist"); 
       res.redirect("/listings");
    }else{
       
        res.render("./listings/show.ejs", {listing});
    }
    
};

module.exports.showpageimage = (async(req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let images = listing.image;
       res.render("./listings/showimage.ejs", {images, listing});
});

