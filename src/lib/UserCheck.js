const uuidv4 = require('uuid/v4')
const BaseCheck = require ('./BaseCheck')
const RegEnum = require ('./RegEnum')

class UserCheck extends BaseCheck{
    check(inparam) {
        let errArr = this.checkProperties([
            { name: "username", type: "REG", min: null, max: null, equal: RegEnum.EMAIL },
            { name: "password", type: "S", min: 6, max: 16 }
        ], inparam)
        if (errArr.length > 0) {
            throw { err: true, msg: errArr }
        }
        inparam.sid = uuidv4()
    }
}

module.exports = UserCheck