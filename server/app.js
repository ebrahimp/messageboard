const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// db config
mongoose.connect(process.env.DB_CONN, { useNewUrlParser: true }).then(() => console.log('Connected to DB'));

mongoose.connection.on('error', (err) => {
	console.log(`DB connection error: ${err.message}`);
});

// routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan('dev'));

if (process.env.NODE_ENV == 'dev') {
	app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
}

app.use('/api', authRoutes);
app.use('/api', postRoutes);

app.use(function(err, req, res, next) {
	if (err.name === 'UnauthorizedError') {
		res.status(401).json({ message: 'Login required for access' });
	}
});

app.listen(port, () => {
	console.log('Server started on port:', port);
});
