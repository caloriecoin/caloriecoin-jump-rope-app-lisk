//01.몽고디비 연결
const express = require('express');
const app = express();
const cors = require("cors");
require('dotenv').config();
require('./Config/db')();


app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(cors());

//02.restful api 라우터 설정
const UserRouter = require("./Routers/UserRouter");
const MinningJumpRouter = require("./Routers/MinningJumpRouter");
const BattleJumpRouter = require("./Routers/BattleJumpRouter");
const WalletRouter = require("./Routers/WalletRouter");
const RankingRouter = require("./Routers/RankingRouter")

app.use('/api/user', UserRouter); 
app.use('/api/minningJump', MinningJumpRouter);
app.use('/api/battleJump', BattleJumpRouter); 
app.use('/api/wallet', WalletRouter); 
app.use('/api/ranking',RankingRouter)
 
app.get('/',(req,res)=>{
    res.send("헤로쿠에 서버API 디플로이 됨 2022년02월19일 오후 11시 25분 By BAEK 대표!");
})


//03.socket.io (줄넘기 배틀용) 따로 만듬
const socketServer = require('http').createServer(app);
const io = require('socket.io')(socketServer,{
    cors:{
        origin:'*',
        methods:["GET","POST"]
    }
});

const players = [];
const player1  ="";
const player2 ="";
const player1Jumps = [] ;
const player2Jumps = [] ;
const player1LastJumpCount =0;
const player2LastJumpCount =0;
const winner="";
const drawer = [];
const looser="";

io.on('connection', socket =>{
    console.log('connection made successfully');

    socket.on('enterBattleRoom',(kakaoId)=>{
        //B. 방이 꽉차서 못들어가게 해주세요.
        
        if(players.length==2){
            socket.emit('gameStart',{msg: "게임중"})
        }
        else if(players.length>2){
            socket.emit('overRoom',(msg)=>{
                msg : "방이 꽉찼어요. 입장불가"
            })
            return socket.emit('disconnect');
        }else {
            players.push(kakaoId);
            console.log(players);
        }

        //C.배틀방에 들어온 순서대로 카카오 아이디값을 배열에 두고 먼저 들어온 순서대로 1p, 2p를 잡음

        if(players[0]==kakaoId){
            player1 = kakaoId
            socket.emit('youPlayer1',{msg:"당신은 1번 플레이어 입니다."})
        }else{
            player2 = kakaoId
            socket.emit('youPlayer2',{msg:"당신은 2번 플레이어 입니다."})
        }
    })

    // 유저의 줄넘기 데이터 받음
    socket.on('userJump',jumps => {
        // 내 소켓 줄넘기는 안받음, 다른사람 줄넘기 정보만 받음
        socket.broadcast.emit('otherUserJump',jumps)
        
        //만약에 플레이어1 이면 플레이어1 점프스에 기록 넣는다.
        if(jumps.player == player1){
            player1Jumps.push(jumps) ;
            player1LastJumpCount =jumps.jumps
        }else{
        //만약에 플레이어2 이면 플레이어2 점프스에 기록 넣는다.
        player2Jumps.push(jumps) ;
        player2LastJumpCount =jumps.jumps
        }
        
        console.log(jumps);
    })


    socket.on("gameOver",()=>{
        
        if(player1LastJumpCount>player2LastJumpCount){
            winner = player1;
            looser = player2;
        }else if(player1LastJumpCount==player2LastJumpCount){
            drawer = [player1,player2]
        }else{
            winner = player2
            looser = player1
        }

        //해당 데이터 모두 디비로 포스트함 ??????

        //소켓들을 강제로 접속을 끊고 방에서 나가게한다. ??????


        //서버의 배열을 다시 깨끗히 비워주세요.
        players = [];
        player1 ="" ;
        player2 ="" ;
        player1Jumps = [] ;
        player2Jumps = [] ;
        player1LastJumpCount ;
        player2LastJumpCount ;
        winner;
        drawer = [];
        looser;
    })

    socket.on("disconnect", () => {
        console.log("User disconnected", kakaoId);
        players.pop(kakaoId);
        console.log(players);
    })
});

//04. 소켓서버랑 중앙서버 둘다 실행
app.listen( process.env.PORT,console.log(`칼로리코인(런메이트) 중앙서버작동 => by ${process.env.NODE_ENV} , http:localhost:${process.env.PORT}`));
socketServer.listen(process.env.SOCKET_PORT, ()=> console.log('줄넘기 배틀 전용 소켓 서버 실행중'));

