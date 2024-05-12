const mongoose = require("mongoose");

const WalletSchema = new mongoose.Schema({
    user:  {  type:mongoose.Schema.Types.ObjectId, ref: "User"},
    kakaoId : {type:String},
    address : {type:String},
    balance: {type:String},
    privateKey : {type:String}
},
    {timestamps: true}
)

module.exports = mongoose.model('Wallet', WalletSchema);