const { User } = require('../models/User');

let auth = (req, res, next) => {

    //인증처리를 하는 곳


    //클라이언트 쿠키에서 토큰을 가져온다.
    let token = req.cookies.x_auth; 
    console.log(token);

    //토큰을 복호화 한후 유저를 찾는다.
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, err: true})

        req.token = token;
        req.user = user;
        next(); // middleware에 갇히지 않기 위해 사용.
    })
    //유저가 있으면 인증 O

    //유저가 없으면 인증 NO

}


// 다른 곳에서도 사용 가능하게 만들어주는 기능.
module.exports = { auth };