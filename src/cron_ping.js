const cron = require('node-cron')
const axios = require('axios')

// 心跳激活
cron.schedule('*/30 * * * * *', function () {
    axios.get('https://dl57vasdud645.cloudfront.net/ping')  // 云LOG服务
    axios.get('https://d3oo6v0d877qm6.cloudfront.net/ping') // 测试代理
    axios.get('https://n1agent.na12345.com/ping') // N1代理
    axios.get('https://n2agent.na12345.com/ping') // N2代理
})