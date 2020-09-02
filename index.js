let http = require('http')
let fs = require('fs')
let path = require('path')
let querystring = require('querystring')

let mysql = require('mysql')
const { type } = require('os')

// let name
// let publicKey

let app = http.createServer(function(req,res){

    if (req.url.indexOf('/LapsApi') === 0 && req.method === 'POST') {
        var reqdata = ''
        var i = 1
        req.on('data', function (chuck) {
            reqdata += chuck
            let dataobj = JSON.parse(reqdata)
            //console.log(dataobj.name)
            name = dataobj.name
            console.log(typeof (name))
            publicKey = dataobj.publicKey
            //mysql 连接
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

            let sqlQuery = `SELECT * FROM User where name = '${name}' and is_active = 1 and expiration_time >='20210701000000'`
            connect.query(sqlQuery, function (err, result) {
                if (err) {
                    console.log(err)
                } else if (result.length == 0) {
                    console.log("用户不存在！")
                } else {
                    console.log(result)
                    //用户密码
                    //console.log("password:"+result[0].password)
                }
            })
        })
        req.on('end', function () {
            res.end(reqdata)
        })
    } else {
        
    }

 
}).listen(9999,function(){
    console.log("the server is running!")
})







