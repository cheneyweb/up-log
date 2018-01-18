// 系统配置参数
const config = require('config')
// 路由相关
const Router = require('koa-router')
const router = new Router()
// 工具相关
const _ = require('lodash')
// 日志相关
const log = require('tracer').colorConsole({ level: config.log.level })
// 持久层相关
const UserModel = require('./model/UserModel')
const ConfigModel = require('./model/ConfigModel')

// 上传配置
router.post('/upconfig', async function (ctx, next) {
    // 检查入参
    let inparam = ctx.request.body
    if (!inparam || !ctx.tokenVerify) {
        ctx.body = { err: true, msg: '查询参数错误' }
        return
    }
    if (!inparam.configs && !inparam.code) {
        ctx.body = { err: true, msg: 'code不能为空' }
        return
    }
    if (!inparam.configs && !inparam.config) {
        ctx.body = { err: true, msg: 'config不能为空' }
        return
    }
    // 正确则写入配置
    for (let item of inparam.configs) {
        const username = ctx.tokenVerify.username
        const code = item.code
        const config = item.config
        await new ConfigModel().putItem({ username, code, config })
    }
    ctx.body = { err: false, msg: 'SUCCESS' }

})

// 删除配置
router.post('/delconfig', async function (ctx, next) {
    // 检查入参
    let inparam = ctx.request.body
    if (!inparam || !ctx.tokenVerify) {
        ctx.body = { err: true, msg: '查询参数错误' }
        return
    }
    if (!inparam.configs && !inparam.code) {
        ctx.body = { err: true, msg: 'code不能为空' }
        return
    }
    const username = ctx.tokenVerify.username
    const code = inparam.code
    new ConfigModel().deleteItem({ Key: { username, code } })

    ctx.body = { err: false, msg: 'SUCCESS' }
})

// 查询配置
router.post('/queryconfig', async function (ctx, next) {
    // 检查入参
    if (!ctx.request.body || !ctx.tokenVerify) {
        ctx.body = { err: true, msg: '查询参数错误' }
        return
    }
    const res = await new ConfigModel().query({
        ProjectionExpression: '#code,#config',
        KeyConditionExpression: 'username = :username',
        ExpressionAttributeNames: {
            '#code': 'code',
            '#config': 'config'
        },
        ExpressionAttributeValues: {
            ':username': ctx.tokenVerify.username
        }
    })
    ctx.body = { err: false, Items: res.Items }
})

// 获取配置信息
router.post('/getconfig', async function (ctx, next) {
    // 检查入参
    let inparam = ctx.request.body
    if (!inparam || !inparam.sid) {
        ctx.body = { err: true, msg: '查询参数错误' }
        return
    }
    // 校验SID
    const user = await new UserModel().sid(inparam)
    if (user) {
        let query = {
            ProjectionExpression: '#code,#config',
            KeyConditionExpression: 'username = :username',
            ExpressionAttributeNames: {
                '#code': 'code',
                '#config': 'config'
            },
            ExpressionAttributeValues: {
                ':username': user.username
            }
        }
        if (inparam.code) {
            query.KeyConditionExpression += ' AND #code = :code'
            query.ExpressionAttributeValues[':code'] = inparam.code
        }
        const res = await new ConfigModel().query(query)
        if (inparam.code) {
            ctx.body = { err: false, config: res.Items[0] }
        } else {
            ctx.body = { err: false, configs: res.Items }
        }
    } else {
        ctx.body = { err: true, msg: 'sid不正确' }
    }
})

module.exports = router