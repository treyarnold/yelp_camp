const   express             = require("express"),
        app                 = express(),
        request             = require ("request"),
        bodyParser          = require("body-parser"),
        mongoose            = require("mongoose"), 
        passport            = require("passport"),
        methodOverride      = require("method-override"),
        flash               = require("connect-flash");
        
var     Campground          = require("./models/campground"),
        Comment             = require("./models/comment"),
        User                = require("./models/user"),
        seedDB              = require("./seeds"),
        LocalStrategy       = require("passport-local");
        
var     commentRoutes       = require("./routes/comments"),
        indexRoutes          = require("./routes/index"),
        campgroundRoutes    = require("./routes/campgrounds");

mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method")),
app.use(flash());

// Passport config
app.use(require("express-session")({
    secret: "Mara is the cutest baby ever!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


// server startup for local testing
// app.listen(3000, function(){
// server startup for hosting
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp app has started");
});