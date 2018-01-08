// 系统配置参数
const config = require('config')
// 路由相关
const Router = require('koa-router')
const router = new Router()
// 认证相关
const jwt = require('jsonwebtoken')
const Vaptcha = require('vaptcha-sdk')
const vaptcha = new Vaptcha(config.vaptcha.vid, config.vaptcha.key)
const nodemailer = require('nodemailer')
// 工具相关
const _ = require('lodash')
const uuidv4 = require('uuid/v4')
// 日志相关
const log = require('tracer').colorConsole({ level: config.log.level })
// 持久层相关
const UserCheck = require('./lib/UserCheck')
const UserModel = require('./model/UserModel')
const expired = 60 * 60 * 24    // 默认TOKEN一天有效期
// 缓存相关
const CacheUtil = require('./lib/CacheUtil')

// 人机验证码模块
router.get('/vaptcha/getVaptcha', async function (ctx, next) {
    ctx.body = await vaptcha.getChallenge()
})

router.get('/vaptcha/getDownTime', async function (ctx, next) {
    ctx.body = await vaptcha.downTime(req.query.data)
})

// 发送邮件
router.post('/sendemail', async function (ctx, next) {
    inparam = ctx.request.body
    if (!inparam.username) {
        ctx.body = { err: true, msg: '入参不合法' }
        return
    }
    // 检查用户是否已经存在
    const exist = await new UserModel().isExist({
        ProjectionExpression: 'username',
        KeyConditionExpression: "username = :username",
        ExpressionAttributeValues: {
            ':username': inparam.username
        }
    })
    if (exist) {
        ctx.body = { err: true, msg: '用户已存在' }
        return
    }
    let captcha = randomNum(1000, 9999)
    let transporter = nodemailer.createTransport({
        host: 'smtp.mxhichina.com',
        port: 465,
        secure: true,
        auth: {
            user: config.email.user,
            pass: config.email.pass
        }
    });

    let mailOptions = {
        from: '"UPLOG" <captcha@xserver.top>',
        to: inparam.username,
        subject: `UPLOG注册验证码:${captcha}`,
        text: `感谢您注册UPLOG云日志服务，这是您的邮箱验证码：<b>${captcha}</b>`,
        html: `感谢您注册UPLOG云日志服务，这是您的邮箱验证码：<b>${captcha}</b>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return log.error(error)
        }
        new CacheUtil().set(inparam.username, captcha.toString())
    });
})

// 用户注册
router.post('/reg', async function (ctx, next) {
    inparam = ctx.request.body
    try {
        await vaptcha.validate(inparam.challenge, inparam.token)
    } catch (error) {
        log.error(error)
        ctx.body = { err: true, msg: '验证失败' }
        return
    }
    // 入参检查
    new UserCheck().check(inparam)
    // 邮箱验证码检查
    const emailcode = await new CacheUtil().get(inparam.username)
    if (emailcode != inparam.emailcode) {
        ctx.body = { err: true, msg: '邮箱验证码不正确' }
        return
    }
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

// 随机数
function randomNum(min, max) {
    let range = max - min;
    let rand = Math.random();
    let num = min + Math.round(rand * range); //四舍五入
    return num;
}

module.exports = router