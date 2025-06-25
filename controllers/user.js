module.exports.signup = async(req, res)=>{
    try{
        let{username, email, password} = req.body;
        let newUser = new User({username, email});
        let registeredUser = await User.register(newUser,password);
        console.log(registeredUser);

        //signup user login automatically
         req.login(registeredUser, (err)=>{
        if(err){
            return next(err);
        }
         req.flash("success", "User registered successfully!");
        res.redirect("/listings");
    })
       
    }catch(err){
        req.flash("error", err.message);
        res.redirect("/signup")
    }
};

module.exports.renderSignupForm = (req, res)=>{
    res.render("users/signup.ejs");
}

module.exports.renderLoginForm = (req, res)=>{
    res.render("users/login.ejs");
};

module.exports.login = async(req, res)=>{
    req.flash("success", "Welcome back to Wanderlust!");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout =  (req, res, next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    })
}