let port = '3002'
if (process.env.mysql_host != undefined) mysql_host = process.env.mysql_host
if (process.env.mysql_database != undefined) mysql_database = process.env.mysql_database
if (process.env.mysql_username != undefined) mysql_username = process.env.mysql_username
if (process.env.mysql_password != undefined) mysql_password = process.env.mysql_password
if (process.env.mysql_port != undefined) mysql_port = process.env.mysql_port
if (process.env.port != undefined) port = process.env.port

let config = {
    port: port,
}

module.exports = config