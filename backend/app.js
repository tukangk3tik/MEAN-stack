const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

mongoose.connect('mongodb+srv://yan:deogratias88@cluster0.qkexc.mongodb.net/node-angular?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection failed!');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  )
  next();
});

app.post('/api/post', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  //console.log(post);
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added succesfully',
      returnId: createdPost._id
    });
  }); //save is provided by mongoose

});

app.get("/api/post", (req, res, next) => {
  Post.find()
    .then(documents => {
      console.log(documents);
      res.status(200).json({
        message: 'Success fetch post data',
        posts: documents
      });
    });

});

app.delete("/api/post/:id", (req, res, next) => {
  Post.deleteOne({_id: req.params.id})
    .then(result => {
      console.log(result);

      res.status(200).json({message: 'Post deleted!'});
    });
});


module.exports = app;
