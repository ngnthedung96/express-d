import express from 'express'
import { userController } from '../controllers/index.mjs'
import userValidate from '../validates/users.mjs'
import tokenValidate from '../validates/tokenValidate.mjs'
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
// router.post('/refreshToken',
//     tokenValidate.verifyToken, // run valdiate
// )
router.post('/logout',
    tokenValidate.verifyToken, 
    userController.logOut
)

router.get('/users/home',
    tokenValidate.verifyToken,
    userController.home
)


export default router;