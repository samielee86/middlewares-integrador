const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const dataBaseHelper = require ('../helpers/data-base-helper');

module.exports = {
    showRegister: (req, res) => {
        return res.render('user/user-register-form');
    },
    processRegister: (req, res) => {

        const results = validationResult(req);

        if (!results.isEmpty()) {
            return res.render('user/user-register-form', {
                errors: results.errors,
                old: req.body
            }); 
        }

        const hashedPassword = bcrypt.hashSync(req.body.password, 12);
        const newUser = {
            id: dataBaseHelper.generateId('users.json'),
            email: req.body.email,
            password: hashedPassword,
            avatar: req.files[0].filename
        }
        const allUsers = dataBaseHelper.getAllDataBase('users.json');
        const usersToSave = [...allUsers, newUser]
        dataBaseHelper.writeNewDataBase(usersToSave, 'users.json');

        return res.redirect('/user/login');
    },
    showLogin: (req, res) => {
        return res.render('user/user-login-form');
    },
    processLogin: (req, res) => {
        const results = validationResult(req);

        if (!results.isEmpty()) {
            return res.render('user/user-login-form', {
                errors: results.errors,
                old: req.body
            }); 
        }

        const allUsers = dataBaseHelper.getAllDataBase('users.json');
        const userToLog = allUsers.find((user) => user.email == req.body.email)
        req.session.user = userToLog;

        if(req.body.remember) {
            res.cookie('user', userToLog.id, {maxAge: 1000 * 60 * 60 * 24});
        }
        return res.redirect('/');
    },
    showProfile: (req, res) => {
        return res.render('user/profile');
    },
    logout: (req, res) => {
        req.session.destroy(()=> {
            req.session = null
            res.cookie('user', null, {maxAge: -1})
            return res.redirect('/')
        });
    }

}