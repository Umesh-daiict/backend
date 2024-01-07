const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3001;
require('dotenv').config();
const connectDB = require('./app/utils/db');
const passport = require('passport');
require('./app/middleware/passport')(passport);

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(passport.initialize());

const userRoutes = require('./app/routes/userRoutes');
app.use('/', userRoutes);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
