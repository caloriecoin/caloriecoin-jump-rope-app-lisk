const UserModel = require('../Models/UserModel');
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const registerKakaoUser = async (req,res)=>{
    console.log(req.body);
    const newUser = new UserModel({
        kakaoId: req.body.kakaoId,
        nickname: req.body.nickname,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
        gender: req.body.gender,
        height: req.body.height,
        weight: req.body.weight,
        isAdmin : req.body.isAdmin
    });
    try{
        const savedUser = await newUser.save();
        console.log(savedUser);
        res.json(savedUser);
    }catch(err){
        res.send(err);
    }
}
const login = async (req,res)=>{
    try {
        console.log(req.body);
        //01. 디비에서 유저하나를 찾는다.
        const user = await UserModel.findOne({kakaoId:req.body.kakaoId});
        !user && res.send("유저가 없어요")

        //02. 유저가 있으면 비밀번호를 비교한다. / 카카오 로그인 시에는 비번 없이 토큰준다.
        const decryptedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC)
        const Originalpassword = decryptedPassword.toString(CryptoJS.enc.Utf8);
        Originalpassword !== req.body.password && res.send("비번 틀림");
        
        //03.비번까지 맞으면 엑세스토큰생성
        const accessToken = jwt.sign(
         {
            id: user._id,
            kakaoId:user.kakaoId,
            nickname: user.nickname,
            isAdmin: user.isAdmin
         },
         process.env.JWT_SEC,
         {expiresIn:"3d"}
        );

        const { password,...others } = user._doc
        res.json({others,accessToken});
    } catch (error) {
        res.json(error);
    }
}

module.exports = { 
    registerKakaoUser ,login
};

/*

//프론트페이지 : 로그인(제일 처음 카카오로 가입할때)
//메소드 : post
const RegisterAkakaoUser =  async (req,res) => {
    //▷step1.카카오에서 프론트로 유저정보를 분명히 줄것이다.

    //▷step2.프론트 카카오유저정보 req.user 혹은 req.body로 획득
    const { kakaoId,profile,wallet_account } = req.body;
    
    //▷step3.카카오유저정보 디비저장

    //▷step4.유저정보 응답
    res.json({user});
};

//프론트페이지: 로그인
//메소드 : 겟
const loginUser = (req,res) => {
    // 로그인 토큰을 지급한다.
};
*/