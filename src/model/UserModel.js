const BaseModel = require('./BaseModel')
const _ = require('lodash')
/**
 * 实际业务子类，继承于BaseModel基类
 */
module.exports = class UserModel extends BaseModel {
    constructor() {
        super()
        // 设置表名
        this.params = {
            TableName: 'up-user'
        }
        // 设置对象属性
        this.item = {
            ...this.baseitem,
            username: 'NULL!',
            createdAt: Date.now()
        }
    }
    async login(inparam) {
        let res = await this.query({
            ProjectionExpression: 'username,sid',
            KeyConditionExpression: "username = :username",
            FilterExpression: 'password=:password',
            ExpressionAttributeValues: {
                ':username': inparam.username,
                ':password': inparam.password
            }
        })
        if (res.Items && !_.isEmpty(res.Items)) {
            return res.Items[0]
        }
        return null
    }
    async sid(inparam) {
        let res = await this.query({
            ProjectionExpression: 'username',
            IndexName: 'sid-index',
            KeyConditionExpression: 'sid = :sid',
            ExpressionAttributeValues: {
                ':sid': inparam.sid
            }
        })
        return res.Items ? res.Items[0] : null
    }
}
