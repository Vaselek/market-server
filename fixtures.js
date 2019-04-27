const mongoose = require('mongoose');
const config = require('./config');

const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');


const run = async () => {
    await mongoose.connect(config.dbUrl, config.mongoOptions);

    const connection = mongoose.connection;

    const collections = await connection.db.collections();
    for (let collection of collections) {
        await collection.drop();
    }

    let users = await User.create(
        {
            username: 'john@gmail.com',
            password: 'password',
            token: '123',
            displayName: 'John Doe',
            phone: '0555-333-333'
        },
        {
            username: 'ivan@gmail.com',
            password: 'password',
            token: '456',
            displayName: 'Ivan Doe',
            phone: '0555-000-000'
        }
    )

    const categories = await Category.create(
        {title: 'Computers'},
        {title: 'Cars'},
        {title: 'Other'}
    )

    await Product.create(
        {
            title: 'Mac',
            price: 2500,
            description: 'Very Cool Mac',
            category: categories[0]._id,
            user: users[0]._id,
            image: 'mac.jpg'
        },
        {
            title: 'Asus',
            price: 2600,
            description: 'Very Cool Asus',
            category: categories[0]._id,
            user: users[0]._id,
            image: 'asus.jpg'
        },
        {
            title: 'Nissan',
            price: 12500,
            description: 'Very Cool Nissan',
            category: categories[1]._id,
            user: users[1]._id,
            image: 'nissan.png'
        },
        {
            title: 'Toyota',
            price: 22600,
            description: 'Very Cool Toyota',
            category: categories[1]._id,
            user: users[1]._id,
            image: 'toyota.jpg'
        },
        {
            title: 'Cat',
            price: 2000,
            description: 'Very Cool Cat',
            category: categories[2]._id,
            user: users[1]._id,
            image: 'cat.jpg'
        }
    )
    await connection.close();
};

run().catch(error => {
    console.error('Smt went wrong', error);
});

