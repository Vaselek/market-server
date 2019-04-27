const path = require('path');

const rootPath = __dirname;

module.exports = {
    rootPath,
    uploadPath: path.join(rootPath, 'public/uploads'),
    dbUrl: 'mongodb://localhost/market',
    mongoOptions: {
        useNewUrlParser: true,
        useCreateIndex: true
    }
};
