function errorsService(res, error, data) {
    console.log(data);
    console.log(error);
    res.status(500);
    return res.json({});
};

module.exports = {
    errorsService
}
