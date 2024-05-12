const mongoose = require("mongoose");

const MinningJumpSchema = mongoose.Schema({
    user:  { type:mongoose.Schema.Types.ObjectId, ref: "Users",require:true},
    kakaoId : {type:String},
    jumps:  { type:Number},
    mined_caloriecoins : { type:Number},
    endtime: { type:String},
    duration_time : { type:Number },
    burned_kcalories : { type:Number}
},
    {timestamps: true}
)

module.exports = mongoose.model('MinningJumps',MinningJumpSchema);

