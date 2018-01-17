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
    if (!inparam || !inparam.sid || inparam.sid.length != 36) {
        ctx.body = { err: true, msg: 'sid不正确' }
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
    // 校验SID
    const res = await new UserModel().sid(inparam)
    // 正确则写入配置
    if (res) {
        for (let item of inparam.configs) {
            const username = res.username
            const code = item.code
            const config = item.config
            new ConfigModel().putItem({ username, code, config })
        }
        ctx.body = { err: false, msg: 'SUCCESS' }
    } else {
        ctx.body = { err: true, msg: 'sid不正确' }
    }
})

// 查询配置
router.post('/queryconfig', async function (ctx, next) {
    // 检查入参
    if (!ctx.request.body || !ctx.tokenVerify) {
        ctx.body = { err: true, msg: '查询参数错误' }
        return
    }
    if (!ctx.request.body.startKey || ctx.request.body.startKey == 'undefined') {
        ctx.request.body.startKey = null
    }
    const res = await new ConfigModel().page({
        KeyConditionExpression: 'username = :username',
        ExpressionAttributeValues: {
            ':username': ctx.tokenVerify.username
        }
    }, { limit: 100, startKey: ctx.request.body.startKey, lastEvaluatedKeyTemplate: ['username', 'code'] })
    ctx.body = { err: false, Items: res.Items, LastEvaluatedKey: res.LastEvaluatedKey }
})

// 获取单个配置
router.post('/getconfig', async function (ctx, next) {
    // 检查入参
    if (!ctx.request.body || !ctx.request.body.sid || !ctx.request.body.code || !ctx.tokenVerify) {
        ctx.body = { err: true, msg: '查询参数错误' }
        return
    }
    if (!ctx.request.body.startKey || ctx.request.body.startKey == 'undefined') {
        ctx.request.body.startKey = null
    }
    // 校验SID
    const user = await new UserModel().sid(ctx.request.body)
    if (user) {
        const res = await new ConfigModel().getItem({
            Key: { 'username': user.username, 'code': code }
        })
        ctx.body = { err: false, config: res.Item.config }
    } else {
        ctx.body = { err: true, msg: 'sid不正确' }
    }
})

module.exports = router