const express = require('express');
const { getPosts, createPost, createComment } = require('../controllers/postController');
const { loginRequired } = require('../controllers/authController');
const { getUserById } = require('../controllers/userController');

const router = express.Router();

router.get('/posts', getPosts);
router.post('/post/create/:userId', createPost);

router.put('/post/comment', createComment);

router.param('userId', getUserById);

module.exports = router;
