if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}

const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const Listing = require("./models/listing.js");
const engine = require('ejs-mate');
app.engine('ejs', engine);
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const {listingSchema, reviewSchema} = require("./schema.js");
// const review = require("./models/review.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require("passport");
// const LocalStratergy = require("passport-local");
const LocalStrategy = require('passport-local');
const User = require("./models/user.js");

const mongoose = require('mongoose');

const listingRoute = require("./routes/listing.js");
const reviewRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");

// const MONGO_URL ='mongodb://127.0.0.1:27017/wanderlust';
const dbUrl = process.env.ATLASDB_URL

main() .then(()=>{
    console.log("connection successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);

}



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "/public/css")));
app.use(express.static(path.join(__dirname, "/public/js")));

const store = MongoStore.create({
    mongoUrl: dbUrl, //session information stored into atlas database so we pass dburl
    crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24*3600, //if no change into session the we update our information after 24 hours.
});

store.on("error", ()=>{
    console.log("ERROR on MONGO SESSION STORE", err);
})

app.use(session({
    // store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 *60 * 60 * 1000,
        maxAge: 7 * 24 *60 * 60 * 1000,
        httpOnly: true,
    }
}));


app.use(passport.initialize());
app.use(passport.session());

 app.use(flash());



passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.urlencoded({extended:true}));


// app.get("/", (req, res)=>{
//     res.send("root route");
// })


app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; //for signup, login and  logout.
    next();
});





// app.get("/demouser", async(req, res)=>{
//     let fakeUser = new User({
//         username:"Ishwar",
//         email:"ishwar@gmail.com",
//     });
// let registeredUser = await User.register(fakeUser, "ishu@01");
// res.send(registeredUser);
// });



app.use("/listings", listingRoute);
app.use("/listings/:id/review", reviewRoute);
app.use("/", userRoute);


app.get(/(.*)/, (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});


//Error handling middleware.
app.use((err, req, res, next)=>{
    let {status=500, message="something went wrong!"} = err;
   res.render("./listings/error.ejs", {message});
});

app.listen(8080, ()=>{
    console.log("listing your request");
});