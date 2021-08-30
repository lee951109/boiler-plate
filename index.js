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
    //  Mongoose 6.0부터는 위의 옵션을 굳이 안적어도 알아서 적용이 된다. 그러므로 없어도 되는 코드
}).then(() => console.log('MongoDB Connected...')).catch(
    err => console.log(err))



app.get('/', (req, res) => {
  res.send('Hello World! ~~ Hi~')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})