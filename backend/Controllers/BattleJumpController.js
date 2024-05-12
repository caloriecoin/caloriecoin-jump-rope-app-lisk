const UserModel = require('../Models/UserModel');
const BattleJumpModel = require('../Models/BattleJumpModel');

// it works
exports.createBattleJumpOnStart = async (req,res) =>{
    try {
        const player1 = await UserModel.findOne({
            kakaoId : req.params.player1
        })
        const player2 = await UserModel.findOne({
            kakaoId : req.params.player2
        })
         
        const battleJump = await BattleJumpModel.create({
            player1: player1._id.toString(),
            player2: player2._id.toString(),

            player1_kakaoId: player1.kakaoId,
            player2_kakaoId: player2.kakaoId,

            player1_nickname: player1.kakaoId,
            player2_nickname: player2.kakaoId,

            player1_profile: player1.profile,
            player2_profile: player2.profile
        })
        // 유저모델 푸쉬
        await player1.update(
            {$push: {'BattleJumps':battleJump._id.toString()}}
        );
        await player2.update(
            {$push: {'BattleJumps':battleJump._id.toString()}}
        );

        //디비에는 업데이트되었으나 응답 JSON에는 반영이 안되어있어서
    
        const player1Data = await UserModel.findOne({
            kakaoId : req.params.player1
        })
        const player2Data = await UserModel.findOne({
            kakaoId : req.params.player2
        })
    
        res.json({battleJump,player1Data,player2Data})   
    } catch (error) {
        res.json({
            controller :"createBattleJumpOnStart",
            success: false,
            message: error
        })
    }
}

exports.judgeBattleJumpOnEnd = async (req,res) => {
    try {
        const battleJump = await BattleJumpModel.findById(req.params.BattleJumpId);

        const player1 = await UserModel.findById(battleJump.player1);
        const player2 = await UserModel.findById(battleJump.player2);
        
        
        await battleJump.update(
            {$set: {'player1_jumps': req.body.player1_jumps}}
        );
        await battleJump.update(
            {$set: {'player2_jumps': req.body.player2_jumps}}
        );

        
        //승부처리
        if(req.body.player1_jumps > req.body.player2_jumps){
            //01.배틀점프모델단
            await battleJump.update(
                {$set:{'winner':battleJump.player1}}
            );
            await battleJump.update(
                {$set:{'looser':battleJump.player2}}
            );
            //02.유저모델단
            await player1.update({$inc:{'battle_rating':10}});
            await player1.update({$inc:{'win_battles':1}});
            await player2.update({$inc:{'battle_rating':-5}});
            await player2.update({$inc:{'loose_battles':1}});
    
        }else if(req.body.player1_jumps < req.body.player2_jumps){
            //01.배틀점프모델단
            await battleJump.update(
                {$set:{'winner':battleJump.player2}}
            );
            await battleJump.update(
                {$set:{'looser':battleJump.player1}}
            );
            //02.유저모델단
            await player2.update({$inc:{'battle_rating':10}});
            await player2.update({$inc:{'win_battles':1}});
            await player1.update({$inc:{'battle_rating':-5}});
            await player1.update({$inc:{'loose_battles':1}});
        }else{
            //01.배틀점프모델단
            await battleJump.update(
                {$push:{'drawers':battleJump.player1}}
            );
            await battleJump.update(
                {$push:{'drawers':battleJump.player2}}
            );
            //02.유저모델단
            await player1.update({$inc:{'battle_rating':5}});
            await player1.update({$inc:{'draw_battles':1}});
            await player2.update({$inc:{'battle_rating':5}});
            await player2.update({$inc:{'draw_battles':1}});
        }
        
        
        const battleJumpData = await BattleJumpModel.findById(req.params.BattleJumpId);
        const player1Data = await UserModel.findById(battleJump.player1);
        const player2Data = await UserModel.findById(battleJump.player2);

        res.json({battleJumpData,player1Data,player2Data});
    } catch (error) {
        res.json({
            controller :"judgeBattleJumpOnEnd",
            success: false,
            message: error
        })
    }
}

//it works
exports.getOneUserBattleJumps = async (req,res) =>{
    try {
        await UserModel.findOne({kakaoId : req.params.kakaoId})
        .populate("BattleJumps")
        .select("BattleJumps")
        .exec()
        .then(jumps => {
            res.json(jumps)
        })
        /* 2번 방식
        const userBattleJumps = await UserModel.findOne({kakaoId : req.params.kakaoId})
        .populate("BattleJumps")
        .select("BattleJumps");

        res.json(userBattleJumps.BattleJumps)
        */  
    } catch (error) {
        res.json({
            controller : "getOneUserBattleJumps",
            success: false,
            message: error
        })
    }
}

