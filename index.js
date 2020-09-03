let http = require('http')
let fs = require('fs')
let path = require('path')
let querystring = require('querystring')
let crypto = require('crypto')
let moment = require('moment')

let mysql = require('mysql')
const { type } = require('os')

// let name
let app = http.createServer(function(req,res){

let md5SecretKey = ""
let timeMillis = ""

    function Check(req) {
        if (req.url.indexOf('/LapsApi') === 0 && req.method === 'POST') {
            var reqdata = ''
            req.on('data', function (chuck) {
                reqdata += chuck
                let dataobj = JSON.parse(reqdata)
                //console.log(dataobj.name)
                let name = dataobj.name
                let publicKey = dataobj.publicKey
                console.log(publicKey)
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
                        return "mysql not connect!" + err
                    }
                })

                let sqlQuery = `SELECT * FROM User where name = '${name}' and is_active = 1 and expiration_time >='20210701000000'`
                connect.query(sqlQuery, function (err, result) {
                    if (err) {
                        return err
                    } else if (result.length == 0) {
                        return "用户不存在！"
                    } else {
                        // console.log(result)
                        //用户密码
                        //console.log("password:"+result[0].password)
                        let userName = result[0].userName
                        let password = result[0].password
                        //公钥分割
                        for (let i = 0; i < publicKey.length; i++) {
                            if (i % 4 == 3) {
                                timeMillis += publicKey.charAt(i)
                            } else {
                                md5SecretKey += publicKey.charAt(i)
                            }
                        }
                        // console.log(md5SecretKey)
                        let SysTime = moment().startOf('day').valueOf()
                        console.log(SysTime)
                        let MathNum = SysTime - timeMillis < 5 * 60
                        console.log(MathNum)
                        if (MathNum == true) {
                            let Key = userName + "$" + timeMillis + "$" + password
                            let md5Key = crypto.createHash('md5').update(Key).digest("hex")
                            console.log(md5Key)
                            if (md5Key == md5SecretKey) {
                                console.log("验证通过")
                                //确认参数，参数合法化确认
                            } else {
                                console.log("公钥验证不通过，重新申请")
                                return "公钥验证不通过，重新申请"
                            }
                        } else {
                            return "连接超时，重新申请公钥！"
                        }
                    }
                })
            })
            req.on('end', function () {
                res.end(reqdata)
            })
        } else {

        }
    }

Check(req)

}).listen(9999,function(){
    console.log("the server is running!")
})







