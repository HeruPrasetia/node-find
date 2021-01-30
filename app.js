const express = require('express');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const router = require('./router.js');
const path = require('path');
const pathview = path.join(__dirname + '/public');
const app = express();

app.use(bodyParser.json({ limit: "50000mb" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

app.use(express.static('views'))
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.use(express.static('public'))

app.use(function(req, res, next) {
    let ownPath = ['/', '/data', '/download', '/crud', '/login'];
    let reqPath = req.path;
    if (ownPath.includes(reqPath)) {
        router.tampil(req, res, reqPath.substr(1));
    } else {
        router.tampil(req, res, '');
    }
});

const port = 3000;
app.listen(port, () => console.log(`lawlawland -> http://localhost:${port}`))
exports.module_app = () => { return pool }
<html> <head><title>502 Bad Gateway</title></head> <body> <center><h1>502 Bad Gateway</h1></center> <hr><center>cloudflare</center> </body> </html>