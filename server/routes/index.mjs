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
router.post('/users/logout',
    tokenValidate.verifyToken, 
    userController.logOut
)

router.get('/users/home',
    tokenValidate.verifyToken,
    userController.home
)

router.get('/users/infor',
    tokenValidate.verifyToken,
    userController.getInfor
)

router.post('/users/updateinfor',
    tokenValidate.verifyToken,
    userValidate('update'), // run valdiate
    userController.updateInfor
)

export default router;