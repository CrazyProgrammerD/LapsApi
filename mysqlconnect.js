let mysql = require('mysql')

let name = "zhongzai_juzai"
let time = "20210701000000"

const db_config = {
    host: '220.243.128.36',
    port: '8046',
    user: 'wis_bxz',
    password: 'wis_bxz##20200628',
    database: 'baoxian_product'
}

let connect = mysql.createConnection(db_config)
connect.connect(function (err) {
    if (err) {
        console.log("mysql not connect!" + err)
    } else {
        console.log("mysql success!")
    }
})

let sqlQuery = `SELECT * FROM User where name = '${name}' and is_active = 1 and expiration_time >='${time}'`
console.log(sqlQuery)
connect.query(sqlQuery, function (err, result) {
    if (err) {
        console.log(err)
    } else {
        console.log(result)
    }
})