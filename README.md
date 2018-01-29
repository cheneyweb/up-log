# up-log
基于UP无服务部署的云端共享日志系统

[传送门：UPLOG官网](http://uplog.xserver.top)

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
