// dev server와 prod server를 나눠주기 위함.
if(process.env.NODE_ENV === 'production') {
    module.exports =require('./prod');
}else{
    module.exports =require('./dev');
}