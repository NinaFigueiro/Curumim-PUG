const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'The book must have a title'],
        unique: [true, 'There is already a book with that name'],
        trim: true
    },
    author: {
        type: String,
        required: [true, 'The book must have an author'],
        trim: true
    },
    img: {
        type: String
    },
    status: {
        type: String
    },
    reservations: Number,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    summary: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;