const { body } = require('express-validator');
const path = require('path');
const dataBaseHelper = require('../helpers/data-base-helper');
const bcrypt = require('bcryptjs');

module.exports = {
    register: [
        body('email')
            .notEmpty()
                .withMessage('Debe ingresar un e-mail.')
                .bail()
            .isEmail()
                .withMessage('Debe ingresar un e-mail válido.')
                .bail()
            .custom( ( value ) => {
                const allUsers = dataBaseHelper.getAllDataBase('users.json')
                const user = allUsers.find((user) => user.email == value)
                return !user;
            })
                .withMessage('El e-mail ingresado ya se encuentra registrado.')
                .bail(),
        body('avatar')
            .custom( (value, { req } ) => {
                return req.files[0];
            })
                .withMessage('Imagen Obligatoria')
                .bail()
            .custom( (value, { req }) => {
                    const uploadedFile = req.files[0].originalname;
                    const ext = path.extname(uploadedFile);
                    const AcceptedExt = ['.jpg', '.jpeg', '.png'];
                    return AcceptedExt.includes(ext);
            })
                .withMessage('Debe cargar una imagen de extensión .jpg, .jpeg o .png')
                .bail(),
        body('password')
            .notEmpty()
                    .withMessage('Debe ingresar una contraseña.')
                    .bail()
            .isLength( { min:6 })
                .withMessage('La contraseña debe tener como mínimo 6 caracteres.')
                .bail()
            .custom((value, { req }) => {
                if(req.body.retype){
                    return value == req.body.retype;
                }
                return true;
            })
                .withMessage('La contraseñas deben coincidir.')
                .bail(),
        body('retype')
            .notEmpty()
                .withMessage('Debe volver a ingresar la contraseña.')
    ],

    login: [
        body('email')
            .notEmpty()
                .withMessage('El campo e-mail es obligatorio')
                .bail()
            .custom( ( value, { req } ) => {
                const allUsers = dataBaseHelper.getAllDataBase('users.json')
                const user = allUsers.find((user) => user.email == value)
                return bcrypt.compareSync( req.body.password, user.password)
            })
                .withMessage('El usuario y contraseña no coinciden')
                .bail()
    ]
}