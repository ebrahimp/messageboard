export const login = (user) => {
	return fetch('/api/login', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(user)
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const authenticateUser = (jwt, next) => {
	if (typeof window !== 'undefined') {
		localStorage.setItem('jwt', JSON.stringify(jwt));
		next();
	}
};

export const setName = (name, next) => {
	if (typeof window !== 'undefined') {
		localStorage.setItem('username', JSON.stringify(name));
		next();
	}
};

export const logout = (next) => {
	if (typeof window !== 'undefined') localStorage.removeItem('jwt');
	next();
	return fetch(`${process.env.REACT_APP_API_URL}/logout`, {
		method: 'GET'
	})
		.then((response) => {
			console.log('logout', response);
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const isAuthenticated = () => {
	if (typeof window == 'undefined') {
		return false;
	}

	if (localStorage.getItem('jwt')) {
		return JSON.parse(localStorage.getItem('jwt'));
	} else {
		return false;
	}
};
