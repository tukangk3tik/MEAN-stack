const express = require('express');
const postController = require('../controller/posts');

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const router = express.Router();

router.get("", postController.getPosts);

//keep using params
router.get("/:id", postController.getOnePost);

router.post('', checkAuth, extractFile, postController.createPost);

//keep using params
router.put("/:id", checkAuth, extractFile, postController.updatePost);

//keep using params
router.delete("/:id", checkAuth, postController.deletePost);

module.exports = router;
