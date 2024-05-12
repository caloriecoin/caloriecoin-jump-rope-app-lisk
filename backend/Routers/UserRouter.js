const router = require('express').Router();

const { 
    registerUserAndWallet, 
    getUserAndWallet, 
    putUser,
    getAllUser 
} = require('../Controllers/UserController');

router.route('/registerUserAndWallet').post(registerUserAndWallet);

router.route('/getUserAndWallet/:kakaoId')
.get(getUserAndWallet);

router.route('/putUser/:kakaoId').put(putUser);

router.route('/getAllUser').get(getAllUser);

module.exports = router;