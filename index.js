let http = require('http')
let fs = require('fs')
let path = require('path')
let querystring = require('querystring')
let crypto = require('crypto')
let moment = require('moment')

let mysql = require('mysql')
const { type } = require('os')
let dic = require('./dic')
const { time } = require('console')
// const LapsData = require('./reqData')



// let name
let app = http.createServer(function(req,res){

let md5SecretKey = ""
let timeMillis = ""

    function Check(req) {
        if (req.url.indexOf('/ApiCheck') === 0 && req.method === 'POST') {
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
                        let userName = result[0].name
                        let password = result[0].password
                        //公钥分割
                        for (let i = 0; i < publicKey.length; i++) {
                            if (i % 4 == 3) {
                                timeMillis += publicKey.charAt(i)
                            } else {
                                md5SecretKey += publicKey.charAt(i)
                            }
                        }
                        console.log(md5SecretKey)
                        let SysTime = moment().startOf('day').valueOf()
                        console.log(SysTime)
                        let MathNum = SysTime - timeMillis < 5 * 60
                        console.log(MathNum)
                        if (MathNum == true) {
                            let Key = userName + "$" + timeMillis + "$" + password
                            console.log(Key)
                            let md5Key = crypto.createHash('md5').update(Key).digest("hex")
                            console.log("md5Key:" + md5Key)
                            console.log("md5SecretKey:" + md5SecretKey)
                            if (md5Key == md5SecretKey) {
                                console.log("验证通过")
                                //确认参数，参数合法化确认
                                // LapsData(req)
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
    function LapsData(req) {
        if (req.url.indexOf('/LapsData') === 0 && req.method === 'POST') {
            var reqStr = ''
            req.on('data', function (data) {
                reqStr += data
                // console.log(reqStr)
                let reqStrobj = JSON.parse(reqStr)
                let timeStart = moment(reqStrobj.time_start, 'YYYYMMDDHHmm').format('YYYYMMDDHHmm')
                let Startdiff = moment(reqStrobj.time_start, 'YYYYMMDDHHmm')
                let Enddiff = moment(reqStrobj.time_end, 'YYYYMMDDHHmm')
                let time_startfom = moment(reqStrobj.time_start, "YYYY-MM-DD hh:mm:ss").subtract(8, 'hour').format()
                let timeStr = time_startfom.substring(0, time_startfom.length - 6)

                let EleArr = []
                
                if (reqStrobj.time_end.length == 0) {
                    if (reqStrobj.Element.length > 1) {
                        for (i in reqStrobj.Element) {
                            EleArr.push(dic[reqStrobj.Element[i]])
                        }
                        console.log(EleArr)
                        let ElStr = EleArr.join('&var=')
                        let NCSSStr = "http://10.16.48.231:30002/thredds/ncss/data/231/Dzk/LAPS/demo/20200907/MSP3_PMSC_LAPS3KM_ME_L88_CHN_" + timeStart + "_00000-00000.GR2?var=" + ElStr + "&latitude=" + reqStrobj.latitude + "&longitude=" + reqStrobj.longitude + "&time_start=" + timeStr + "Z&time_end=" + timeStr + "Z&vertCoord=&accept=xml"
                        console.log(NCSSStr)
                    } else {
                        let NCSSStr = "http://10.16.48.231:30002/thredds/ncss/data/231/Dzk/LAPS/demo/20200907/MSP3_PMSC_LAPS3KM_ME_L88_CHN_" + timeStart + "_00000-00000.GR2?var=" + dic[reqStrobj.Element[0]] + "&latitude=" + reqStrobj.latitude + "&longitude=" + reqStrobj.longitude + "&time_start=" + timeStr + "Z&time_end=" + timeStr + "Z&vertCoord=&accept=xml"
                        console.log(NCSSStr)
                    }
                } else {

                    let duration = moment.duration(Enddiff.diff(Startdiff)).asHours()
                    for (let a = 0; a <= duration; a++) {
                        let DiffStr = moment(timeStart, "YYYYMMDDHHmm").add(a, 'hours').format("YYYYMMDDHHmm")
                        let Diff_timefom = moment(DiffStr, "YYYY-MM-DD hh:mm").subtract(8, 'hour').format("YYYY-MM-DDHH:mm:ss")
                        let Diff_time = Diff_timefom.substring(0, time_startfom.length - 6)
                       
                        let NCSSStr = "http://10.16.48.231:30002/thredds/ncss/data/231/Dzk/LAPS/demo/20200907/MSP3_PMSC_LAPS3KM_ME_L88_CHN_" + DiffStr + "_00000-00000.GR2?var=" + dic[reqStrobj.Element[0]] + "&latitude=" + reqStrobj.latitude + "&longitude=" + reqStrobj.longitude + "&time_start=" + Diff_time + "Z&time_end=" + Diff_time + "Z&vertCoord=&accept=xml"
                        console.log(NCSSStr)
                    }
            
                }
            })
            req.on('end', function () {
                res.end(reqStr)
            })
        } else {

        }
    }
LapsData(req)
Check(req)

}).listen(9999,function(){
    console.log("the server is running!")
})







