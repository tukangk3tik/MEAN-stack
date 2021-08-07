const Post = require('../models/post');

exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });
  //console.log(post)
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added succesfully',
      post: {
        //below is javascript feature to copy all the value send for insert
        ...createdPost,  //title, content, imagePath
        id: createdPost._id,
      }
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Creating a post failed!"
    });
  }); //save is provided by mongoose
}

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }

  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });

  console.log('Hasil post: ' + post);

  Post.updateOne(
    {_id: req.params.id, creator: req.userData.userId }, post
  ).then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: 'Update successful!'});
      } else {
        res.status(401).json({ message: 'Not authorized!'});
      }
    }
  ).catch(error => {
    res.status(500).json({ message: "Couldn't update post!" });
  });
}


exports.getPosts = (req, res, next) => {
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
    })
    .catch(error => {
      res.status(500).json({
        messsage: "Fetching posts failed!"
      });
    });

  });

}


exports.getOnePost = (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({message: 'Post not found!'});
      }
    })
    .catch(error => {
      res.status(500).json({
        messsage: "Fetching posts failed!"
      });
    });
}


exports.deletePost = (req, res, next) => {
  Post.deleteOne(
    {_id: req.params.id, creator: req.userData.userId })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: 'Deletion successful!'});
      } else {
        res.status(401).json({ message: 'Not authorized!'});
      }
    })
    .catch(error => {
      res.status(500).json({
        messsage: "Fetching posts failed!"
      });
    });
}
