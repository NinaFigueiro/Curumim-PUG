const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log('DB connection successful!'));

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'The book must have a title'],
        unique: [true, 'There is already a book with that name']
    },
    author: {
        type: String,
        required: [true, 'The book must have an author']
    },
    img: {
        type: String
    }
});

// const Book = mongoose.model('Book', bookSchema);

// const testBook = new Book({
//     name: 'The Forest Hiker',
//     author: 'Alice Marvel'
// });
// testBook.save().then(doc => {
//     console.log(doc);
// }).catch(err => {
//     console.log('ERROR:', err)
// });

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
