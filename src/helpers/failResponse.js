module.exports = (h, statusCode, message) => {
    const response = h.response({
        status: 'fail',
        message
    });

    response.type('application/json');
    response.code(statusCode);

    return response;
};
