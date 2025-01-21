const express = require('express');
const cors = require('cors');
const app = express();

var corsOptions = {
    origin: 'http://localhost:8081'
}

global.__basedir = __dirname;

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const onInit = require('./src/routes');
onInit(app);

const PORT = process.env.PORT || 8000;

app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}`);
});