const mongoose = require("mongoose");

const TransactionModel = mongoose.Schema({
    block: { type: String},
    from: {  type:mongoose.Schema.Types.ObjectId, ref: "User"},
    to: {  type:mongoose.Schema.Types.ObjectId, ref: "User"},
    amount_caloriecoin: {   type:Number },
    is_get_caloriecoin : { type:Boolean, default:"null"},
    is_sending_caloriecoin : { type:Boolean, default:"null"},
    transaction_type: { type:String, default:"kip7"},    // kip7 인지 , kip17 인지 ,kip37 인지 NFT를 FT로 구매하는경우는 어떻게 표현????
    
},
    {timestamps: true}
)

const TransactionModel = mongoose.model(Transactions, TransactionModel);