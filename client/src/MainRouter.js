import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Posts from './components/Posts';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';

const MainRouter = () => (
	<div>
		<Switch>
			<Route exact path="/login" component={Login} />
			<PrivateRoute exact path="/" component={Posts} />
		</Switch>
	</div>
);

export default MainRouter;
