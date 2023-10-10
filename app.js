//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
require('dotenv').config();
const PORT = process.env.PORT || 3000;

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// mongoose.connect("mongodb://127.0.0.1:27017/blogDB", {useNewUrlParser: true});
mongoose.connect("mongodb+srv://" + process.env.USERNAME_MONGO + ":" + process.env.PASSWORD + "@cluster0.ytfcbis.mongodb.net/blogDB", {useNewUrlParser: true});

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  async function myPosts() {
    const posts = await Post.find({});

    res.render("home", {ParagraphHome: homeStartingContent, blogPosts: posts});
  }
  myPosts();

});

app.get("/posts/:postId", function(req, res){
  const postId = req.params.postId;

  Post.findOne({_id: postId})
  .then((docs) => {
    res.render("post", {title: docs.title, content: docs.content});
  })
  .catch((err) => {
    console.log(err);
  });

});

app.get("/about", function(req, res){
  res.render("about", {ParagraphAbout: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {ParagraphContact: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save();
  
  res.redirect("/");
});

app.listen(PORT, function(){
  console.log("Sever started on port ${PORT}");
});

