const express = require("express"),
app = express(),
expressSanitizer = require("express-sanitizer"),
bodyParser = require("body-parser"),
mongoose = require("mongoose"),
methodOverride = require("method-override");

const port = 5500;

// App Config
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));

// Mongoose model config
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
const Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Test Blog",
//     image: "https://mk0nationaltodayijln.kinstacdn.com/wp-content/uploads/2020/04/national-bulldogs-are-beautiful-day-640x514.jpg",
//     body: "This is a blog post"
//     }, function(err, blog) {
//         if(err) {
//             console.log(err);
//         } else {
//             console.log("Newly added blog: ");
//             console.log(blog)
//         }
//     }
// );

// Restful Routes

app.get("/", function(req, res){
    res.redirect("/blogs");
})

// Index routes
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err) {
            console.log("ERROR!");
        } else {
            res.render("index", {blogs: blogs});
        }
    })
});

// new route
app.get("/blogs/new", function(req, res){
    res.render("new");
});

// create route
app.post("/blogs", function(req, res){
    // create blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBLog){
        if(err){
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    })
    // then redirect
})

// show route
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err) {
            res.redirect("/blogs");
        } else {
            res.render("show", {blog:foundBlog});
        }
    })
})

// edit route
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog:foundBlog});
        }
    })
})

//update route
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id)
        }
    })
})

//delete route
app.delete("/blogs/:id", function(req, res){
    //destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
    //redirect blog
})

app.listen(port, () => console.log(`Server is listening at http://localhost:${port}`));
