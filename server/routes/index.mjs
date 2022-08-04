import express from 'express'
import { userController } from '../controllers/index.mjs'
import { adminController } from '../controllers/index.mjs'
import { cartController } from '../controllers/index.mjs'
import { itemsController } from '../controllers/index.mjs'
import { payController } from '../controllers/index.mjs'
import userValidate from '../validates/users.mjs'
import adminValidate from '../validates/admins.mjs'
import tokenValidate from '../validates/tokenValidate.mjs'
const router = express.Router() // create new router

//--------------------user------------------------------------
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

//---------------------- Cart--------------------------------
router.post('/cart/create',
    cartController.createProduct
)
router.post('/cart/save',
    cartController.createProduct
)
router.get('/cart/show',
    tokenValidate.verifyToken,
    cartController.showProducts
)


router.post('/cart/delete',
    cartController.deleteProduct
)
// --------------------------items--------------------------
router.get('/item/showitem/:id',
    tokenValidate.verifyToken,
    itemsController.showItem
)
router.get('/item/show',
    itemsController.showItems
)




//------------------------Pay--------------------------
router.post('/pay/create',
    payController.createOrder
)
router.get('/pay/show',
    tokenValidate.verifyToken,
    payController.showOrders
)

//----------------------------------Admin------------------------------------------------
router.post('/admins/register',
    adminValidate('register'), // run valdiate
    adminController.register
)
router.post('/admins/login',
    adminValidate('login'), // run valdiate
    adminController.login
)
router.get('/admins/showusers',
    tokenValidate.verifyToken,
    userController.showUsers
)
router.get('/admins/infor/:id',
    adminController.getInfor
)

router.get('/admins/showitems',
    tokenValidate.verifyToken,
    itemsController.showItemsToken
)
router.post('/admins/createitem',
    adminValidate('addItem'), // run valdiate
    tokenValidate.verifyToken,
    itemsController.createItem
)


export default router;