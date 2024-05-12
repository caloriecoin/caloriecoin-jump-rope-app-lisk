const router = require('express').Router();

const {
    createOneUserOneMinningJump,
    getOneUserMinningJumps,
} 
= require('../Controllers/MinningJumpController');

router.route('/createOneUserOneMinningJump/:kakaoId').post(createOneUserOneMinningJump);

router.route('/getOneUserMinningJumps/:kakaoId').get(getOneUserMinningJumps);


module.exports = router;
