if (process.env.NODE_ENV !== 'PROD') {
	require('dotenv').config();
}
const express = require('express');
const app = express();

app.get('/', (req, res) => {
	res.send('Hello Node');
});

const CurrentPort = process.env.PORT || 3000;
app.listen(CurrentPort, () =>
	console.log(`server is running on port ${CurrentPort}`)
);
