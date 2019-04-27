const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config');

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(cors());
const port = 8000;

const products = require('./app/products');
const categories = require('./app/categories');
const users = require('./app/users');

mongoose.connect(config.dbUrl, config.mongoOptions).then(() => {
    app.use('/products', products);
    app.use('/categories', categories);
    app.use('/users', users);
    app.listen(port, () => {
        console.log(`Server started on ${port} port`);
    });
})
