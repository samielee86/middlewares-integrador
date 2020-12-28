const dataBaseHelper = require('../helpers/data-base-helper');

module.exports = (req, res, next) => {
    if (req.cookies.user && !req.session.user) {
        const allUsers = dataBaseHelper.getAllDataBase('users.json')
        const userToLog = allUsers.find(user => user.id == req.cookies.user)
        req.session.user = userToLog;
    }
    return next();
}