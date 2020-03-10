const Post = require('../models/post');
const { postValidation } = require('../helpers/postValidation');

const getPosts = async (req, res) => {
	const currentPage = req.query.page || 1;
	const perPage = 3;
	let totalItems;

	const posts = await Post.find()
		.countDocuments()
		.then((count) => {
			totalItems = count;
			return Post.find()
				.skip((currentPage - 1) * perPage)
				.populate('comments.postedBy', '_id name')
				.populate('postedBy', '_id name')
				.select('_id title body postedBy createdAt comments')
				.limit(perPage)
				.sort({ createdAt: -1 });
		})
		.then((posts) => {
			res.json(posts);
		})
		.catch((err) => console.log(err));
};

const createPost = (req, res) => {
	const { error } = postValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const data = req.body;
	const post = new Post(data);

	req.profile.hashedPassword = undefined;
	post.postedBy = req.profile;

	post.save((err, result) => {
		res.json({
			message: result
		});
	});
};

const createComment = (req, res) => {
	let comment = req.body.comment;
	comment.postedBy = req.body.userId;

	Post.findByIdAndUpdate(req.body.postId, { $push: { comments: comment } }, { new: true })
		.populate('comments.postedBy', '_id name')
		.populate('postedBy', '_id name')
		.exec((err, result) => {
			if (err) {
				return res.status(400).json({
					error: err
				});
			} else {
				res.json(result);
			}
		});
};

module.exports = { getPosts, createPost, createComment };
