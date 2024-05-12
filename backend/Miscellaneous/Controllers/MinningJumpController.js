const MinningJumpModel = require('../Models/MinningJumpModel');

//프런트페이지 : 마이닝 하는곳 
//메소드 : post
const postAMinningJump = async (req,res) => {
    const newMinningJump = new MinningJumpModel({
        user: req.user.id,
        jump_counts: req.body.jump_counts,
        minned_caloriecoins:req.body.minned_caloriecoins,
        endtime: req.body.endtime,
        duration_time: req.body.duration_time,
        kcalorie: req.body.kcalorie,
    });
    try{
        const savednewMinningJump = await newMinningJump.save();
        res.json(savednewMinningJump);
    }catch(err){
        res.send(err);
    }
};

//프론트페이지 : , 초기 설정하는곳
//메소드 :get
const getUserMinnings =  async (req,res) => {
    try {
        //▷step02. 디비에서 한사람에 대한 유저정보(아이디,닉네임,프로필) 찾는다.
        const user = await UserModel.findById(req.params.userid);
        console.log(user)
        //▷step03. 유저정보(아이디,닉네임,프로필) 응답
        const tokenUser = req.user
        res.json(user);
    } catch (error) {
        res.json(error);
    }
};



module.exports = { 
    postAMinningJump,
    getUserMinnings 
};
