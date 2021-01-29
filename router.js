const path = require('path');
const pathview = path.join(__dirname + '/public');
const rootDir = "E:\\";
const fs = require('fs');
const modul = require("./router.js");
var posisi, curr

exports.tampil = async function(req, res, act) {
    try {
        switch (act) {
            case 'download':
                {
                    let file = req.query.p;
                    res.download(file);
                }
                break;

            case 'data':
                {
                    switch (req.query.act) {
                        case 'modal-mkdir':
                            {
                                res.render(pathview + '/data.html', { act: "modal-mkdir" });
                            }
                            break;

                        case 'modal-upload':
                            {
                                res.render(pathview + '/data.html', { act: "modal-upload" });
                            }
                            break;

                        case 'modal-delete':
                            {
                                res.render(pathview + '/data.html', { act: "modal-delete", p: req.query.p });
                            }
                            break;

                        case 'modal-listdb':
                            {
                                res.render(pathview + '/data.html', { act: "modal-listdb" });
                            }
                            break;

                        default:
                            {
                                let p = req.query.p;
                                console.log(p);
                                if (p == "D:\\" || p == "E:\\") {
                                    posisi = rootDir;
                                    fs.readdir(posisi, (err, files) => {
                                        res.render(pathview + '/main.html', { files: files, posisi: posisi, path: path, modul: modul });
                                    });
                                } else {
                                    posisi = p;
                                    fs.readdir(posisi, (err, files) => {
                                        res.render(pathview + '/data.html', { files: files, posisi: posisi, path: path, modul: modul, act: "" });
                                    });
                                }
                            }
                            break;
                    }
                }
                break;

            case 'crud':
                {
                    console.log(req.body.act);
                    switch (req.body.act) {
                        case 'buat folder':
                            {
                                let p = req.body.p;
                                let nama = req.body.nama;
                                let newdir = p + "/" + nama
                                console.log(newdir)
                                fs.mkdir(p + "/" + nama, { recursive: true }, (err) => {
                                    if (err) throw err;
                                    res.send({ "status": "sukses", "pesan": "sukses membuat folder baru dengan nama " + nama });
                                });
                            }
                            break;
                        case 'upload file':
                            {
                                let p = req.body.p;
                                const img = req.files.Img;
                                img.mv(p + "/" + img.name, function(err) {
                                    if (err)
                                        return res.status(500).send(err);
                                    res.send({ "status": "sukses", "pesan": "sukses Upload File dengan nama " + img.name });
                                });

                            }
                            break;

                        case 'delete file':
                            {
                                let p = req.body.p;
                                console.log(p);
                                fs.unlink(p, (err) => {
                                    if (err) throw err;
                                    console.log('path/file.txt was deleted');
                                    res.send({ "status": "sukses", "pesan": "sukses Menghapus file" });
                                });
                            }
                            break;

                        case 'list database':
                            {
                                const { h, u, p } = req.body;
                                var mysql = require('mysql');
                                var con = mysql.createConnection({
                                    host: h,
                                    user: u,
                                    password: p,
                                    database: "test"
                                });

                                con.connect(function(err) {
                                    if (err) throw err;
                                    con.query("show databases", function(err, result, fields) {
                                        if (err) throw err;
                                        console.log(result)
                                        res.send({ "pesan": "sukses", db: result });
                                    });
                                });
                            }
                            break;

                        case 'backup database':
                            {
                                const { h, u, p, d, n, url, c, t } = req.body;
                                const mysqldump = require('mysqldump');
                                if (c == "yes") {
                                    mysqldump({
                                        connection: {
                                            host: h,
                                            user: u,
                                            password: p,
                                            database: d,
                                        },
                                        dumpToFile: url + "/" + n + ".sql." + t,
                                        compressFile: true,
                                    });
                                } else {
                                    mysqldump({
                                        connection: {
                                            host: h,
                                            user: u,
                                            password: p,
                                            database: d,
                                        },
                                        dumpToFile: url + "/" + n + ".sql",
                                    });
                                }
                                res.send({ "status": "sukses", "pesan": "Berhasil membackup database dengan nama : " + n });
                            }
                            break;
                    }
                }
                break;

            case 'login':
                {
                    switch (req.body.act) {
                        case 'cek login':
                            {
                                let jawaban = ["uvuv", "ricky", "ngiseng", "pentil", "nayla", "ganda tadyo surya", "laudy", "prasetia", "limman susanto", "parkiran", "nasi goreng"];
                                let q = req.body.q;
                                let a = req.body.a;
                                console.log(q + jawaban[q])
                                if (a == jawaban[q]) {
                                    res.send({ "status": "sukses", "pesan": "jawaban anda benar" });
                                } else {
                                    res.send({ "status": "gagal", "pesan": "Ngawur" });
                                }
                            }
                            break;

                        default:
                            {
                                let pertanyaan = ["Nama Variable Apa yang di benci mas ganda?", "siapa nama partner kerja mas erwin", "Kebiasaan pak ichsan", "apa yang paling mencolok dari diri mas ganda", "siapa nama anak mas heru", "nama lengkap mas ganda", "nama belakang mas erwin", "nama belakang pembuat aplikasi ini", "nama lengkap boss", "dimana tempat pertama kali mas ganda bertemu pacanya", "makanan favorit mas ganda"];
                                let q = Math.floor(Math.random() * 11);
                                res.render(pathview + "/login.html", { q: q, p: pertanyaan[q] });
                            }
                            break;
                    }
                }
                break;

            default:
                posisi = rootDir;
                fs.readdir(posisi, (err, files) => {
                    res.render(pathview + '/main.html', { files: files, posisi: posisi, path: path, modul: modul });
                });
                break;
        }
    } catch (error) {
        console.log(error);
    }
}

exports.size = function(filename) {
    var stats = fs.statSync(filename);
    var fileSizeInBytes = stats.size;
    return fileSizeInBytes;
}