const BaseModel = require('./BaseModel')

/**
 * 实际业务子类，继承于BaseModel基类
 */
module.exports = class ConfigModel extends BaseModel {
    constructor() {
        super()
        // 设置表名
        this.params = {
            TableName: 'up-config'
        }
        // 设置对象属性
        this.item = {
            ...this.baseitem,
            username: 'NULL!',
            code: 'NULL!'
        }
    }
}
