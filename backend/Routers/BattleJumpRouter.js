const router = require('express').Router();
const { 
    createBattleJumpOnStart,
    judgeBattleJumpOnEnd,
    getOneUserBattleJumps,
} = require('../Controllers/BattleJumpController');

router.route('/createBattleJumpOnStart/:player1/:player2').post(createBattleJumpOnStart);

router.route('/judgeBattleJumpOnEnd/:BattleJumpId').put(judgeBattleJumpOnEnd);

router.route('/getOneUserBattleJumps/:kakaoId').get(getOneUserBattleJumps);



module.exports = router;
