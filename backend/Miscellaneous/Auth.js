const router = require('express').Router();
const UserModel = require('../Models/UserModel');

//카카오 회원가입기능 
router.post('/register', async (req,res)=>{
    console.log(req.body);
    const newUser = new UserModel({
        kakaoId: req.body.kakaoId,
        profile : req.body.profile,
        avartar : req.body.kakaoId,
        nickname: req.body.nickname,
        gender: req.body.gender,
        height: req.body.height,
        weight: req.body.weight,
    });

    //유저단 Wallet 어드레스 정보 넣기

    //지갑단 자체에서 어드레스 정보 넣기

    try{
        const savedUser = await newUser.save();
        console.log(savedUser);
        res.json(savedUser);
    }catch(err){
        res.send(err);
    }
});

module.exports = router;