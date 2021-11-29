const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    // bookName: {
    //     type: String,
    //     required: [true, 'The reservation must be related to a book'],
    //     trim: true
    // },
    // bookId: {
    //     type: String,
    //     required: [true, 'The reservation must have a book Id'],
    //     trim: true
    // },
    // bookAuthor: {
    //     type: String,
    //     required: [true, 'The reservation must be related to an Author'],
    //     trim: true
    // },
    // userId: {
    //     type: String,
    //     required: [true, 'The reservation must be related to a user'],
    //     trim: true
    // },
    // userName: {
    //     type: String,
    //     required: [true, 'The reservation must be related to a user'],
    //     trim: true
    // },
    book: {
        type: mongoose.Schema.ObjectId,
        ref: 'Book',
        required: [true, 'The reservation must be related to a book']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'The reservation must be related to a user']
    },
    status: {
        type: String,
        enum: {
            values: ['available', 'reserved', 'borrowed'],
            message: 'Status is either available, reserved or borrowed'
        }

    },
    reservedAt: {
        type: Date,
        default: Date.now()
    },
    borrowedAt: Date,
    returnedAt: Date,
},
{
    toJSON: {virtuals: true },
    toObject: {virtuals: true },
}
);

// reservationSchema.pre(/^find/, function(next){
//     // this.populate({
//     //     path: 'book',
//     //     select: 'name'
//     // }).populate({
//     //     path: 'user',
//     //     select: 'name photo'
//     // });

//     this.populate({
//         path: 'user',
//         select: 'name photo'
//     });

//     next();
// });



const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
