# blog-api
## 前后端分离项目：后端只提供API接口

我们推荐直接使用脚手架，只需几条简单指令，即可快速生成项目:
## 1 项目初始化方法1：使用脚手架快速构建
```
$ npm i egg-init -g
$ egg-init egg-example --type=simple
$ cd egg-example
$ npm i
启动项目:

$ npm run dev
$ open localhost:7001
```
## 1 项目初始化方法2：自定义安装
```
mkdir egg-news
cd egg-news
npm init -y
cnpm i egg --save
cnpm i egg-bin --save-dev
```
### 1.1 编写配置文件
`/config.default.js`

// use for cookie sign key, should change to your own and keep security
> 为`cookie`设置加密验证码
```
config.keys = appInfo.name + '_1525493952176_3439';
```
### 1.2 设置数据库连接
`/config.default.js`
```
config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1/alexshan',
      options: {}
    }
  };
```

### 1.3 将数据库挂载到app上

// {app_root}/config/plugin.js
```
exports.mongoose = {
  enabled: true,
  package: 'egg-mongoose'
};
```

## 2 添加 npm `scripts` 到 package.json：
```
"scripts": {
    "dev": "egg-bin dev"
}

npm run dev //启动项目
```
### 2.1 部署`run`

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

```bash
$ npm start
$ npm stop
```


## 3 启动数据库`mongodb`
```bash
mongod --dbpath=c:\Mongondb\data
```

## 4 开启 validate 插件 egg-validate 作为 validate 插件的示例。
```
npm i egg-validate --save

// config/plugin.js
exports.validate = {
  enable: true,
  package: 'egg-validate',
};

```

## 5 跑通路由
```
├─app
│  │─router.js
│  ├─controller
│  │      news.js
├─config
│      config.default.js
|─package.json

```

### 5.1 配置路由`router`
app/router.js
> controller.home.index 代表controller文件夹下面home.js文件中的`index`函数
```
module.exports = app => {
    const { router, controller } = app;
    router.get('/', controller.home.index);
}
```

### 5.2 编写控制器`controller`
app\controller\home.js
```
const { Controller } = require('egg');
class HomeController extends Controller {
    async index() {
        this.ctx.body = 'hello world';
    }
}
module.exports = HomeController;
```

## 6 静态文件中间件
```
Egg 内置了 static 插件
static 插件默认映射 /public/ -> app/public/ 目录
把静态资源都放到 app/public 目录即可直接引用
```

## 7 使用模板引擎
```
├─app
│  │─router.js
│  ├─controller
│  │      news.js   
│  ├─public
│  │  ├─css
│  │  │      bootstrap.css  
│  │  └─js
│  │          bootstrap.js         
│  └─view
│          news.ejs       
├─config
│   config.default.js
│   plugin.js
```

### 6.1 安装依赖的插件，支持多种模板`egg-view-ejs`
```
npm i egg-view-ejs -S
```
### **6.2 启用插件**
{ROOT}\config\plugin.js
```
exports.ejs = {
    enable: true,
    package: 'egg-view-ejs'
}
```
### 6.3 配置模板 
> 用安装的`egg-view-ejs`模板来处理`.ejs`类型文件
{ROOT}\config\config.default.js
```
exports.view = {
    defaultViewEngine: 'ejs',
    mapping: {
        '.ejs': 'ejs'
    }
}
```

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.

### 6.4 编写模板
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="/public/css/bootstrap.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>百度新闻列表</title>
</head>

<body>
    <div class="container">
        <div class="row">
            <div class="col-sm">
                <div class="card">
                    <div class="card-header">
                        百度新闻列表
                    </div>
                    <div class="card-block">
                        <ul class="list-group">
                            <%news.forEach(item=>{ %>
                                <li class="list-group-item">
                                    <a href="<%=item.url%>">
                                        <%=item.name%>
                                    </a>
                                </li>
                                <%})%>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
```

### 6.5 编写控制器 `NewsController`
{ROOT}\app\controller\home.js

```
const { Controller } = require('egg');
class HomeController extends Controller {
    async index() {
        const news = [
            {
                name: '魅族：高不成、低不就 15系列的求变生存恐怕不易',
                url: 'https://baijia.baidu.com/s?id=1599513253231710086&wfr=pc&fr=idx_lst'
            },
            {
                name: '从应届技术男到百度VP，这是低调到没百科的吴海锋首次受访',
                url: 'https://baijia.baidu.com/s?id=1599508189171446369&wfr=pc&fr=idx_lst'
            }
        ]
        await this.ctx.render('news', { news });//把数据传到模板中，news就成为模板中的一个属性，可以直接获取数据
    }
}
module.exports = HomeController;
```

## 7 读取远程接口服务
> 在实际应用中，Controller 一般不会自己产出数据，也不会包含复杂的逻辑，复杂的过程应抽象为业务逻辑层 Service。

### 7.1 添加配置
config.default.js
```
exports.news = {
    url: 'https://baijia.baidu.com' //远程数据接口
}
```

### 7.2 编写Service `this.ctx.curl`
app/service/news.js
```
const { Service } = require('egg');
class NewsService extends Service {
    //eggjs里内置 一个方法，用来读取远程 接口数据 this.ctx.curl
    //resut = {headers,data}
    //config 属性是this 的属性
    async fetch() {
        //console.log(this.ctx.helper)
        let { data } = await this.ctx.curl(this.config.news.url);
        data = data.toString();
        let news = [];
        let reg = /<a href="(\/s\?id=[^"]+)".+>([\s\S]+?)<\/a>/g;
        data.replace(reg, (matched, url, title) => {
            if (!title.includes('img') && !title.includes('查看详情'))
                news.push({
                    title,
                    url: 'https://baijia.baidu.com' + url,
                    time: new Date()
                    //time: this.ctx.helper.relative(new Date())
                });
        });
        return news;
    }
}
module.exports = NewsService;
```

### 7.3 编写控制层
//controller\news.js

```
const { Controller } = require('egg');
class NewsController extends Controller {
    async index() {
        const news = await this.ctx.service.news.fetch();
        await this.ctx.render('news.ejs', { news });
    }
}
module.exports = NewsController;
```

## 8. 扩展工具方法
- 框架提供了一种快速扩展的方式，只需在app/extend目录下提供扩展脚本即可
- Helper 函数用来提供一些实用的 utility 函数。
- 访问方式 通过 ctx.helper 访问到 helper 对象

app\extend\helper.js
```
const moment = require('moment');

moment.locale('zh-cn');//中文时间
exports.relative = time => moment(new Date(time)).fromNow();//相对时间
```

news.ejs
```
<%=helper.relative(item.time)%>
```

## 9. 中间件
打印请求的处理时间

app\middleware\time.js
```
module.exports = (options, app) => {
    return async function (ctx, next) {
        const start = Date.now();
        await next();
        console.log(options.name + (Date.now() - start) + ' ms'); //总耗时 100ms
    }
}
```
配置`options`

config.default.js
```
exports.middleware = [
    'time'
]
exports.time = {
    name: '总耗时:'
}
```

## 10. 单元测试`test`
- TDD 
> 测试驱动开发: 先写测试用例；需求需要非常明确和具体
```
assert.typeOf(foo,'string')
```
- BDD 
> 行为驱动开发：先实现需求，再编写测试用例
```
foo.should
```

### 10.1测试框架
`Mocha`
- 让你跑通测试框框

### 10.2断言库
`assert should`
- 用于断言库



测试文件应该放在项目根目录下的 test 目录下，并以 test.js 为后缀名，即 {ROOT}/test/*/.test.js。 请注意是放在项目的根目录下，而非app目录下 // {ROOT}/test/app/middleware/robot.test.js
```
const { app, mock, assert } = require('egg-mock/bootstrap');

describe('test/app/middleware/robot.test.js', () => {
  it('should block robot', () => {
    return app.httpRequest()
      .get('/')
      .set('User-Agent', "Baiduspider")
      .expect(403);
  });
});
```

## `CSRF` 跨域处理
> egg-cors
> 每次服务端直出时附加一个CSRFToken，存在客户端的cookie中，用户提交时，携带cookie访问
```
$ npm i egg-cors --save

// {app_root}/config/plugin.js
exports.cors = {
  enable: true,
  package: 'egg-cors',
};

```
//{app_root}/config/config.default.js
```
exports.security = {
  domainWhiteList: [ 'http://localhost:3000' ],
};
```

### Postman 
> 后台接口测试


### RESTful API
get  查询 /posts/
post 增加 /posts/:id
put  编辑 /posts/:id/edit
delete 删除 /posts/:id



[egg]: https://eggjs.org