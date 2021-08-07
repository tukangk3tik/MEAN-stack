const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect('mongodb+srv://yan:' +
  process.env.MONGO_ATLAS_PW
  + '@cluster0.qkexc.mongodb.net/node-angular?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection failed!');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/**
 * this to enable access to file, without it, you cant reach the file url
 * use the /images path, and helped by path library by node to generate the path
 * */
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization" //set accept header
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  )
  next();
});

/**
 * First argumen, for generalization path for routes
 * So, in the routes file, we dont need write that path anymore
 * But for path using params, we keep the params at the routes
 */
app.use("/api/post", postRoutes);
app.use("/api/user", userRoutes);


module.exports = app;
