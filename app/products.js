const express = require('express');
const multer = require('multer');
const path = require('path');
const nanoid = require('nanoid');
const config = require('../config');
const ObjectId = require('mongoose').Types.ObjectId;
const auth = require('../middleware/auth')

const Product = require('../models/Product');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});

const upload = multer({storage});

const router = express.Router();

router.get('/', (req, res) => {
    if (req.query.category)
        return Product.find({category: new ObjectId(req.query.category)}).populate('user').sort([['issuedAt', 1]])
            .then(products => res.send({products: products, category: req.query.category}))
            .catch(() => res.sendStatus(500));
    Product.find().populate('category')
        .then(products => res.send({products: products}))
        .catch(()=>res.sendStatus(500))
});

router.get('/:id', (req, res) => {
    Product.findById(req.params.id).populate('user').populate('category')
        .then(result => {
            if (result) return res.send(result);
            res.sendStatus(404);
        })
        .catch(()=>res.sendStatus(500))
});

router.post('/', auth, upload.single('image'), (req, res) => {
    if (req.user._id.equals(req.body.user)) {
        const productData = req.body;
        if (req.file) {
            productData.image = req.file.filename;
        }
        const product = new Product(productData);
        product.save()
            .then(result => res.send(result))
            .catch((error) => res.status(400).send(error));
    } else {
        return res.sendStatus(403);
    }
});

router.delete('/:id', auth, (req, res) => {
    Product.findById(req.params.id)
        .then(product => {
            if (product.user.equals(req.user._id)) {
                product.delete()
                return res.send({message: 'Deleted'});
            }
            return res.sendStatus(403);
        })
        .catch(()=>res.sendStatus(500))
});

module.exports = router;
