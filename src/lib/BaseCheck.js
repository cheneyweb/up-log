class BaseCheck {
    checkProperties(properties, body) {
        let errorArr = []
        for (let item of properties) {
            let { name, type, min, max, equal } = item
            let value = body[name]
            let checkErr = this.checkProperty(value, type, min, max, equal)
            if (checkErr == false) errorArr.push(name)
        }
        return errorArr
    }
    checkProperty(value, type, min, max, equal) {
        switch (type) {
            case "S": {
                if (!value) return false
                if (min && value.length < min) return false
                if (max && value.length > max) return false
                if (equal) return Object.is(value, equal)
                return true
            }
            case "N": {
                if (!value && value !== 0) return false
                let e = this.parseFloat(value)
                if (!e && e !== 0) return false
                if (min && v < min) return false
                if (max && v > max) return false
                if (equal) return Object.is(v, +equal)
                return true
            }
            case "J": {
                if (!value) return false
                return this.parseJSON(value)
            }
            case "REG": {
                if (!value && value !== 0) return false
                return equal.test(value.toString())
            }
            case "NS": {
                if (!value) return true
                let strLength = value.length
                if (min && strLength < min) return false
                if (max && strLength > max) return false
                if (equal) return Object.is(value, equal)
                return true
            }
            case "NN": {
                if (!value) return true
                let e = this.parseFloat(value)
                if (!e && e != 0) return false
                if (min && v < min) return false
                if (max && v > max) return false
                if (equal) return Object.is(v, +equal)
                return true
            }
            case "NREG": {
                if (!value) return true
                return equal.test(value.toString())
            }
            default: {
                return false
            }
        }
    }
}

module.exports = BaseCheck