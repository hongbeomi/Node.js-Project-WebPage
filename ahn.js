const express = require('express');
const bodyParser = require('body-parser');

/*
const multer = require('multer');
const _storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, 'uploads/');
    },
    filename: (req,file,cb)=>{
        cb(null, file.originalname);
    }
});
const upload = multer({ storage : _storage});
*/

const fs = require('fs');
const mysql = require('mysql');
const conn = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password: 'ahnfactory3963',
    database: 'af'
});

conn.connect();
const app = express();
app.use(express.static('view_mysql'));
app.locals.pretty=true;
app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'jade');
app.set('views', './view_mysql');

/*
app.get('/upload',(req,res)=>{
    res.render('upload');
});

app.post('/upload', upload.single('userfile'), (req,res)=>{
    console.log(req.file);
    res.send('Uploaded :'+ req.file.filename);
});
*/

app.get('/ahnfactory/add', (req,res)=>{
    const sql = 'SELECT id,title FROM ahndata';
    conn.query(sql, (err, rows, fields)=>{
        if (err) {
            console.log(err);
            res.status(500).send('인터넷 서버 에러');
        }
        res.render('add', { factorys : rows});
    });
});

app.post('/ahnfactory/add', (req,res)=>{
    const title = req.body.title;
    const description = req.body.description;
    const author = req.body.author;
    const sql = 'INSERT INTO ahndata (title, description, author) VALUES(?, ?, ?)';
    conn.query(sql, [title, description, author], (err, result, fields)=>{
        if(err){
            console.log(err);
            res.status(500).send('인터넷 서버 에러');
        }
        else {
            res.redirect('/ahnfactory/'+result.insertId);
        }
    });
});

app.get(['/ahnfactory/:id/edit'],(req,res)=>{
    const sql = 'SELECT id,title FROM ahndata';
    conn.query(sql, (err, rows, fields)=>{
        const id = req.params.id;
        if(id){
            const sql ='SELECT * FROM ahndata WHERE id=?';
            conn.query(sql, [id], (err,row, fields)=>{
                if(err){
                    console.log(err);
                    res.status(500).send('인터넷 서버 에러');
                }
                else {
                    res.render('edit', {factorys:rows, ahnfactory:row[0]});
                }
            });
        }
        else {
            console.log('There is no id');
            res.status(500).send('인터넷 서버 에러');
        }
    });
});

app.post(['/ahnfactory/:id/edit'], (req,res)=>{
    const title = req.body.title;
    const description = req.body.description;
    const author = req.body.author;
    const id = req.params.id;
    const sql = 'UPDATE ahndata SET title=?, description=?, author=? WHERE id=?';
    conn.query(sql, [title, description, author, id], (err, result, fields)=>{
        if(err){
            console.log(err);
            res.status(500).send('인터넷 서버 에러');
        }
        else {
            res.redirect('/ahnfactory/'+id);
        }
    });
});

app.get('/ahnfactory/:id/delete', (req, res)=>{
    const sql = 'SELECT id,title FROM ahndata';
    const id = req.params.id;
    conn.query(sql, (err, rows, fields)=>{
        const sql = 'SELECT * FROM ahndata WHERE id=?';
        conn.query(sql, [id], (err, i)=>{
            if(err){
                console.log(err);
                res.status(500).send('인터넷 서버 에러');
            }
            else {
                if(i.length === 0){
                    console.log('There is no id');
                    res.status(500).send('인터넷 서버 에러');
                }
                else {
                    res.render('delete', {factorys:rows, ahnfactory:i[0]});
                }
            }
        });
    });
});

app.post('/ahnfactory/:id/delete', (req, res)=>{
    const id = req.params.id;
    const sql = 'DELETE FROM ahndata WHERE id=?';
    conn.query(sql, [id], (err, result)=>{
        res.redirect('/ahnfactory/');
    });
});

app.get(['/ahnfactory','/ahnfactory/:id'],(req,res)=>{
    const sql = 'SELECT id,title FROM ahndata';
    conn.query(sql, (err, rows, fields)=>{
        const id = req.params.id;
        if(id){
            const sql ='SELECT * FROM ahndata WHERE id=?';
            conn.query(sql, [id], (err,row, fields)=>{
                if(err){
                    console.log(err);
                    res.status(500).send('인터넷 서버 에러');
                }
                else {
                    res.render('view', {factorys:rows, ahnfactory:row[0]})
                }
            });
        }
        else {
            res.render('view', {factorys: rows});
        }
    });
});

app.listen(3000,()=> {
    console.log('Conneted 3000 port!');
});
