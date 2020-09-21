const Koa = require('koa')
const Router = require('koa-router')
const bodyparser = require('koa-bodyparser')
const moment = require('moment')
const request = require('request')
const dic = require('./dic')

const x2js = require('x2js')
let x2jsxml = new x2js()

const app = new Koa()
let router = new Router()
app.use(bodyparser())

let FunList = {
    CheckFun: (content) => {
        let reqStrobj = content
        let timeStart = moment(reqStrobj.time_start, 'YYYYMMDDHHmm').format('YYYYMMDDHHmm')
        let Startdiff = moment(reqStrobj.time_start, 'YYYYMMDDHHmm')
        let Enddiff = moment(reqStrobj.time_end, 'YYYYMMDDHHmm')
        let time_startfom = moment(reqStrobj.time_start, "YYYY-MM-DD hh:mm:ss").subtract(8, 'hour').format()
        let timeStr = time_startfom.substring(0, time_startfom.length - 6)

        let reqName = reqStrobj.name
        let reqPubKey = reqStrobj.publicKey

        let AginreqStr = "http://datacenterapi.wis.com.cn:8056/authentication?name=" + reqName + "&publicKey=" + reqPubKey

        return new Promise((resolve) => {
            request.get(AginreqStr, (err, res, body) => {

                const bodyobj = JSON.parse(body)

                if (bodyobj.success == 1) {
                    //公钥验证通过
                    let EleArr = []
                    let ArrNc = []
                    if (reqStrobj.time_end.length == 0) {
                        //没有结束时间
                        if (reqStrobj.Element.length > 1) {
                            //要素不唯一
                            for (i in reqStrobj.Element) {
                                EleArr.push(dic[reqStrobj.Element[i]])
                            }
                            console.log(EleArr)
                            let ElStr = EleArr.join('&var=')
                            let NCSSStr = "http://220.243.128.10:8034/thredds/ncss/home/data_source/LAPS/GR2/MSP3_PMSC_LAPS3KM_ME_L88_CHN_" + timeStart + "_00000-00000.GR2?var=" + ElStr + "&latitude=" + reqStrobj.latitude + "&longitude=" + reqStrobj.longitude + "&time_start=" + timeStr + "Z&time_end=" + timeStr + "Z&vertCoord=&accept=xml"
                            ArrNc.push(NCSSStr)
                        } else {
                            //要素唯一
                            let NCSSStr = "http://220.243.128.10:8034/thredds/ncss/home/data_source/LAPS/GR2/MSP3_PMSC_LAPS3KM_ME_L88_CHN_" + timeStart + "_00000-00000.GR2?var=" + dic[reqStrobj.Element[0]] + "&latitude=" + reqStrobj.latitude + "&longitude=" + reqStrobj.longitude + "&time_start=" + timeStr + "Z&time_end=" + timeStr + "Z&vertCoord=&accept=xml"
                            ArrNc.push(NCSSStr)
                        }
                    } else {
                        //有结束时间
                        let duration = moment.duration(Enddiff.diff(Startdiff)).asHours()
                        if (reqStrobj.Element.length > 1) {
                            //要素不唯一
                            for (i in reqStrobj.Element) {
                                EleArr.push(dic[reqStrobj.Element[i]])
                            }
                            let ElStr = EleArr.join('&var=')
                            for (let j = 0; j <= duration; j++) {
                                let DiffStr = moment(timeStart, "YYYYMMDDHHmm").add(j, 'hours').format("YYYYMMDDHHmm")
                                let Diff_timefom = moment(DiffStr, "YYYY-MM-DD hh:mm").subtract(8, 'hour').format("YYYY-MM-DDTHH:mm:ss")
                                let Diff_time = Diff_timefom.substring(0, time_startfom.length - 6)
                                let NCSSStr = "http://220.243.128.10:8034/thredds/ncss/home/data_source/LAPS/GR2/MSP3_PMSC_LAPS3KM_ME_L88_CHN_" + DiffStr + "_00000-00000.GR2?var=" + ElStr + "&latitude=" + reqStrobj.latitude + "&longitude=" + reqStrobj.longitude + "&time_start=" + Diff_time + "Z&time_end=" + Diff_time + "Z&vertCoord=&accept=xml"
                                ArrNc.push(NCSSStr)
                            }
                        } else {
                            //要素唯一
                            for (let a = 0; a <= duration; a++) {
                                let DiffStr = moment(timeStart, "YYYYMMDDHHmm").add(a, 'hours').format("YYYYMMDDHHmm")
                                let Diff_timefom = moment(DiffStr, "YYYY-MM-DD hh:mm").subtract(8, 'hour').format("YYYY-MM-DDTHH:mm:ss")
                                let Diff_time = Diff_timefom.substring(0, time_startfom.length - 6)
                                let NCSSStr = "http://220.243.128.10:8034/thredds/ncss/home/data_source/LAPS/GR2/MSP3_PMSC_LAPS3KM_ME_L88_CHN_" + DiffStr + "_00000-00000.GR2?var=" + dic[reqStrobj.Element[0]] + "&latitude=" + reqStrobj.latitude + "&longitude=" + reqStrobj.longitude + "&time_start=" + Diff_time + "Z&time_end=" + Diff_time + "Z&vertCoord=&accept=xml"
                                ArrNc.push(NCSSStr)
                            }
                        }
                    }
                    function reqFun(Arr) {
                        for (let i = 0; i < Arr.length; i++) {
                            request.get(Arr[i], function (err, res, body) {
                                const ElementObj = x2jsxml.xml2js(body)
                                const resData = ElementObj.grid.point.data
                                resolve(resData)
                            })
                        }
                    }
                    reqFun(ArrNc)
                } else {
                    //公钥验证不通过
                    const Result = bodyobj.message
                    resolve(Result)
                }
            })
        })
    }
}

router.post('/LapsData',async (ctx) => {
    const con = ctx.request.body
    await FunList.CheckFun(con).then(res => {
        // console.log('success', res);
        ctx.body = {
            code: 0,
            data: res,
            message: ''
        }
    })
})

app.use(router.routes())

app.listen(9000, () => {
    console.log('the server is running on http://localhost:9000')
})

