import { userDb } from '../dbs/index.mjs'
import { validationResult } from 'express-validator';

const register = async(req, res, next) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    // console.log(req)
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

    try {
        const user = await userDb.register(email, password);
        res.status(200).json({
            status: true,
            msg: 'Đăng ký thành công',
            data: {
                uid: user.id,
                email: user.email
            }
        });

        next()
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}

const login = async(req, res, next) => {
    const errors = validationResult(req);
    // console.log(req)
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

    try {
        res.status(200).json({
            status: true,
            msg: 'Đăng nhap thành công'
        });

        next()
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}

export const userController = {
    register,
    login
}