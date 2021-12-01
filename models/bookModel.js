const mongoose = require('mongoose');
// We don't need to import User, since we use ref:'User' (class151)
// const User = require('./userModel');

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
        type: String,
        default: '/img/book.png'
    }, 
    status: {
        type: String,
        enum: {
            values: ['available', 'reserved', 'borrowed'],
            message: 'Status is either available, reserved or borrowed'
        },
        default: 'available'

    },
    totalReservations: Number,
    reservationId: String,
    createdAt: {
        type: Date,
        default: Date.now()
    }
},
{
    toJSON: {virtuals: true },
    toObject: {virtuals: true },
}
);
// Virtual populate
// we connect the modules together by setting the book id in the property "book" in Reservation
bookSchema.virtual('reservations', {
    ref: 'Reservation',
    foreignField: 'book',
    localField: '_id'
});


// DOCUMENT MIDDLEWARE: runs before SAVE and CREATE

// Embedding: reservedToUser should be of type Array
// bookSchema.pre('save', async function(next) {
//     const reservedToUserPromises = this.reservedToUser.map(async id => await User.findById(id));
//     this.reservedToUser = await Promise.all(reservedToUserPromises);
//     next();
// });

// QUERY MIDDLEWARE
// bookSchema.pre(/^find/, function(next) {
//     this.query = this.query.sort('name');
//     next();
// })
// this.query.sort('name')

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;







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

