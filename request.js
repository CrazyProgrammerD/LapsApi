const request = require('request')
const x2js = require('x2js')
let x2jsxml = new x2js()

NCSSStr = ['http://10.16.48.231:30002/thredds/ncss/data/231/Dzk/LAPS/demo/20200907/MSP3_PMSC_LAPS3KM_ME_L88_CHN_202009072000_00000-00000.GR2?var=Dewpoint_temperature_height_above_ground&latitude=39.1234&longitude=116.2345&time_start=2020-09-07T12:00:00Z&time_end=2020-09-07T12:00:00Z&vertCoord=&accept=xml',
    'http://10.16.48.231:30002/thredds/ncss/data/231/Dzk/LAPS/demo/20200907/MSP3_PMSC_LAPS3KM_ME_L88_CHN_202009072100_00000-00000.GR2?var=Dewpoint_temperature_height_above_ground&latitude=39.1234&longitude=116.2345&time_start=2020-09-07T13:00:00Z&time_end=2020-09-07T13:00:00Z&vertCoord=&accept=xml',
    'http://10.16.48.231:30002/thredds/ncss/data/231/Dzk/LAPS/demo/20200907/MSP3_PMSC_LAPS3KM_ME_L88_CHN_202009072200_00000-00000.GR2?var=Dewpoint_temperature_height_above_ground&latitude=39.1234&longitude=116.2345&time_start=2020-09-07T14:00:00Z&time_end=2020-09-07T14:00:00Z&vertCoord=&accept=xml',
    'http://10.16.48.231:30002/thredds/ncss/data/231/Dzk/LAPS/demo/20200907/MSP3_PMSC_LAPS3KM_ME_L88_CHN_202009072300_00000-00000.GR2?var=Dewpoint_temperature_height_above_ground&latitude=39.1234&longitude=116.2345&time_start=2020-09-07T15:00:00Z&time_end=2020-09-07T15:00:00Z&vertCoord=&accept=xml'
]
Str = 'http://10.16.48.231:30002/thredds/ncss/data/231/Dzk/LAPS/demo/20200907/MSP3_PMSC_LAPS3KM_ME_L88_CHN_202009072300_00000-00000.GR2?var=Dewpoint_temperature_height_above_ground&latitude=39.1234&longitude=116.2345&time_start=2020-09-07T15:00:00Z&time_end=2020-09-07T15:00:00Z&vertCoord=&accept=xml'

function reqFun(Arr) {
    for (let i = 0; i < Arr.length; i++) {
        request.get(Arr[i], function (err, res, body) {
            // console.log("body:" + body.data)
            let ElementObj = x2jsxml.xml2js(body)
            // console.log(ElementObj.grid.point.data)
            let resData = ElementObj.grid.point.data
            console.log(resData)
        })
    }
}

reqFun(NCSSStr)

// for (let i = 0; i < NCSSStr.length; i++) {
//     console.log(NCSSStr[i])
// }
