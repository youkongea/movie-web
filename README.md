# movie-web

一个常规的视频管理网站，后端渲染页面，前端使用Bootstrap组织样式。

## 使用

1. 新建名为movie的数据库并连接
2. 输入`node app.js`命令后启动于`localhost:8080`
3. 输入`gulp server`启动热重载，代理于`localhost:5000`

## 特性

* 持久会话采用cookie和session，信息使用bcrypt加密
* 异步编程采用传统的回调函数形式
* 根据账户权限决定后台管理页的可用性
* 支持同步豆瓣电影API获取视频信息
* 内置评论功能
* 内置搜索功能
* 支持自定义视频封面
* 开发模式下采用gulp实现热重载

## 证书

[MIT](https://opensource.org/licenses/MIT)