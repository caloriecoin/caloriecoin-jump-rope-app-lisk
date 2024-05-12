const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
        kakaoId: { type: String, required: true, unique:true ,immutable:true},
        isAdmin:{type: Boolean, default:false},
        profile:{type: String, default:"카카오프로필주소"},
        avartar: {type: String},
        gender : {type: String},
        nickname:{type: String},//카카오닉네임
        birthday: {type: String},
        height: {type: Number},
        weight: {type: Number},
        
        //▶Wallet 관련
        Wallet : { type:mongoose.Schema.Types.ObjectId, ref: "Wallet"},
       
        //▶MinningJump 관련
        MinningJumps: [{ type:mongoose.Schema.Types.ObjectId, ref: "MinningJumps"}],
        jumps_total : {type:Number,default:0},
        mined_caloriecoins_total: {type:Number,default:0},
        burned_kcalories_total: {type:Number,default:0},
        duration_time_total: {type:Number,default:0},

        //▶BattleJump 관련
        BattleJumps: [{ type:mongoose.Schema.Types.ObjectId, ref: "BattleJumps"}],
        battle_rating : { type: Number ,default:0}, 
        win_battles:{type:Number,default:0},
        draw_battles:{type:Number,default:0},
        loose_battles:{type:Number,default:0},
        
    },
    {timestamps: true}
)

module.exports = mongoose.model('Users', UserSchema);
