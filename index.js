// back-end의 시작점
const express = require('express') //express 모듈을 가져온다.
const app = express()
const port = 5000 

const config = require('./config/key');

const { User } = require('./models/User');

//post 요청시 body 데이터값을 읽을 수 있는 구문으로 파싱해준다.
//application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));
//application/json
app.use(express.json());


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


app.post('/register', (req, res) => {
  //회원가입 할때 필요한 정보들을 client에서 가져오면 
  // 그것들을 DB에 넣어준다.

  const user = new User(req.body);

  user.save((err, doc) => {
    if(err) return res.json({ success: false, err})
    return res.status(200).json({ success: true }) //status가 200이면 성공
  })


})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})