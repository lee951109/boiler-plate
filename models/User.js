const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

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

//mongoose메소드? 인데 ()안에있는 save를 하기전에 무엇을 먼저 한다는 뜻.
userSchema.pre('save', function( next ){
    var user = this; //위에 있는 userSchema를 가르킨다.
    
    if(user.isModified('password')){ //비밀번호에 변화가 있다면
        //비밀번호 암호화.
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err);

            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err);

                user.password = hash;
                next()
            })
        })
    }else{
        next();
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb){
    //plainPassword 951109  암호화된 비밀번호 $2b$10$pETxdK.i4hYiMtuhqQwCaemHJSlO95hn3x5zmfQ0.jzczyPdBwWqO
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch)
    })
}

userSchema.methods.makeToken = function(cb){
    var user = this;
    //jsonwebtoken을 이용해서 token 생성하기.
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    /*user.Id + 'secretToken' = token
      ->
    'secretToken' -> user._id
    */ 

    user.token = token;
    user.save(function(err, user){
        if(err) return cb(err);
        cb(null, user) // err가 없다면 user정보만 전달
    })
}

const User = mongoose.model('User', userSchema) // model로 schema를 감싸준다.

module.exports = {User} //다른 곳에서도 사용 가능하게 exports해준다.