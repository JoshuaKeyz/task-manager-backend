const errorHandler = function(err, req, res, next){
    let statusCode = err.statusCode || 500;
    let message = err.message;
    if (err.code === 11000) {
        statusCode = 400;
        message = `The email '${err.keyValue.email}' has already been registered`
    } if(err._message && err._message === 'user validation failed') {
        statusCode = 400;
    }
    else {
        message = err.message;
    }
    res.status(statusCode).json({
        error: message
    })
}

module.exports = errorHandler;