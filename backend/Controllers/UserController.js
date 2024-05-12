const UserModel = require('../Models/UserModel');
const WalletModel = require('../Models/WalletModel');


//it works!
exports.registerUserAndWallet =async (req,res)=>{
    try{

    //01.유저를 먼저 만든다.  it works
    const newUser = await UserModel.create({
        kakaoId: req.body.kakaoId,
        profile : req.body.profile,
        avartar : req.body.avartar,
        nickname: req.body.nickname,
        gender: req.body.gender,
        height: req.body.height,
        weight: req.body.weight,
    });

    //02. 지갑을 만들고 주인을 지정한다. it works
    const newWallet = await WalletModel.create({
        user : newUser._id.toString(),
        kakaoId : newUser.kakaoId,
        address : req.body.address, //참조값
        balance : req.body.balance, //참조값
        privateKey : req.body.privateKey
    });

    //03. 유저에게 지갑 월렛 주소를 준다. => it works
    const updateUser = await UserModel.findOneAndUpdate({kakaoId:req.body.kakaoId},{
        Wallet : newWallet._id.toString()
    })

    //04. 결과값을 확인해 보자. it works

    const user = await UserModel.findOne({
        kakaoId : req.body.kakaoId
    })

    const wallet = await WalletModel.findOne({
        kakaoId : req.body.kakaoId
    })

    res.json({user,wallet});
    
    }catch(error){
        res.json({
            controller:"registerUserAndWallet",
            success : false,
            message: error
        });
    }
}
//it works!
exports.getUserAndWallet = async (req,res) => {
    try {
        const user = await UserModel.findOne({
            kakaoId :req.params.kakaoId
        })
    
        const userWallet = await WalletModel.findOne({
            _id : user.Wallet
        })
        
        res.json({user,userWallet});

    } catch (error) {
        res.json({
            controller :"getUserAndWallet",
            success: false,
            message: error
        })
    }
}
//it works!
exports.putUser = async (req,res) => {
    try {
        await UserModel.findOneAndUpdate({
            kakaoId :req.params.kakaoId
        },
         {
             nickname : req.body.nickname,
             birthday: req.body.birthday,
             height: req.body.height,
             weight: req.body.weight,
             gender : req.body.gender,
             avartar : req.body.avartar
         }
        )

        const puttedUser = await UserModel.findOne({
            kakaoId :req.params.kakaoId
        })
        
        res.json(puttedUser);
    } catch (error) {
        res.json({
            controller :"putUser",
            success: false,
            message: error
        });
    }
}

exports.getAllUser = async (req,res) =>{
    try {
        const Alluser = await UserModel.find().populate("Wallet")
        res.json(Alluser);

    } catch (error) {
        res.json({
            controller: "getAllUser",
            success : false,
            message: error
        })
    }
}