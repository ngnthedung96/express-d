import e from 'express';
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
        }
        break; 
        case 'login':{
            var a 
            err = [ 
                body('email', 'Email không hợp lệ').exists().isEmail().custom(value => {
                    return userDb.findByEmail(value, 'email').then(user => {
                        if (!user) {
                            return Promise.reject('Sai email');
                        }
                        else{
                            a = user.dataValues.password
                        }
                    });
                }),
                body('password', 'password không hợp lệ').exists().custom(password=> {
                    if(!password === a){
                        return ('Sai mật khẩu');
                    }
                })
            ]
        }
        break; 
    }

    return err;
}

export default validate;