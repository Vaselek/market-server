const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

router.post('/', (req, res) => {
    const user = new User(req.body);

    user.generateToken();

    user.save()
        .then(user => res.send({message: 'User registered', user}))
        .catch(error => res.status(400).send(error))
});

router.post('/sessions', async (req, res) => {
    const user = await User.findOne({username: req.body.username});
    if(!user) {
        return res.status(400).send({error: 'Username not found'});
    }
    const isMatch = await user.checkPassword(req.body.password);
    if (!isMatch) {
        return res.status(400).send({error: 'Password is wrong'});
    }
    user.generateToken();
    await user.save();
    return res.send({ message: 'Login successful', user })
});

router.delete('/sessions', async (req, res) => {
    const token = req.get('Authorization');
    const success = {message: 'Logged out'};
    if (!token) return res.send(success);
    const user = await User.findOne({token});
    if (!user) return res.send({success});
    user.generateToken();
    await user.save();
    return res.send(success);
});

router.put('/', auth, async (req, res) => {
    req.user.password = req.body.password;
    await req.user.save();
    res.send({message: 'OK'})
});

router.get('/secret', auth, (req, res) => {
    res.send({message: req.user._id})
});

module.exports = router;