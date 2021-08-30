// back-end의 시작점
const express = require('express') //express 모듈을 가져온다.
const app = express()
const port = 5000 

//mongodb 연결
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://jihyun:4858496z@boilerplate.bc8rq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true, 
    // useUnifiedTopology: true, 
    // useCreateIndex: true, 
    // useFindAndModify: false,
    // 위에 주석들이 왜 안가져와지는지 찾아보기.asdasd
}).then(() => console.log('MongoDB Connected...')).catch(
    err => console.log(err))



app.get('/', (req, res) => {
  res.send('Hello World! ~~ Hi~')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})