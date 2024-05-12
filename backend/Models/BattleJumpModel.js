const mongoose = require("mongoose");

//Record기록을 더 만들지 말고 그냥 해당 배틀모델 그사람의 승기록이고 , 무승부기록이고 , 패배기록으로 두자.
const BattleJumpModel = mongoose.Schema({
    //배틀스타트 api => 소켓방의 번호를 101번으로 고정시켜서 api콜 쏴주세요.
    player1:{  type:mongoose.Schema.Types.ObjectId, ref: "User"},
    player2:{  type:mongoose.Schema.Types.ObjectId, ref: "User"},
    player1_kakaoId : {type:String},
    player2_kakaoId : {type:String},
    
    player1_nickname: {type:String},
    player2_nickname: {type:String},
    
    player1_profile :{type:String},
    player2_profile :{type:String},

    //배틀저지 api
    player1_jumps: {  type:Number ,default:0},
    player2_jumps: {type:Number, default:0},
    winner : {  type:mongoose.Schema.Types.ObjectId, ref: "User" },
    looser : {  type:mongoose.Schema.Types.ObjectId, ref: "User" },
    drawers : [ {  type:mongoose.Schema.Types.ObjectId, ref: "User", default:"승패가 갈린 경기"} ]
},
    {timestamps: true}
)

module.exports = mongoose.model('BattleJumps',BattleJumpModel);
