// back-end의 시작점
const express = require('express') //express 모듈을 가져온다.
const app = express()
const port = 5000 
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth');

const { User } = require('./models/User');



//post 요청시 body 데이터값을 읽을 수 있는 구문으로 파싱해준다.
//application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));
//application/json
app.use(express.json());
app.use(cookieParser());

//mongodb 연결
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, 
    // useUnifiedTopology: true, 
    // useCreateIndex: true, 
    // useFindAndModify: false,
    //  Mongoose 6.0부터는 위의 옵션을 굳이 안적어도 알아서 적용이 된다. 그러므로 없어도 되는 코드
}).then(() => console.log('MongoDB Connected...')).catch(
    err => console.log(err))



app.get('/', (req, res) => {
  res.send('Hello World! ~~ H')
})


app.post('/api/users/register', (req, res) => {
  //회원가입 할때 필요한 정보들을 client에서 가져오면 
  // 그것들을 DB에 넣어준다.

  const user = new User(req.body);

  user.save((err, doc) => {
    if(err) return res.json({ success: false, err})
    return res.status(200).json({ success: true }) //status가 200이면 성공
  })
})

app.post('/api/users/login', (req, res) => {
  //요청된 이메일을 DB에서 찾는다.
  //몽고 db에서 지원하는 메소드
  User.findOne({ email: req.body.email }, (err, user) =>{
    if(!user){
      return res.json({
        loginSuccess : false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }

    //요청된 이메일이 DB에 있다면 비밀번호가 맞는 비밀번호인지 체크
    user.comparePassword( req.body.password, (err, isMatch ) => {
      if(!isMatch) return res.json({ loginSuccess : false, message: "비밀번호가 틀렸습니다."})

      // 비밀번호가 맞다면 token 생성
      user.makeToken((err, user) => {
        if(err) return res.status(400).send(err);
        
        //토큰을 저장
        res.cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess : true, userId : user.id })

      })
    })
  })
})


// role = 0 user role != 0 admin
app.get('/api/users/auth', auth, (req, res) =>{

  //여기까지 middleware를 통과해 왔다는 얘기는 Authentication이 true라는 말.
  res.status(200).json({
    // _id로 가져올 수 있는 이유는 MongoDB에 id가 _id로 되어있기 때문. 
    _id : req.user._id, 
    isAdmin : req.user.role === 0 ? false : true,
    isAuth : true,
    email : req.user.email,
    name : req.user.name,
    lastName : req.user.lastName,
    role : req.user.role,
    image : req.user.image,
  })
})

app.get('/api/users/logout', auth, (req, res) =>{
  User.findOneAndUpdate({ _id : req.user._id }, 
    { token : "" }, (err, user) => {
      if(err) return res.json({ success: false, err });
      return res.status(200).send({ success : true })
    })
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})