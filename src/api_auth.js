// 系统配置参数
const config = require('config')
// 路由相关
const Router = require('koa-router')
const router = new Router()
// 认证相关
const jwt = require('jsonwebtoken')
// 工具相关
const _ = require('lodash')
const uuidv4 = require('uuid/v4')
// 日志相关
const log = require('tracer').colorConsole({ level: config.log.level })
// 持久层相关
const UserCheck = require('./lib/UserCheck')
const UserModel = require('./model/UserModel')
const expired = 60 * 60 * 24    // 默认TOKEN一天有效期

// 用户注册
router.post('/reg', async function (ctx, next) {
    // 入参检查
    inparam = ctx.request.body
    new UserCheck().check(inparam)
    // 检查用户是否已经存在
    const exist = await new UserModel().isExist({
        ProjectionExpression: 'username',
        KeyConditionExpression: "username = :username",
        ExpressionAttributeValues: {
            ':username': inparam.username
        }
    })
    // 不存在则新增
    if (!exist) {
        await new UserModel().putItem(inparam)
        ctx.body = { err: false, msg: 'Y' }
    } else {
        ctx.body = { err: true, msg: '用户已存在' }
    }

})

// 用户登录
router.use('/auth', async function (ctx, next) {
    let inparam = ctx.request.body
    new UserCheck().check(inparam)
    let user = await new UserModel().login(inparam)
    if (user) {
        const tokenSign = jwt.sign({ username: user.username, role: 'admin', iat: Date.now(), exp: Math.floor(Date.now() / 1000) + expired }, config.auth.secret)
        user.tokenSign = tokenSign   // 向后面的路由传递TOKEN加密令牌
        ctx.user = user
        next()
    } else {
        ctx.status = 200
        ctx.body = { err: true, msg: '用户名或密码错误' }
    }
})

// 向前端传递TOKEN加密令牌
router.post('/auth', function (ctx, next) {
    ctx.body = { err: false, user: ctx.user }
})

// 更新服务标识
router.get('/updatesid', async function (ctx, next) {
    // 检查入参
    if (!ctx.tokenVerify) {
        ctx.body = { err: true, msg: '入参不合法' }
        return
    } else {
        const newsid = uuidv4()
        await new UserModel().updateItem({
            Key: {
                'username': ctx.tokenVerify.username
            },
            UpdateExpression: "SET sid = :sid",
            ExpressionAttributeValues: {
                ':sid': newsid
            }
        })
        ctx.body = { err: false, sid: newsid }
    }
})

module.exports = router