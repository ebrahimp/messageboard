import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { isAuthenticated } from './Auth';

class Comment extends Component {
	constructor(props) {
		super(props);
		this.state = {
			text: '',
			comments: [],
			error: ''
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

	comment = (userId, token, postId, comment) => {
		return fetch('/api/post/comment', {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({ userId, postId, comment })
		})
			.then((response) => {
				const data = response.data;
				this.setState({ comments: data });
			})
			.catch((err) => console.log('Comment api error', err));
	};

	isCommentValid = () => {
		const { text } = this.state;
		if (text.length === 0) {
			this.setState({ error: 'Please enter a comment' });
			return false;
		}
		return true;
	};

	handleSubmit = (e) => {
		e.preventDefault();

		if (!isAuthenticated()) {
			this.setState({ error: 'Please login to comment' });
			return false;
		}

		if (this.isCommentValid()) {
			const userId = isAuthenticated().data.user._id;
			const token = isAuthenticated().data.token;
			const postId = this.props.postId;

			this.comment(userId, token, postId, { text: this.state.text }).then((data) => {
				this.setState({ text: '' });
				this.props.updateComments();
			});
		}
	};

	render() {
		const { error } = this.state;

		return (
			<div>
				<div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
					{error}
				</div>

				<Form onSubmit={this.handleSubmit}>
					<FormGroup>
						<Label for="comment">
							<b>Leave a comment:</b>
						</Label>
						<Input
							type="textarea"
							name="text"
							id="text"
							value={this.state.text}
							onChange={this.handleInputChange}
						/>
					</FormGroup>
					<Button>Comment</Button>
				</Form>
			</div>
		);
	}
}

export default Comment;
