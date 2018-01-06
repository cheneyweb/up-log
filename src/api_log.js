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
const LogModel = require('./model/LogModel')

// 上传日志
router.post('/uplog', async function (ctx, next) {
    // 检查入参
    if (!ctx.request.body || !ctx.request.body.sid || ctx.request.body.sid.length != 36) {
        ctx.body = { err: true, msg: 'sid不正确' }
        return
    }
    if (!ctx.request.body.log) {
        ctx.body = { err: true, msg: 'log不能为空' }
        return
    }
    // 转换检查每个输入字段
    for (let key in ctx.request.body) {
        if (typeof ctx.request.body[key] == 'object') {
            ctx.request.body[key] = JSON.stringify(ctx.request.body[key])
        }
        if (ctx.request.body[key].length > 2000) {
            ctx.body = { err: true, msg: '单字段不能超过2000字符' }
            return
        }
    }
    // 校验SID
    let res = await new UserModel().sid(ctx.request.body)
    // 正确则写入日志
    if (res) {
        ctx.request.body.username = res.username
        await new LogModel().putItem(ctx.request.body)
        ctx.body = { err: false, msg: 'Y' }
    } else {
        ctx.body = { err: true, msg: 'sid不正确' }
    }
})

// 查询日志
router.post('/querylog', async function (ctx, next) {
    // 检查入参
    if (!ctx.request.body || !ctx.request.body.createdAt || !ctx.tokenVerify) {
        ctx.body = { err: true, msg: '查询参数错误' }
        return
    }
    const res = await new LogModel().page({
        KeyConditionExpression: 'username = :username AND createdAt between :createdAt0 AND :createdAt1',
        ExpressionAttributeValues: {
            ':username': ctx.tokenVerify.username,
            ':createdAt0': ctx.request.body.createdAt[0],
            ':createdAt1': ctx.request.body.createdAt[1]
        }
    }, { limit: 1000, startKey: null, lastEvaluatedKeyTemplate: ['username', 'createdAt'] })
    ctx.body = { err: false, Items: res.Items.reverse() }
})

module.exports = router