// 쫄지말고 관계형마다 일일히 넣어주면 된다 !!!

//Ⅰ.user 파트
// create 함수 create({name,email,password})  등 원하는 속성값 을 지정할수 있음
exports.register = async (req,res) => {
    try {
        const { name, email, password } = req.body;

        let user = await UserModel.findOne({ email });
        if(user) {
            return res.json({
                success: false,
                message: "User already exists"
            });
        }
        user = await UserModel.create({ name, email, password, avatar:{public_id:"sample_id", url:"sampleurl"}});
        res.json({success:true, user})

    } catch (error) {
        res.json({success:false, message: error.message});
    }
}

// 몽구스타입과 ref 형태를 복잡히 생각하지 말고 , 팝퓰레이트 쓰지말고 그냥 각각 불러서 push 처리 
exports.followUser = async (req,res) => {
    try{

        const userToFollow = await User.findById(req.params.id);
        const loggedInUser = await User.findById(req.user._id);

        if(!userToFollow){
            return res.json({message: "유저가 없어요."})
        }

        loggedInUser.following.push(userToFollow._id);
        userToFollow.followers.push(loggedInUser._id);

        await loggedInUser.save();
        await userToFollow.save();


    }catch(error){
        res.json(error);
    }
}



//Ⅱ.post 파트

//01.const newPost = await postMessage.create(newPostData);
// user.posts.push(post._id) => 팝풀레이트 안쓰고 푸쉬를 썼다는것이 재미 , 나도 유저에 넣고 , 배틀에도 넣고 , 유저에 넣고 , 지갑에도 넣는방식을 택하자.
exports.createPost = async (req,res) => {
    try {
        const newPostData = {
            caption : req.body.caption,
            image : {
                public_id:req.body.public_id,
                url:req.body.url
            },
            owner: req.user._id
        }
        const post = await Post.create(newPostData);

        const user = await UserModel.findById(req.user._id);
        user.posts.push(post._id);
        await user.save();

        res.json({
            success:true,
            post,
            user
        });
    } catch (error) {
        res.json({
            success: false,
            message: error
        });
    }
}
//02. post.likes.push(req.user._id) // 배열에 푸쉬할수있다.
exports.likeAndUnlikePost = async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.json({
                success: false,
                message: "Post not found"
            });
        }

        if(post.likes.includes(req.user._id)){
            const index = post.likes.indexOf(req.user._id);
            post.likes.splice(index, 1);

            await post.save();

            return res.json({
                success: true,
                message: "Post unliked"
            });
        }
        else{
            post.likes.push(req.user._id);
            await post.save();

            return res.json({
                success: true,
                message: "Post Liked"
            })
        }
    } catch (error) {
        res.json(error);
    }
}

//03. post.owner.toString() => id 값등은 보통 스트링화 해야함 , await post.remove();
// 자동으로 ref가 되었다고 해서 자동처리 되어지거나 그런거 없음 그냥 유저모델 불러와서 변경시키면됨
exports.deletePost = async (req,res) => {
    try {

        const post = await Post.findById(req.params.id);

        if(!post){
            return res.json({message: "포스트 없음"})
        }

        if(post.owner.toString() !== req.user._id.toString()){
            return res.json({message:"Unauthorized"});
        }

        await post.remove();

        const user = await UserModel.findById(req.user._id);
        const index = user.posts.indexOf(req.params.id);
        user.posts.splice(index,1);
        await user.save();

        res.status.json({message: "포스트 삭제됨"})

    } catch(error) {
        res.json({
            message: error
        })
    }
}

//04. getPostOfFollowing , $in 연산자 활용 
// populate 함수는 해당 _id의 접근권한이라고 보면됨 , 각 모델별로 불러올거면 구태여 populate 안써도됨
//const user = awiat User.findById(req.user._id).populate("following","posts"); 안쓰고도 할수 있음
// 팔로잉한 사람의 포스트만 따로 불러들일수가 있음.
exports.getPostOfFollowing = async (req,res) => {
    try{
        const user = awiat User.findById(req.user._id);

        const posts = await Post.find({
            owner:{
                $in: user.following
            }
        })
        res.json({
            success:true,
            posts
        })
    }catch(error){

    }
}


// find({}) 하면 모든 유저를 찾는다.
exports.getAllUsers = async (req,res) => {
    try {
        const users = await User.find({});

        res.json({
            success: true,
            users
        });
    } catch (error) {
        
    }
}