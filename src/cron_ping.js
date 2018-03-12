const cron = require('node-cron')
const axios = require('axios')

// 心跳激活
cron.schedule('*/30 * * * * *', function () {
    axios.get('https://dl57vasdud645.cloudfront.net/ping')  // 云LOG服务
    axios.get('https://d3oo6v0d877qm6.cloudfront.net/ping') // 测试代理
    axios.get('https://d3fb95uaptbs2t.cloudfront.net/ping') // 正式代理
    axios.get('https://d7nnwhk3clfz0.cloudfront.net/ping')  // N2代理
})