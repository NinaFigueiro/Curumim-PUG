const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');


const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const bookRouter = require('./routes/bookRoutes');
const userRouter = require('./routes/userRoutes');
const reservationRouter = require('./routes/reservationRoutes');

const app = express();

// 1) GLOBAL MIDDLEWARES

// Set security HTTP headers
// You can have a look at helmet package in github.com/helmetjs/helmet
app.use(helmet());

// DEvelopment login
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Limit request from same API
// This is a security measure for allowing only 100 req per hour per IP
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter polution
// We can also whitelist some properties:
// app.use(
//     hpp({
//         whitelist: ['duration']
//     })
// );
app.use(hpp());

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.headers);

    next();
})

//  3) ROUTES
app.use('/api/v1/books', bookRouter);
app.use('/api/v1/reservations', reservationRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;