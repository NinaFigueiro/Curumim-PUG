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
        type: String,
        enum: {
            values: ['available', 'reserved', 'borrowed'],
            message: 'Status is either available, reserved or borrowed'
        }

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
    },
    date: Date
});

// bookSchema.pre(/^find/, function(next) {
//   console.log(this)

//   next();
// });
// bookSchema.pre(/^find/, function(next) {
//     this.find().sort(date)

//   next();
// })

// bookSchema.pre('aggregate', function(next) {
//     this.pipeline().unshift({ $sort: {name: 1} })
//     console.log(this.pipeline());
//     next();
// })

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;