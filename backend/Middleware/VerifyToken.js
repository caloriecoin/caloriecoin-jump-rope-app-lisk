const jwt = require("jsonwebtoken");

const verifyToken = (req,res,next)=>{
    const authHeader = req.headers.token;
    if(authHeader){
        const token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.JWT_SEC, (err,user)=>{
            if(err) res.json("토큰이 이상함")
            req.user = user;
            console.log(req.user);
            next();
        });
    }else{
        res.json("토큰 없음 로그인 해서 토큰 가져와요");
    }
}

const verifyTokenUserAuth = (req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.id === req.params.userId || req.user.isAdmin){
            console.log(req.user);
            next();
        }else{
            res.json("본인이 아니니다.")
        }
    })
}

const verifyTokenAdmin = (req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.isAdmin){
            console.log(req.user);
            next();
        }else{
            res.json("운영자가 아닙니다.")
        }
    })
}

module.exports = { verifyToken, verifyTokenUserAuth, verifyTokenAdmin }