const express = require('express');
const multer = require('multer');

const Post = require('../models/post');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

/**
 * this will check the file type from incoming request (for security reason),
 * and setup the file name for local storage
*/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

router.get("", (req, res, next) => {
  const pageSize = +req.query.pageSize; // (+) for convert to number
  const currentPage = req.query.page;
  const postQuery = Post.find();
  let fetchedPost;

  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1)) //pagging setting
      .limit(pageSize);
  }

  postQuery
    .then(documents => {
      fetchedPost = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: 'Success fetch post data',
        posts: fetchedPost,
        maxPosts: count
      });

  });

});

//keep using params
router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({message: 'Post not found!'});
      }
    });

});

router.post('', multer({storage: storage}).single('image'),(req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });
  //console.log(post);
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added succesfully',
      post: {
        //below is javascript feature to copy all the value send for insert
        ...createdPost,  //title, content, imagePath
        id: createdPost._id,
      }
    });
  }); //save is provided by mongoose

});

//keep using params
router.put("/:id", multer({storage: storage}).single('image'), (req, res, next) => {

  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }

  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });

  console.log('Hasil post: ' + post);

  Post.updateOne({_id: req.params.id}, post)
    .then(result => {
      console.log(result);
      res.status(200).json({ message: 'Update successful!'});
    });
});

//keep using params
router.delete("/:id", (req, res, next) => {
  Post.deleteOne({_id: req.params.id})
    .then(result => {
      console.log(result);

      res.status(200).json({message: 'Post deleted!'});
    });
});

module.exports = router;
