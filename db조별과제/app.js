const fs = require('fs');
const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const crypto = require('crypto');
const FileStore = require('session-file-store')(session); // 세션을 파일에 저장
const cookieParser = require('cookie-parser');
const { query } = require('express');

// express 설정 1
const app = express();

// db 연결 2
const client = mysql.createConnection({
    user : 'root',
    password : '9634',
    database : 'team'
});
// 정적 파일 설정 (미들웨어) 3
app.use(express.static(path.join(__dirname,'/public')));

// ejs 설정 4
app.set('views', __dirname + '\\views');
app.set('view engine','ejs');

// 정제 (미들웨어) 5
app.use(bodyParser.urlencoded({extended:false}));

// 세션 (미들웨어) 6
app.use(session({
    secret: 'blackzat', // 데이터를 암호화 하기 위해 필요한 옵션
    resave: false, // 요청이 왔을때 세션을 수정하지 않더라도 다시 저장소에 저장되도록
    saveUninitialized: true, // 세션이 필요하면 세션을 실행시칸다(서버에 부담을 줄이기 위해)
    store : new FileStore() // 세션이 데이터를 저장하는 곳
}));

app.get('/',(req,res)=>{
    console.log('메인페이지 작동');
    console.log(req.session);
    const body = req.body;
    
        if(req.session.is_logined == true){
            
            console.log("재접속")
            client.query('select * from login_session',(err ,data)=>{
                client.query("select * from bulletin  ",(err, rows) => {
                    res.render('index',{
                        is_logined : data[0].is_logined,
                        name : data[0].login_name,
                        list : rows 
                    });   
                });
            });
            
        }else{
            client.query("select * from bulletin",(err, rows) => {
                res.render('index',{
                    is_logined : false,
                    list : rows
                });
            });    
        }
    
    
});

// 회원가입
app.get('/register',(req,res)=>{
    console.log('회원가입 페이지');
    res.render('register');
});

app.post('/register',(req,res)=>{
    console.log('회원가입 하는중')
    const body = req.body;
    const id = body.user_id;
    const pw = body.pw;
    const name = body.name;
    const nickname = body.nickname;
    const tel =  body.tel;
    const place = body.place;
    const email = body.email;
    const sex = body.sex;
    const birth = body.birth

    client.query('select * from user where user_id=?',[id],(err,data)=>{
        
        console.log(err)
        console.log(data)

        if(data.length == [0]){
            console.log('회원가입 성공');
            client.query('insert into user(user_id, pw, name, nickname, tel, place, email , sex, birth, register_date) values(?,?,?,?,?,?,?,?,?,now())',[
                id, name, pw, nickname, tel, place, email, sex, birth  
            ]);
            res.redirect('/');
        }else{
            res.send('<script>alert("회원가입 실패");</script>')
            res.redirect('/login');
        }
    });
});

// 로그인
app.get('/login',(req,res)=>{
    console.log('로그인 작동');
    res.render('login');
});

app.post('/login',(req,res)=>{
    const body = req.body;
    const id = body.user_id;
    const pw = body.pw;
    const name = body.nickname;
    
    client.query('select * from user where user_id=?',[id],(err, data)=>{
        client.query('select * from bulletin',(err, rows) =>{

            console.log(rows);
            // 로그인 확인
            console.log('아이디 비교 : ', id == data[0].user_id);
            console.log('비밀번호 비교 : ', pw == data[0].pw);
            if(id == data[0].user_id && pw == data[0].pw){
                console.log('로그인 성공');
                // 세션에 추가
                req.session.is_logined = true;
                req.session.name = data[0].name;
                req.session.id = data[0].user_id;
                req.session.pw = data[0].pw;
                
                req.session.save(function(){ // 세션 스토어에 적용하는 작업
                    res.render('index',{ // 정보전달
                        id : data[0].user_id,
                        name : data[0].name,
                        is_logined : true,
                        list : rows
                    });
                });
                client.query("insert into login_session(login_user_id, login_name) values(?,?)",
                [
                    data[0].user_id,  data[0].name
                ]);


            }else{
                console.log('로그인 실패');
                res.render('login');
            }
        
        });
    });
    

});

// 로그아웃
app.get('/logout',(req,res)=>{
    console.log('로그아웃 성공');
    req.session.destroy(function(err){
        client.query("delete from login_session")
        // 세션 파괴후 할 것들
        res.redirect('/');
    });

});

// app.get('/list', (req, res)=>{
//     var sql = 'SELECT * FROM book';    
//     client.query(sql, function (err, rows, fields) {
//         if(err) console.log('query is not excuted. select fail...\n' + err);
//         else 
//     res.render('list.ejs');
//     });
// });

app.get('/write', (req, res) => {
    client.query('select * from login_session', (err, data) =>{
        console.log('글작성');
        res.render('write' ,{list : data});
    });
    
});

app.post('/write', (req, res) => {
    client.query('select * from login_session', (err, data) =>{
        console.log('글작성');
        res.render('write' ,{list : data});
    });
    
});

app.post('/bulletinAf', function (req, res) {
    var body = req.body;
    const id = body.login_user_id;
    const title = body.bulletin_title;
    const content = body.bulletin_content
    
    client.query('select * from login_session ', (err, data) => {
       client.query('insert into bulletin(bulletin_title, bulletin_content, bulletin_date, user_id) values (?,?,now(),?)',[
           title, content, data[0].login_user_id
       ]);
       res.redirect('/');
    });
});

app.post('/gobull', (req,res) => {  
    console.log("댓글");
    const body = req.body;
    const no = body.bulletin_no;

    client.query('select * from bulletin where bulletin_no = ?',[no],(err, data) =>{
            client.query('select * from bulletin left join bulletin_comment on bulletin.bulletin_no = bulletin_comment.bulletin_no  where bulletin.bulletin_no = ?',[no] ,(err,rows) =>{
        
            if(err) console.log("bulletin err : ", err);
            else res.render('bulletin',  {
                no : data,
                list : rows                
            });     
        });console.log("data", no)
    
    });

})

app.post('/comment_write', (req, res) =>{
    console.log('댓글작성');
    const body = req.body;
    const user_id = req.login_user_id;
    const bulletin_no = body.bulletin_no;
    const bulletin_comment_content = body.bulletin_comment_content;

    client.query('select * from bulletin where bulletin_no = ?' ,[bulletin_no],(err,rows)=>{
        client.query('select * from login_session', (err, data)=>{        
            client.query('insert into bulletin_comment(bulletin_no, bulletin_comment_content,bulletin_comment_date, user_id) value(?,?,now(),?)',[
                bulletin_no, bulletin_comment_content, data[0].login_user_id
                
            ]);
            res.render("/bulletin",{list : rows});
        });
        
    }); 

});

// app.get('/addcard',(req,res)=>{
//     console.log('카드추가'); 
//     res.render('addcard');
// });

// app.post('/addcardAf', function (req, res) {
//     var body = req.body;
//     console.log(body);

//     var sql = 'INSERT INTO creditcard VALUES(?, ?, ?, ?)';
//     var params = [body.CreditCard_No, body.CreditCard_ExpiryDate, body.CreditCard_type, body.user_id];
//     console.log(sql);
//     client.query(sql, params, function(err) {
//         if(err) console.log('query is not excuted. insert fail...\n' + err);
//         else res.redirect('/');
//     });
// });

// app.post('/deleteAf', function(req,res){
//     console.log('deleteAf work!');
//     const book = req.body.Book_No;
    
//         client.query('delete from book where Book_No=?',[book]);
//         console.log(book);
//         res.redirect('/list');
//         //if(data.length == 0){       // Data 가 없을 때
//             //console.log('책 데이터 삭제 실패');
//             //res.send('<script>alert("책 데이터 삭제 실패");</script>')
//             //res.redirect('/list');
//         //}   
    
// });
  
    


// app.get('/addaddress',(req,res)=>{
//     console.log('주소추가');
//     res.render('addaddress');
// });
// app.post('/addaddressAf', function (req, res) {
//     var body = req.body;
//     console.log(body);

//     var sql = 'INSERT INTO address VALUES(?, ?, ?, ?)';
//     var params = [body.Address_PostCode, body.user_id, body.Address_Basic, body.Address_Detailed];
//     console.log(sql);
//     client.query(sql, params, function(err) {
//         if(err) console.log('query is not excuted. insert fail...\n' + err);
//         else res.redirect('/');
//     });
// });

// app.get('/registedaddress', (req, res)=>{
//     var sql = 'SELECT * FROM creditcard WHERE user_id=?';    
//     client.query(sql, function (err, rows, fields) {
//         if(err) console.log('query is not excuted. select fail...\n' + err);
//         else res.render('list.ejs', {list : rows});
//     });
// });


// app.post("/orderok", (req,res) =>{
//     console.log("주문완료")
//     var body = req.body;

//     client.query("select * from login_session" , function(err, rows) {
//         console.log("row : ", rows);
//         client.query("select * from user where user_id =? " , [rows[0].login_user_id], (err,data) => {
//             console.log(data);
//             console.log(err);
//             client.query("update user set Member_Point =? where user_id =?", 
//             [(data[0].Member_Point) + parseInt(body.Book_Point), data[0].user_id]);
//             console.log("date : ", data[0].Member_Point);

//             client.query("update login_session set Login_Member_Point = ? ",
//             [(data[0].Member_Point) + parseInt(body.Book_Point)]);
//             console.log("Login Point : ", data[0].Login_Member_Point);
    
//             res.redirect('/')
//         });
       
//     })
   


// })

app.listen(4000,()=>{
    console.log('4000 port running...');
});