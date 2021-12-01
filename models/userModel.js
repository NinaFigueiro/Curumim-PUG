const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: [true, 'A user with this email has already been created'],
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    img: {
        type: String,
        default: '/img/users/default.jpg'
    },    
    role: {
        type: String,
        enum: ['user', 'super-user', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // This only works on CREATE and SAVE
            validator: function(el) {
                return el === this.password;
            },
            message: 'Passwords are not the same'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    approvedUser: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    }
},
{
    toJSON: {virtuals: true },
    toObject: {virtuals: true },
}
);

// Encrypting password
userSchema.pre('save', async function(next) {
    // ONly run this function if password was actually modified
    if(!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // We set paswordConfirm to undefined in order not to save it to DB
    // We only need it for password validation
    this.passwordConfirm = undefined;
    next();

});


userSchema.pre('save', function(next) {
    // Mongoose library: isModified, isNew
    // If the property "password" is not modified or has just been created:
    if(!this.isModified('password') || this.isNew) return next();
    
    // We subtract 1000 ms so that the token is not created before password is changed
    this.passwordChangedAt = Date.now() - 1000;
    next();  
});

userSchema.pre(/^find/, function(next) {
    // this points to the current query
    this.find({ active: {$ne: false} });
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    // console.log({resetToken}, this.passwordResetToken);
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    
    return resetToken;
};

const User = mongoose.model('User', userSchema);


module.exports = User;