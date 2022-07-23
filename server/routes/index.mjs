import express from 'express'
import { userController } from '../controllers/index.mjs'
import userValidate from '../validates/users.mjs'
const router = express.Router() // create new router

// create user
router.post('/users/register',
    userValidate('register'), // run valdiate
    userController.register
)
router.post('/users/login',
    userValidate('login'), // run valdiate
    userController.login
)

// get all users
// router.get('/users',
//     userController.getList
// )


export default router;