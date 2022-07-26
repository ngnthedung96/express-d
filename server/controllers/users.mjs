import { userDb } from '../dbs/index.mjs'
import { validationResult } from 'express-validator';
import jwt from "jsonwebtoken"
import { resolve } from 'path';

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

const generateAccessToken = (user) => {
    const userId = user.dataValues.id
    return   jwt.sign({
        id:userId
    },
    "secretKey",
    {
        expiresIn:"120s"
    })
}
const generateRefreshToken = (user) => {
    const userId = user.dataValues.id
    return jwt.sign({
        id: userId
    },
    "secretKey",
    {
        expiresIn:"365d"
    })
}

const login = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }
    try {
        const user = await userDb.findByEmail(req.body.email, 'email')
        generateAccessToken(user) 
        generateRefreshToken(user) 
        res.cookie("refreshToken", generateRefreshToken(user) ,{
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict"
        })
        res.status(200).json({
            status: true,
            msg: 'Đăng nhập thành công',
            accesstoken: generateAccessToken(user) 
        });
        next()
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}
const reqRefreshToken = (req,res,next) => {
    const refreshToken = req.cookies.refreshToken // lay ra token
    if(!refreshToken){
        res.status(401),json("ban chua dang nhap")
    }
    else{
        //create new accesstoken, refresh token
        const newAccessToken = generateAccessToken(user) 
        const newRefreshToken = generateRefreshToken(user) 
        res.cookie("refreshToken", newRefreshToken,{
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict"
        })
        //can push newrefresh vao db
        res.status(200).json({
            accessToken:newAccessToken
        })
    }
}
const home = async(req, res, next) => {
    try {
        if(req.user){
            const user = await userDb.findById(req.user.id, 'id')
            res.json({
                status: true,
                user})
        }
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}
const logOut = async(req, res, next) => {
    try {
        res.clearCookie("refreshToken")
        res.json({
            status: true,
            msg: 'Đăng xuất thành công'
        })
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e)
    }
}

export const userController = {
    register,
    login,
    home, 
    logOut
}