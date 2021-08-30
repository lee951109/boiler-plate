const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, //공백을 없애주는 역할을 한다.
        unique: 1   //중복값을 없애기 위해 유니크를 부여
    },
    password: {
        type: String,
        minLength:5
    },
    lastName: {
        type: String,
        maxlength: 50
    },
    role : { // 관리자, 일반을 구분하기 위해 사용
        type: Number,
        default: 0 
    },
    image: String,
    token: {
        type: String
    },
    tokenExp : { // token 유효기간
        type: Number
    }
})

const User = mongoose.model('User', userSchema) // model로 schema를 감싸준다.

module.exports = {User} //다른 곳에서도 사용 가능하게 exports해준다.