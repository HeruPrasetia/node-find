const path = require('path');
const pathview = path.join(__dirname + '/public')

exports.tampil = async function(req, res, act) {
    try {
        switch (act) {
            case 'data':
                {
                    let mode = req.query.mode ? req.query.mode : "next"
                    let posisi = "";
                    if (mode == "next") {
                        posisi = __dirname + "/" + req.query.p + "/";
                    } else {
                        posisi = __dirname + "/" + req.query.p + "/" + "../";
                    }
                    console.log(posisi)
                    const fs = require('fs');
                    fs.readdir(posisi, (err, files) => {
                        res.render(pathview + '/data.html', { files: files, posisi: req.query.p });
                    });
                }
                break;

            default:
                const testFolder = __dirname;
                const fs = require('fs');
                var roo = [];
                fs.readdir(__dirname + "/../../../../", (err, files) => {
                    files.forEach(file => {
                        roo.push(`"${file}"`);
                        console.log(file)
                    })
                });
                console.log(roo)
                fs.readdir(testFolder, (err, files) => {
                    res.render(pathview + '/main.html', { files: files });
                });
                break;
        }
    } catch (error) {
        console.log(error);
    }
}