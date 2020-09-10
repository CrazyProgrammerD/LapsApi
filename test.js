let moment = require('moment')
let crypto = require('crypto')

let dic = require('./dic.js')
const { push } = require('./dic.js')
const { time } = require('console')


// let publicKey = "4a01bca53c3909a977212439701078607d271a771d"

// let userName = "zhongzai_juzai"
// let password = "nmN31lxi"
// let timeMillis = ""
// let md5SecretKey = ""

// for (let i = 0; i < publicKey.length; i++) {
//     if (i%4 == 3) {
//         timeMillis+=publicKey.charAt(i)
//     } else {
//         md5SecretKey+=publicKey.charAt(i)
//     }
    
// }
// // console.log(timeMillis)
// console.log(md5SecretKey)
// let SysTime = moment().startOf('day').valueOf()
// console.log(SysTime)

// let MathNum = SysTime - timeMillis < 5 * 60 
// console.log(MathNum)

// let Key = userName + "$" + timeMillis + "$" + password
// let md5Key = crypto.createHash('md5').update(Key).digest("hex")
// console.log("md5key:"+md5Key)
// console.log("md5SecretKey:" + md5SecretKey)
// if (md5Key == md5SecretKey) {
//     console.log("验证通过")
// } else {
//     console.log("验证不通过")
// }

// let Arr = ["Dt"]
// // console.log(dic[Arr[1]])



// if (Arr.length > 1) {
//     // for (let i in Arr) {
//     //     let Str = "http://10.16.48.231:30002/thredds/ncss/data/231/Dzk/LAPS/demo/20200907/MSP3_PMSC_LAPS3KM_ME_L88_CHN_var=" + dic[Arr[i]]
//     //     console.log(Str)
//     // }

//     let ElArr = []
//     for (i in Arr) {
//         // console.log(dic[Arr[i]])
//         ElArr.push(dic[Arr[i]])
//     }
//     // console.log(ElArr.join("&var="))
//     let ElStr = ElArr.join("&var=")
//     let Str = "http://10.16.48.231:30002/thredds/ncss/data/231/Dzk/LAPS/demo/20200907/MSP3_PMSC_LAPS3KM_ME_L88_CHN_var=" + ElStr
//     console.log(Str)
// } else {
//     let Str = "http://10.16.48.231:30002/thredds/ncss/data/231/Dzk/LAPS/demo/20200907/MSP3_PMSC_LAPS3KM_ME_L88_CHN_var=" + dic[Arr[0]]
//     console.log(Str)
// }

let TimeRange = {
    "time_start": "20200907130000",
    "time_end": "20200908230000"
}

timeStart = moment(TimeRange.time_start, "YYYYMMDDHHmmss")
timeend = moment(TimeRange.time_end, "YYYYMMDDHHmmss")


let duration = moment.duration(timeend.diff(timeStart)).asHours()

console.log(duration)

for (let i = 0; i <= duration; i++) {
    console.log(moment(timeStart, "YYYYMMDDHHmm").add(i, 'hours').format("YYYYMMDDHHmm"))
}


// console.log(timeendfom.diff(timeStartfom,'hours'))
// time = moment(TimeRange.time_start, 'YYYYMMDDHHmm').add(1, 'hours').format('YYYYMMDDHHmm')


// var a = moment();
// console.log(a)
// var b = moment().add(1, 'seconds');
// console.log(b)
// console.log(a.diff(b))


let Str = "http://10.16.48.231:30002/thredds/ncss/data/231/Dzk/LAPS/demo/20200907/MSP3_PMSC_LAPS3KM_ME_L88_CHN_time"


