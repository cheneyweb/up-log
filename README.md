# up-log
基于UP无服务部署的云端应用开发服务

[传送门：UPLOG官网](http://up.xserver.top)

使用说明
```javascript
    【POST】 https://dl57vasdud645.cloudfront.net/uplog   //通过此URL上传日志
    
    【BODY】 {"sid":"服务标识","log":"日志内容", ...}       // application/json
    
    【说 明】sid是由平台提供的服务标识，log为必须的日志内容，其余可拓展任意字段
```
帮助联系
>
	作者:cheneyxu
	邮箱:457299596@qq.com
	QQ:457299596

更新日志
>
	2018.01.07:初版
	2018.01.08:增加注册邮箱校验
	2018.01.30:更新koa-xlog/koa-xerror/koa-xauth中间件
	2018.02.11:更新BaseModel数据库操作基类，批量插入支持递归插入失败数据
	2018.02.12:升级node环境为8.9.4
	2018.03.06:增加心跳
	2018.03.07:更新koa-xerror和koa-xauth
	2018.04.04:原生支持node8.10.0
	2018.10.15:升级所有依赖
