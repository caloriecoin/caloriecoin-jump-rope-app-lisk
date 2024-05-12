const UserModel = require('../Models/UserModel');

//프론트페이지 : 나의정보 보기탭, 초기 설정하는곳
//메소드 :get
const getAUserInfo =  async (req,res) => {
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

//프런트페이지 : 초기 설정하는곳 
//메소드 : put
const UpdateAUserInfo = async (req,res) => {
    try {
       const updatedUser = await UserModel.findByIdAndUpdate(req.params.userid,{
           $set: req.body
       },{new:true}
       );
       const tokenUser = req.user
       res.json({updatedUser,tokenUser});
   } catch (error) {
       res.json(error);
   }
};

module.exports = { 
    UpdateAUserInfo, getAUserInfo 
};
