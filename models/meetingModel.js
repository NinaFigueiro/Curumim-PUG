const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'The meeting must have a title'],
        unique: [true, 'There is already a meeting with that name'],
        trim: true
    },
    img: {
        type: String,
        default: '/img/meeting.png'
    }, 
    age: String,
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
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

meetingSchema.index({date: 1});

const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;
