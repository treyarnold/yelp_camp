const   express     = require("express"),
        router      = express.Router({mergeParams: true}),
        Campground  = require("../models/campground"),
        Comment     = require("../models/comment"),
        middleware  = require("../middleware");

// comments new routes
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground){
        if(err || !campground){
            console.log(err);
            req.flash("error", "Campground can not be found");
            res.redirect("back");
        } else {
            res.render("comments/new", {campground: campground}) ;
        }
    });
});

// comments create
router.post("/", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err) {
            console.log(err);
            req.flash("error", "Something went wromg");
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if (err){
                    console.log(err);
                    res.redirect("/campgrounds");
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// Edit comment route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err || !foundCampground) {
            console.log(err);
            req.flash("error", "Campground can not be found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                console.log(err);
            }else {
                res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
            }
        });
    });
});

// Update comment route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err){
            res.redirect ("back");
        } else {
            req.flash("success", "Comment edited");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Delete comment route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    // destroy blog
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if (err){
            console.log("comment delete err:", err);
            res.redirect("back");
        } else {
            // redirect
            req.flash("success", "Comment removed");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;