const express = require("express");
const { AuthProctected } = require("../config/middleware/authMiddleware");

const PostController = require('../controllers/postController')


const router = express.Router();

router.route("/")
    .get(PostController.getAllPosts)
    .post(AuthProctected, PostController.createPost);

router.route("/:id")
    .get(PostController.getPost)
    .delete(PostController.deletePost)
    .put(PostController.updatePost);


module.exports = router;