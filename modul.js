const app = require('./app.js');
const modul = require('./modul.js');
const date = new Date();
const dateFormat = require('dateformat');
const yy = dateFormat(date, "yy");
const mm = dateFormat(date, "mm");
exports.tanggalIndo = (data) => {
    var d = new Date(data),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    let hasil = [year, month, day].join('-');

    if (hasil == "0000-00-00" || hasil == null) {
        return (hasil);
    } else {
        let BulanIndo = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agust", "Sept", "Okt", "Nov", "Des"];

        let tahun = hasil.substring(2, 4);
        let bulan = hasil.substring(5, 7);
        let tgl = hasil.substring(8, 10);

        let result = `${tgl} ${BulanIndo[bulan - 1]} ${tahun}`;
        return (result);
    }
}

exports.numberFormat = (ini) => {
    var formatter = new Intl.NumberFormat("en-GB", { style: "decimal" });
    ini = ini || 0;
    return formatter.format(ini.toString().replace(/,/g, ""));
}

exports.OpenQuery = (ssql, resolve) => {
    setTimeout(() => {
        let pool = app.module_app();
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(ssql, function (error, results, fields) {
                connection.release();
                if (error) throw error;
                let sdatareturn = {
                    error: error,
                    dataset: results,
                    fields: fields,
                }
                resolve(sdatareturn)
                // connection.destroy()
            });
        });
    }, 100);
}

exports.ExecQuery = (ssql, resolve) => {
    setTimeout(() => {
        let pool = app.module_app();
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(ssql, function (err, result) {
                connection.release();
                if (err) throw err;
                let sdatareturn = {
                    error: err,
                    dataset: result,
                }
                resolve(sdatareturn)
                // connection.destroy()
            });
        });
    }, 100);
}

exports.getID = async (table, resolve) => {
    let cek   = await new Promise((resolve) => {modul.OpenQuery(`SELECT * FROM \`dbsid\` WHERE \`Table\` = '${table}' AND \`YY\` = '${yy}' AND \`MM\` = '${mm}'`, resolve); });
    var count = 0;
    if (cek.dataset.length > 0) {
        let CNT = parseInt(cek.dataset[0].Count) + 1;
        if (CNT < 10) {
            count = `${table}${yy}${mm}0000${CNT}`;
        } else if (CNT >= 10) {
            count = `${table}${yy}${mm}000${CNT}`;
        } else if (CNT >= 100) {
            count = `${table}${yy}${mm}00${CNT}`;
        } else if (CNT >= 1000) {
            count = `${table}${yy}${mm}0${CNT}`;
        } else if (CNT >= 10000) {
            count = `${table}${yy}${mm}${CNT}`;
        }
        await new Promise((resolve) => { modul.OpenQuery(`UPDATE dbsid SET \`Count\` = \`Count\` + 1 WHERE \`Table\` = '${table}' AND YY = '${yy}' AND MM = '${mm}'`, resolve); });
    } else {
        await new Promise((resolve) => { modul.OpenQuery(`INSERT INTO dbsid (\`Table\`, \`YY\`, \`MM\`, \`Count\`) VALUES ('${table}', '${yy}', '${mm}', 1)`, resolve); });
        count = `${table}${yy}${mm}00001`;
    }
    resolve(count);
}

exports.logBefore = async (user, table, id, what, resolve) => {
    let data = await new Promise((resolve) => {modul.OpenQuery(`SELECT * FROM \`${table}\` WHERE \`ID\` = '${id}'`, resolve); });
    let query = await new Promise((resolve) => {modul.ExecQuery(`INSERT INTO \`dbslogusers\` (\`UserID\`,\`What\` ,\`Before\` ,\`Table\`, \`TableID\`) VALUES ('${user}', '${what}', '${JSON.stringify(data.dataset[0])}', '${table}', '${id}')`, resolve); });
    resolve(query.dataset.insertId);
}

exports.logAfter = async function (lastid) {
    let sql = await new Promise((resolve) => { modul.OpenQuery(`SELECT \`Table\`, \`TableID\` FROM \`dbslogusers\` WHERE \`ID\` = '${lastid}'`, resolve); });
    let data = await new Promise((resolve) => { modul.OpenQuery(`SELECT * FROM \`${sql.dataset[0].Table}\` WHERE \`ID\` = '${sql.dataset[0].TableID}'`, resolve); });
    await new Promise((resolve) => { modul.ExecQuery(`UPDATE \`dbslogusers\` SET \`After\` = '${JSON.stringify(data.dataset[0])}' WHERE ID = '${lastid}' `, resolve); });
}

exports.Sessionaccount = (req) => {
    let sstatus = '';
    if (!req.session.email) sstatus = 'false';
    else sstatus = 'true'
    let stemp = {
        'location': req.session.iddata,
        'card': req.session.email,
        'cardName': req.session.name,
        'type': sstatus
    }
    return stemp;
}

exports.LogTraffic = (req) => {
    // log traffic 
    let datesesi = new Date();
    if (!req.session.init) {
        req.session.init = true
        console.log('log ----> host : ' + req.headers.host + req.originalUrl + ' ip :' + req.connection.remoteAddress.split(`:`).pop() + ' / time :' + datesesi + ' / get : ' + JSON.stringify(req.query) + " / post : " + JSON.stringify(req.body));
    } else if (JSON.stringify(req.query) != "{}") {
        console.log('log ----> host : ' + req.headers.host + req.originalUrl + ' ip :' + req.connection.remoteAddress.split(`:`).pop() + ' / time :' + datesesi + ' / url : ' + req.url + ' / get : ' + JSON.stringify(req.query) + " / post : " + JSON.stringify(req.body));
    } else if (JSON.stringify(req.body) != "{}") {
        console.log('log ----> host : ' + req.headers.host + req.originalUrl + ' ip :' + req.connection.remoteAddress.split(`:`).pop() + ' / time :' + datesesi + ' / url : ' + req.url + ' / get : ' + JSON.stringify(req.query) + " / post : " + JSON.stringify(req.body));
    }
}

exports.GetDocNumber = async (doctype, resolve) => {
    let ssqlforgeneratedocnumber = await new Promise((resolve) => { router_module.GetSQLQueryData('QGenerateDocNumber', resolve) })
    ssqlforgeneratedocnumber = ssqlforgeneratedocnumber.replace("?doctype", doctype)
    let data_Resolve = await new Promise((resolve) => { router_module.OpenQuery(ssqlforgeneratedocnumber, resolve) })
    resolve(data_Resolve.dataset[7][0].DocNumber)
}

exports.intFormat = (ini) => {
    let data = ini.toString().replace(/,/g, "");
    return data;
}

exports.stringFormat = (ini)=>{
    let data1 = ini.replace(/'/g, "\\'");
    let data2 = data1.replace(/"/g, '\\"');
    let data3 = data2.replace(/`/g, '\\`');
    return data3;
}