const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'The meeting must have a title'],
        unique: [true, 'There is already a meeting with that name'],
        trim: true
    },
    img: {
        type: String
    },
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
    date: Date,
    time: String,
    formlink: String,
    place: {
        type: String,
        trim: true
    }

},
{
    toJSON: {virtuals: true },
    toObject: {virtuals: true },
}
);

const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;
