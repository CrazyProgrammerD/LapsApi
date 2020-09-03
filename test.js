let moment = require('moment')
let crypto = require('crypto')

let publicKey = "1a91d8f54c49395275492e5700a947d1b9c97a17ff"

let userName = "zhongzai_juzai"
let password = "nmN31lxi"
let timeMillis = ""
let md5SecretKey = ""

for (let i = 0; i < publicKey.length; i++) {
    if (i%4 == 3) {
        timeMillis+=publicKey.charAt(i)
    } else {
        md5SecretKey+=publicKey.charAt(i)
    }
    
}
// console.log(timeMillis)
console.log(md5SecretKey)
let SysTime = moment().startOf('day').valueOf()
console.log(SysTime)

let MathNum = SysTime - timeMillis < 5 * 60 
console.log(MathNum)

let Key = userName + "$" + timeMillis + "$" + password
let md5Key = crypto.createHash('md5').update(Key).digest("hex")
console.log(md5Key)

if (md5Key == md5SecretKey) {
    console.log("验证通过")
} else {
    console.log("验证不通过")
}

