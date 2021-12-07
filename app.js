const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');


const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const bookRouter = require('./routes/bookRoutes');
const reservationRouter = require('./routes/reservationRoutes');
const meetingRouter = require('./routes/meetingRoutes');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

// FRONTEND
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// 

// 1) GLOBAL MIDDLEWARES

// Serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public' )));

// Set security HTTP headers
// You can have a look at helmet package in github.com/helmetjs/helmet
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'", 'https:', 'http:', 'data:', 'ws:'],
            baseUri: ["'self'"],
            fontSrc: ["'self'", 'https:', 'http:', 'data:'],
            scriptSrc: ["'self'", 'https:', 'http:', 'blob:'],
            styleSrc: ["'self'", "'unsafe-inline'", 'https:', 'http:'],
          },
    }));

// Development login
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

// Body parser, reading data from body into req.body:
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
// Parses the data from cookie:
app.use(cookieParser());


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

// Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.cookies);

    next();
})

//  3) ROUTES

app.use('/', viewRouter);
app.use('/api/v1/books', bookRouter);
app.use('/api/v1/reservations', reservationRouter);
app.use('/api/v1/meetings', meetingRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;