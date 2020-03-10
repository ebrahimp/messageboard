import React, { Component } from 'react';
import axios from 'axios';
import { Container } from 'reactstrap';
import { ListGroup, ListGroupItem, ListGroupItemHeading } from 'reactstrap';
import Comment from './Comment';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { isAuthenticated } from './Auth';

class Posts extends Component {
	constructor() {
		super();
		this.state = {
			title: '',
			body: '',
			user: {},
			post: '',
			posts: [],
			comments: [],
			page: 1,
			showSuccess: false
		};

		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleInputChange = (event) => {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		this.setState({ error: '' });
		this.setState({
			[name]: value
		});
	};

	componentDidMount() {
		this.getPosts();
	}

	getPosts = (page) => {
		axios
			.get(`/api/posts/?page=${page}`)
			.then((response) => {
				const data = response.data;
				this.setState({ posts: data });
				//console.log('Post data sent to the server');
			})
			.catch(() => {
				console.log('Posts get api error');
			});
	};

	isPostValid = () => {
		const { title, body } = this.state;
		if (title.length === 0 || body.length === 0) {
			this.setState({ error: 'Title and message are required', loading: false });
			return false;
		}
		return true;
	};

	handleSubmit = (event) => {
		event.preventDefault();

		if (this.isPostValid()) {
			const userId = isAuthenticated().data.user._id;
			const token = isAuthenticated().data.token;

			const payload = {
				title: this.state.title,
				body: this.state.body
			};

			axios({
				method: 'POST',
				url: `/api/post/create/${userId}`,
				data: payload,
				Authorization: `Bearer ${token}`
			})
				.then((response) => {
					//console.log('Create post data sent to the server');
					this.setState({ showSuccess: true });
					this.getPosts();
					this.resetuserInputs();
				})
				.catch((error) => {
					console.log('Create post error', error.response.data.message);
				});
		}
	};

	resetuserInputs = () => {
		this.setState({
			title: '',
			body: ''
		});

		window.setTimeout(() => {
			this.setState({
				showSuccess: false
			});
		}, 1000);
	};

	renderCreatePost = () => {
		return (
			<div style={{ border: '1px solid black', padding: '20px', margin: '20px' }}>
				<div className="alert alert-danger" style={{ display: this.state.error ? '' : 'none' }}>
					{this.state.error}
				</div>
				<div className="alert alert-success" style={{ display: this.state.showSuccess ? '' : 'none' }}>
					Message Posted!
				</div>

				<Form onSubmit={this.handleSubmit}>
					<FormGroup>
						<Label for="title">Title:</Label>
						<Input
							type="title"
							name="title"
							id="title"
							value={this.state.title}
							onChange={this.handleInputChange}
						/>
					</FormGroup>
					<FormGroup>
						<Label for="body">Message:</Label>
						<Input
							type="textarea"
							name="body"
							id="body"
							value={this.state.body}
							onChange={this.handleInputChange}
						/>
					</FormGroup>
					<Button type="submit">Post</Button>
				</Form>
			</div>
		);
	};

	displayPosts = (posts) => {
		if (!posts.length) return <p>No more posts!</p>;

		return posts.map((post, index) => (
			<ListGroup key={index}>
				<ListGroupItem className="mb-4" key={index}>
					<ListGroupItemHeading>
						{post.title} by {post.postedBy.name} - {new Date(post.createdAt).toDateString()}
					</ListGroupItemHeading>
					{post.body} <br />
					<br />
					<b>Comments</b>
					{post.comments.map((comment, i) => {
						return (
							<p key={i}>
								<i>{comment.postedBy.name}:</i> {comment.text}{' '}
							</p>
						);
					})}
					<Comment postId={post._id} comments={this.state.comments} updateComments={this.getPosts} />
				</ListGroupItem>
			</ListGroup>
		));
	};

	loadNext = (number) => {
		this.setState({ page: this.state.page + number });
		this.getPosts(this.state.page + number);
	};

	loadPrevious = (number) => {
		this.setState({ page: this.state.page - number });
		this.getPosts(this.state.page - number);
	};

	loadPosts = (page) => {
		this.getPosts(page).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				this.setState({ posts: data });
			}
		});
	};

	render() {
		const { posts, page } = this.state;

		return (
			<Container className="themed-container">
				<h3 style={{ margin: 20 + 'px' }}>Latest Posts</h3>

				{this.renderCreatePost()}
				{this.displayPosts(posts)}

				{page > 1 ? (
					<button className="btn btn-raised btn-primary mr-4 mt-4 mb-4" onClick={() => this.loadPrevious(1)}>
						Previous
					</button>
				) : (
					''
				)}

				{posts.length ? (
					<button className="btn btn-raised btn-primary mt-4 mb-4" onClick={() => this.loadNext(1)}>
						Next
					</button>
				) : (
					''
				)}
			</Container>
		);
	}
}

export default Posts;
