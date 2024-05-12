const mongoose = require("mongoose");

const QuestModel = mongoose.Schema({
    quest_whoes: { type:mongoose.Schema.Types.ObjectId, ref: "User"},
    quests : 
        //줄넘기 1회 돌리기 하나만 resp api 구현해주시면 나머지는 제가 알아서 할게요. 
        //이거 카일 쿼리 예제 web심플리파이에서 내부에 또 스키마 둘수 있는 예제 기반으로 짜기
        [
            //MinningJump API를 기반으로 찾으면 될듯합니다.
            { quest_num:0, quest_name:"줄넘기1회 돌리기",quest_opened:"false", quest_open_time: "",nft_num:"" },    
            { quest_num:1, quest_name:"줄넘기100회 돌리기",quest_opened:"false", quest_open_time: "",nft_num:"" }, 
            { quest_num:2, quest_name:"줄넘기1000회 돌리기",quest_opened:"false", quest_open_time: "",nft_num:"" },

            //Battle API를 기반으로 찾으면 될듯합니다.    
            { quest_num:3, quest_name:"승리1회",quest_opened:"false", quest_open_time: "",nft_num:"" },
            { quest_num:4, quest_name:"승리10회",quest_opened:"false", quest_open_time: "",nft_num:"" }, 
            { quest_num:5, quest_name:"승리100회",quest_opened:"false", quest_open_time: "",nft_num:"" },
            
            //User에 출석 입장일 데이터를 추가, 이것은 나중에 API를 기반으로 찾으면 될듯합니다.
            { quest_num:6, quest_name:"출석1일",quest_opened:"false", quest_open_time: "",nft_num:"" },
            { quest_num:7, quest_name:"출석3일연속",quest_opened:"false", quest_open_time: "",nft_num:"" }, 
            { quest_num:8, quest_name:"출석7일연속",quest_opened:"false", quest_open_time: "",nft_num:"" }
        ]
    },
    {timestamps: true}
)

const QuestModel = mongoose.model(Quests, QuestModel);