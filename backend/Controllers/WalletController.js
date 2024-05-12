const UserModel = require('../Models/UserModel');
const WalletModel = require('../Models/WalletModel');

// it works ! 
exports.getOneUserWallet =async (req,res)=>{
   try {
    const user = await UserModel.findOne({
        kakaoId :req.params.kakaoId
    })
    .populate("Wallet");

    res.json(user.Wallet);
   } catch (error) {
        res.json({
            controller: "getOneUserWallet",
            success: false,
            message: error
        })
   }
}

