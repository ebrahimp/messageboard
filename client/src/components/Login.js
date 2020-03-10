import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, Container, Alert } from 'reactstrap';
import { authenticateUser } from './Auth';
import axios from 'axios';

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			error: '',
			redirect: false
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

	handleSubmit = (event) => {
		event.preventDefault();
		const { email, password } = this.state;
		axios({
			method: 'POST',
			url: '/api/login',
			data: { email, password }
		})
			.then((response) => {
				//console.log('login success');
				authenticateUser(response, () => {
					this.setState({ redirect: true });
				});
			})
			.catch((error) => {
				//console.log('login error', error.response.data.message);
				this.setState({ error: error.response.data.message });
			});
	};

	render() {
		const { error, redirect } = this.state;

		if (redirect) {
			return <Redirect to="/" />;
		}

		return (
			<div>
				<Container className="themed-container">
					<h1>Login</h1>

					<Alert color="danger" style={{ display: error ? '' : 'none' }}>
						{error}
					</Alert>

					<Form onSubmit={this.handleSubmit}>
						<FormGroup>
							<Label for="email">Email</Label>
							<Input
								type="email"
								name="email"
								value={this.state.email}
								onChange={this.handleInputChange}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="password">Password</Label>
							<Input
								type="password"
								name="password"
								value={this.state.password}
								onChange={this.handleInputChange}
							/>
						</FormGroup>
						<Button type="submit">Login</Button>
					</Form>
				</Container>
			</div>
		);
	}
}

export default Login;
