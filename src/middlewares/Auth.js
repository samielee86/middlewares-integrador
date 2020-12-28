module.exports = (req, res, next) => {
    if (!req.session.user) {
        return res.render('user/user-login-form');
    }
    return next();
}