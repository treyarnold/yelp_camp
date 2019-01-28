const   express     = require("express"),
        router      = express.Router(),
        Campground  = require("../models/campground"),
        middleware  = require("../middleware");

// INDEX - List of campgrounds
router.get ("/", (req, res) => {
    // get all campgrounds from db
    Campground.find({}, function(err, campgrounds){
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: campgrounds});
        }
    });
});

// Create - add new campgrounds to the DB
router.post ("/", middleware.isLoggedIn, (req, res) => {
    // get data from form and add to array
    // redirect back to campgrounds
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, price: price, image: image, description: description, author: author};
    // create a new campground and save to DB
    Campground.create(newCampground, function(err, campgrounds){
        if (err) {
            console.log(err);
        } else {
            res.redirect ("/campgrounds");
        }
    });
});

// NEW - Add new campgrounds
router.get("/new", middleware.isLoggedIn, (req, res) =>{
    res.render("campgrounds/new");
}) ;

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    // find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err || !foundCampground) {
            console.log(err);
            req.flash("error", "Campground not found");
            res.redirect ("back");
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
    // render the show template with that campground
});

// Edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// Update campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if (err){
            res.redirect ("/campgrounds");
        } else {
            req.flash("success", "Campground updated");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Delete route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // destroy blog
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err){
            console.log(err);
            res.redirect("/campgrounds/");
        } else {
            // redirect
            req.flash("success", "Campground removed");
            res.redirect("/campgrounds/");
        }
    });
});

module.exports = router;