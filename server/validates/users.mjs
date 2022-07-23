import {check, body} from 'express-validator';
import {userDb} from '../dbs/index.mjs'

const validate = (method) => {
    let err = [];
    switch (method) {
        case 'register': {
            err = [ 
                body('email', 'Email không hợp lệ').exists().isEmail().custom(value => {
                    return userDb.findByEmail(value, 'email').then(user => {
                        if (user) {
                            return Promise.reject('Email đã được sử dụng');
                        }
                    });
                })
            ]
            break;   
        }
        case 'login':{
            err = [ 
                body('email', 'Email không hợp lệ').exists().isEmail().custom(value => {
                    return userDb.findByEmail(value, 'email').then(user => {
                        if (!user) {
                            return Promise.reject('Sai email');
                        }
                    });
                }),
                body('password', 'password không hợp lệ').exists().custom(password=> {
                    return userDb.findByPassword(password, 'password').then(user => {
                        if (!user) {
                            return Promise.reject('Sai mat khau');
                        }
                    });
                })
            ]
            break; 
        }
    }

    return err;
}

export default validate;