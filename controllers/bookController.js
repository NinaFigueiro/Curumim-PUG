const fs = require('fs');

const books = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
    );
// Param middleware
exports.checkID = (req, res, next, val) => {
    console.log(`Book id is ${val}`);

    if(req.params.id * 1 > books.length) {
        return res.status(404).json({
            status: 'fail',
            message:'invalid ID'
        });
    }
    next();
};

exports.checkBoby = (req, res, next) => {
    if(!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'fail',
            message: 'Missinf name or price'
        })
    }
    next();
}

exports.getAllBooks = (req, res) => {
    console.log(req.requestTime);

    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: books.length,
        data: {
            books
        }
    });
};

exports.getBook = (req, res) => {    
    const id = req.params.id * 1;
    const book = books.find(el => el.id === id);

    res.status(200).json({
        status: 'success',
        data: {
            book
        }
    });
};

exports.createBook = (req, res) => {
    // console.log(req.body);
    // the newId is the id of the last element in the books array +1
    const newId = books[books.length -1].id + 1;
    const newBook = Object.assign({id: newId}, req.body);

    books.push(newBook);
    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`, 
        JSON.stringify(books), 
        err => {
        res.status(201).json({
            status: 'success',
            data: {
                book: newBook
            }
        });
        }
    );
};

exports.updateBook = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            book: '<Updated tour here...>'
        }
    })
};

exports.deleteBook = (req, res) => {
    res.status(204).json({
        status: 'success',
        data: null
    })
};