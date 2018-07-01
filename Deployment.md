# 服务端代码的部署
- 阿里云服务器  
- CentOS 系统  
- Node.js  
## 0 安装wget工具，方便下载资源部
```
yum install wget
```
1 安装
```
yum install 全部安装
yum install package1 安装指定的安装包package1
yum groupinsall group1 安装程序组group1
```
2 更新和升级
```
yum update 全部更新
yum update package1 更新指定程序包package1
yum check-update 检查可更新的程序
yum upgrade package1 升级指定程序包package1
yum groupupdate group1 升级程序组group1
```
3 查找和显示
```
yum info package1 显示安装包信息package1
yum list 显示所有已经安装和可以安装的程序包
yum list package1 显示指定程序包安装情况package1
yum groupinfo group1 显示程序组group1信息yum search string 根据关键字string查找安装包
```
4 删除程序
```
yum remove &#124; erase package1 删除程序包package1
yum groupremove group1 删除程序组group1
yum deplist package1 查看程序package1依赖情况
```

## 1Xshell
> 服务器远程管理工具

## 2Xftp  
> 服务器文件上传与下载工具

## 3Node.js

1.下载源码（官网查看最新版本链接）

```
wget https://nodejs.org/dist/v8.11.1/node-v8.11.1.tar.gz

```
2.解压源码
```
tar xzvf node-v* && cd node-v*
```
注意解压缩的文件名称与现存的关系，不要弄混了

3.安装必要的编译软件
```
yum install gcc gcc-c++
```
4.编译
```
cd ./configure
make
```
5.编译&安装
```
make install

```

## [3打包与部署](http://eggjs.org/zh-cn/core/deployment.html)
- egg.js

### 3.1应用部署
在本地开发时，我们使用 egg-bin dev 来启动服务，但是在部署应用的时候不可以这样使用。因为 egg-bin dev 会针对本地开发做很多处理，而生产运行需要一个更加简单稳定的方式。所以本章主要讲解如何部署你的应用。

一般从源码代码到真正运行，我们会拆分成构建和部署两步，可以做到一次构建多次部署。

### 3.2构建
JavaScript 语言本身不需要编译的，构建过程主要是下载依赖。但如果使用 TypeScript 或者 Babel 支持 ES6 以上的特性，那就必须要这一步了。

一般安装依赖会指定 `NODE_ENV=production` 或 `npm install --production` 只安装 dependencies 的依赖。因为 devDependencies 中的模块过大而且在生产环境不会使用，安装后也可能遇到未知问题。

```
$ cd baseDir
$ npm install --production
$ tar -zcvf ../release.tgz .
```
构建完成后打包成 tgz 文件，部署的时候解压启动就可以了。
cd baseDir
```
tar xzvf release.tgz
```

增加构建环节才能做到真正的一次构建多次部署，理论上代码没有改动的时候是不需要再次构建的，可以用原来的包进行部署，这有着不少好处：

构建依赖的环境和运行时是有差异的，所以不要污染运行时环境。
可以减少发布的时间，而且易回滚，只需要把原来的包重新启动即可。
### 3.2部署
服务器需要预装 Node.js，框架支持的 Node 版本为 >= 8.0.0。

框架内置了 `egg-cluster` 来启动 Master 进程，Master 有足够的稳定性，不再需要使用 pm2 等进程守护模块。

同时，框架也提供了 egg-scripts 来支持线上环境的运行和停止。

首先，我们需要把 egg-scripts 模块作为 dependencies 引入：

```
$ npm i egg-scripts --save
```
添加 npm scripts 到 package.json：

{
  "scripts": {
    "start": "egg-scripts start --daemon",
    "stop": "egg-scripts stop"
  }
}
这样我们就可以通过 npm start 和 npm stop 命令启动或停止应用。

注意：egg-scripts 不支持 Windows 系统。

### 3.3启动命令
```
$ egg-scripts start --port=7001 --daemon --title=egg-server-showcase
```
如上示例，支持以下参数：

```
--port=7001 端口号，默认会读取环境变量 process.env.PORT，如未传递将使用框架内置端口 7001。
--daemon 是否允许在后台模式，无需 nohup。若使用 Docker 建议直接前台运行。
--env=prod 框架运行环境，默认会读取环境变量 process.env.EGG_SERVER_ENV， 如未传递将使用框架内置环境 prod。
--workers=2 框架 worker 线程数，默认会创建和 CPU 核数相当的 app worker 数，可以充分的利用 CPU 资源。
--title=egg-server-showcase 用于方便 ps 进程时 grep 用，默认为 egg-server-${appname}。
--framework=yadan 如果应用使用了自定义框架，可以配置 package.json 的 egg.framework 或指定该参数。
--ignore-stderr 忽略启动期的报错。
所有 egg-cluster 的 Options 都支持透传，如 --https 等。
更多参数可查看 egg-scripts 和 egg-cluster 文档。
```

### 3.4启动配置项
你也可以在 config.{env}.js 中配置指定启动配置。

// config/config.default.js

```exports.cluster = {
  listen: {
    port: 7001,
    hostname: '127.0.0.1',
    // path: '/var/run/egg.sock',
  }
}
```
`path，port，hostname` 均为 `server.listen` 的参数，`egg-scripts` 和 `egg.startCluster` 方法传入的 port 优先级高于此配置。

### 3.5停止命令
```
$ egg-scripts stop [--title=egg-server]
```
该命令将杀死 master 进程，并通知 worker 和 agent 优雅退出。

支持以下参数：

`--title=egg-server` 用于杀死指定的 egg 应用，未传递则会终止所有的 Egg 应用。
你也可以直接通过 `ps -eo "pid,command" | grep "--type=egg-server"` 来找到 master 进程，并 kill 掉，无需 kill -9。

## 4监控
我们还需要对服务进行性能监控，内存泄露分析，故障排除等。

业界常用的有：

Node.js 性能平台（alinode）
Node.js 性能平台 是面向所有 Node.js 应用提供 性能监控、安全提醒、故障排查、性能优化 等服务的整体性解决方案，提供完善的工具链和服务，协助开发者快速发现和定位线上问题。

### 4.1安装 Runtime
AliNode Runtime 可以直接替换掉 `Node.js Runtime`，对应版本参见文档。

全局安装方式参见文档。

有时候，同机会部署多个项目，期望多版本共存时，则可以把 Runtime 安装到当前项目：

```
$ npm i nodeinstall -g
$ nodeinstall --install-alinode ^3
```
nodeinstall 会把对应版本的 alinode 安装到项目的 node_modules 目录下。

注意：打包机的操作系统和线上系统需保持一致，否则对应的 Runtime 不一定能正常运行。

### 4.2安装及配置
我们提供了 `egg-alinode` 来快速接入，无需安装 agenthub 等额外的常驻服务。

安装依赖：
```
$ npm i egg-alinode --save
```
开启插件：
```
// config/plugin.js
exports.alinode = {
  enable: true,
  package: 'egg-alinode',
};
```
配置：
```
// config/config.default.js
exports.alinode = {
  // 从 `Node.js 性能平台` 获取对应的接入参数
  appid: '<YOUR_APPID>',
  secret: '<YOUR_SECRET>',
};
```
### 4.3启动应用
`npm scripts` 配置的 start 指令无需改变，通过`egg-scripts` 即可。

启动命令需使用 npm start，因为 `npm scripts` 执行时会把 `node_module/.bin` 目录加入 PATH，故会优先使用当前项目执行的 Node 版本。

启动后会看到 master 日志包含以下内容：

$ [master] node version v8.9.4
$ [master] alinode version v3.8.4
# 访问控制台

### 5安装mongodb
```
centos7安装MongoDB3.4
简介
MongoDB 是一个介于关系数据库和非关系数据库之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的。他支持的数据结构非常松散，是类似json的bson格式，因此可以存储比较复杂的数据类型。Mongo最大的特点是他支持的查询语言非常强大，其语法有点类似于面向对象的查询语言，几乎可以实现类似关系数据库单表查询的绝大部分功能，而且还支持对数据建立索引。

Packages包说明
MongoDB官方源中包含以下几个依赖包：
mongodb-org: MongoDB元数据包，安装时自动安装下面四个组件包：
1.mongodb-org-server: 包含MongoDB守护进程和相关的配置和初始化脚本。
2.mongodb-org-mongos: 包含mongos的守护进程。
3.mongodb-org-shell: 包含mongo shell。
4.mongodb-org-tools: 包含MongoDB的工具： mongoimport, bsondump, mongodump, mongoexport, mongofiles, mongooplog, mongoperf, mongorestore, mongostat, and mongotop。

安装步骤

1.配置MongoDB的yum源

创建yum源文件：
vim /etc/yum.repos.d/mongodb-org-3.4.repo
添加以下内容：
[mongodb-org-3.4]  
name=MongoDB Repository  
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/3.4/x86_64/  
gpgcheck=1  
enabled=1  
gpgkey=https://www.mongodb.org/static/pgp/server-3.4.asc

这里可以修改 gpgcheck=0, 省去gpg验证

安装之前先更新所有包 ：yum update （可选操作）

2.安装MongoDB
安装命令：
yum -y install mongodb-org



 

安装完成后

查看mongo安装位置 whereis mongod

查看修改配置文件 ： vim /etc/mongod.conf
 
3.启动MongoDB 
启动mongodb ：systemctl start mongod.service
停止mongodb ：systemctl stop mongod.service

查到mongodb的状态：systemctl status mongod.service



4.外网访问需要关闭防火墙：
CentOS 7.0默认使用的是firewall作为防火墙，这里改为iptables防火墙。
关闭firewall：
systemctl stop firewalld.service #停止firewall
systemctl disable firewalld.service #禁止firewall开机启动

5.设置开机启动
systemctl enable mongod.service

6.启动Mongo shell
命令：mongo 

查看数据库：show dbs



7.设置mongodb远程访问：
编辑mongod.conf注释bindIp,并重启mongodb.
vim /etc/mongod.conf
 

重启mongodb：systemctl restart mongod.service
```