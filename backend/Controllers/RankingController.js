const UserModel = require('../Models/UserModel');

// it works
exports.getMinningJumpersRanking = async (req,res) => {
    try {
     const users = await UserModel
     .find()
     .select("profile nickname mined_caloriecoins_total jumps_total")
     .sort({"mined_caloriecoins_total":-1})
     
     res.json(users);
 } catch (error) {
        res.json({
            controller:getMinningJumpersRanking,
            success: false,
            message: error
        })
    }
 }



 //it works
exports.getBattleJumpersRanking = async (req,res) => {
    try {
     const users = await UserModel
     .find()
     .select("profile nickname battle_rating win_battles draw_battles loose_battles")
     .sort({"battle_rating":+1})     
     res.json(users);
 } catch (error) {
        res.json({
            controller: "getBattleJumpersRanking",
            success: false,
            message: error
        })
    }
}

