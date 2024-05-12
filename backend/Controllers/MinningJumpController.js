const UserModel = require('../Models/UserModel');
const MinningJumpModel = require('../Models/MinningJumpModel');

//it works
exports.createOneUserOneMinningJump = async (req,res) => {
    try {

        //00.카카오아이디로 유저아이디를 먼저 찾는다. => clear
        const user = await UserModel.findOne({kakaoId:req.params.kakaoId})

        //01. 마이닝점프를 먼저 만든다.      => clear
        const minningJump = await MinningJumpModel.create({
            user : user._id.toString(),
            kakaoId : req.params.kakaoId,
            jumps : req.body.jumps, 
            mined_caloriecoins : req.body.mined_caloriecoins,
            endtime: req.body.endtime,
            duration_time : req.body.duration_time,
            burned_kcalories :req.body.burned_kcalories
        })

        console.log(minningJump._id.toString());
        //02. 유저내부에 마이닝점프를 푸쉬한다.
        await user.update(
            {$push: {'MinningJumps':minningJump._id.toString()}}
        );
        await user.update(
            {$inc : {'jumps_total':req.body.jumps }}
        );
        await user.update(
            {$inc: {'mined_caloriecoins_total':req.body.mined_caloriecoins}}
        );
        await user.update(
            {$inc: {'burned_kcalories_total':req.body.burned_kcalories}}
        );
        await user.update(
            {$inc: {'duration_time_total':req.body.duration_time}}
        );
        
        const updateUser = await UserModel.findOne({kakaoId:req.params.kakaoId})

        res.json(updateUser);

    } catch (error) {
        res.json({
            controller :"createOneUserOneMinningJump",
            success: false,
            message: error
        })
    }
}
//it works 
exports.getOneUserMinningJumps = async (req,res) => {
    try {
        const userMinningJumps = await UserModel.findOne({kakaoId:req.params.kakaoId});
        await userMinningJumps.populate("MinningJumps")
      
        res.json(userMinningJumps.MinningJumps);

    } catch (error) {
        res.json({
            controller:"getOneUserMinningJumps",
            success: false,
            message: error
        })
    }
}




