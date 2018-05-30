const cron = require('node-cron')
const axios = require('axios')

// 心跳激活
cron.schedule('*/30 * * * * *', function () {
    axios.get('https://dl57vasdud645.cloudfront.net/ping')  // 云LOG服务

    axios.get('https://d3prd6rbitzqm3.cloudfront.net/ping') // N1测试代理
    axios.get('https://d3rqtlfdd4m9wd.cloudfront.net/ping') // N1测试管理员
    axios.get('https://dgjmusja39cm2.cloudfront.net/ping')  // N1测试游戏
    
    axios.get('https://n1agent.na12345.com/ping') // N1代理
    axios.get('https://n1admin.na12345.com/ping') // N1管理员
    axios.get('https://n1game.na12345.com/ping')  // N1游戏
    axios.get('https://n2agent.na12345.com/ping') // N2代理
})