// 缓存相关
const redis = require('redis')
const redisClient = redis.createClient({ url: 'redis://redis-19126.c1.ap-southeast-1-1.ec2.cloud.redislabs.com:19126' })

class CacheUtil {
    get(key) {
        return new Promise((reslove, reject) => {
            redisClient.get(key, (err, value) => {
                if (err) reject(err)
                reslove(value)
            })
        })
    }
    set(key, value) {
        return new Promise((reslove, reject) => {
            redisClient.set(key, value, (err) => {
                if (err) reject(err)
                reslove(value)
            })
        })
    }
}

module.exports = CacheUtil