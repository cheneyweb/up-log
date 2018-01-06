# up-log
基于UP无服务部署的云端共享日志系统

[传送门：UPLOG官网文档](http://uplog.xserver.top)

框架目录结构
>
    ├── Makefile                构建NODE8编码文件
    ├── app.js                  应用入口
    ├── config                  系统配置
    │   ├── default.json
    │   ├── develop.json
    │   └── production.json
    ├── node-v8.9.3-linux-x64   NODE8源码
    ├── node_modules            外部模块
    ├── package.json
    ├── src                     应用源码（编码工作区）
    │   ├── api_auth.js         业务控制器
    │   ├── api_log.js          业务控制器
    │   ├── lib                 自定义工具库
    │   └── model               业务模型
    └── up.json                 UP配置

帮助联系
>
	作者:cheneyxu
	邮箱:457299596@qq.com
	QQ:457299596

更新日志
>
	2018.01.07:初版
