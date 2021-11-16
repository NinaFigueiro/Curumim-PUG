const mongoose = require('mongoose');

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

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;