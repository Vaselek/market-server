const express = require('express');
const Category = require('../models/Category');
const router = express.Router();

router.get('/', (req, res) => {
    Category.find()
        .then(categories => res.send(categories))
        .catch(() => res.sendStatus(500))
});

module.exports = router;