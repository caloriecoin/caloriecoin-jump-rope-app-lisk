const router = require('express').Router();

const { getOneUserWallet } = require('../Controllers/WalletController');

router.route('/getOneUserWallet/:kakaoId').get(getOneUserWallet);


module.exports = router;