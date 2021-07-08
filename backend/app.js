const express = require('express');
const bodyParser = require('body-parser');

const app = express();

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
})

app.post('/api/post', (req, res, next) => {
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: 'Post added succesfully'
  });
});

app.get("/api/post", (req, res, next) => {
  const posts = [
    {
      "id": "1yg231asd",
      "title": "Post 1",
      "content": "Content 1"
    },
    {
      "id": "78234jkas",
      "title": "Post 2",
      "content": "Content 2"
    }
  ];

  res.status(200).json({
    message: 'Success fetch post data',
    posts: posts
  });
});


module.exports = app;
