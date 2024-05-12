const router = require('express').Router();

const {
    getBattleJumpersRanking,
    getMinningJumpersRanking
} = require("../Controllers/RankingController");

router.route('/minningJump').get(getMinningJumpersRanking);
router.route('/battleJump').get(getBattleJumpersRanking);



module.exports = router;
