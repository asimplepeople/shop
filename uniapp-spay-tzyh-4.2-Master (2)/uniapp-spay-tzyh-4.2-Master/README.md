# 基于 uniapp+vue3

## 重要事项

项目运行支持添加 `--mode` 参数，格式为 `--mode development`

### 运行开发环境，获取 env/.env.development 开发环境变量

微信小程序

```sh
npm run dev standard-mp-weixin
or
npm run dev standard-mp-weixin --mode development
```

H5

```sh
npm run dev standard
or
npm run dev standard --mode development
```

### 打包测试环境，获取 env/.env.test 测试环境变量

微信小程序

```sh
npm run build standard-mp-weixin --mode test
```

H5

```sh
npm run build standard --mode test
```

### 打包生产环境，获取 env/.env.production 生产环境变量

微信小程序

```sh
npm run build standard-mp-weixin
or
npm run build standard-mp-weixin --mode production
```

H5

```sh
npm run build standard
or
npm run build standard --mode production
```

## 技术栈

-   编程语言：[TypeScript 4.x](https://www.typescriptlang.org/zh/) + [JavaScript](https://www.javascript.com/)
-   构建工具：[Vite 2.x](https://cn.vitejs.dev/)
-   前端框架：[Vue 3.x](https://v3.cn.vuejs.org/)
-   路由工具：[Vue Router 4.x](https://next.router.vuejs.org/zh/index.html)
-   状态管理：[Vuex 4.x](https://next.vuex.vuejs.org/)
-   CSS 预编译：[Stylus](https://stylus-lang.com/) / [Sass](https://sass.bootcss.com/documentation) / [Less](http://lesscss.cn/)
-   HTTP 工具：[Axios](https://axios-http.com/)
-   Git Hook 工具：[husky](https://typicode.github.io/husky/#/) + [lint-staged](https://github.com/okonet/lint-staged)
-   代码规范 [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/)
-   提交规范：[Commitizen](http://commitizen.github.io/cz-cli/) + [Commitlint](https://commitlint.js.org/#/)

## 组件库

uniapp 的组件:

[基础组件](https://uniapp.dcloud.io/component/README)

[扩展组件](https://uniapp.dcloud.io/component/uniui/uni-ui)

[演示](https://hellouniapp.dcloud.net.cn/pages/extUI/forms/forms)

## 浏览器支持

本地开发推荐使用`Chrome 80+` 浏览器

支持现代浏览器, 不支持 IE

|     IE      |      Edge       |     Firefox     |     Chrome      |     Safari      |
| :---------: | :-------------: | :-------------: | :-------------: | :-------------: |
| not support | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

### 提交规范

-   `feat` 增加新功能
-   `fix` 修复问题/BUG
-   `style` 代码风格相关无影响运行结果的
-   `perf` 优化/性能提升
-   `refactor` 重构
-   `revert` 撤销修改
-   `test` 测试相关
-   `docs` 文档/注释
-   `build` 对构建系统或者外部依赖项进行了修改
-   `chore` 依赖更新/脚手架配置修改等
-   `workflow` 工作流改进
-   `ci` 持续集成
-   `types` 类型定义文件更改
-   `wip` 开发中

使用项目配置命令提交

```sh
git add .
npm run commit // 填提交信息，代码规范校验
git push
```

### 支持 mock

vite.config.ts

```sh
viteMockServe({
    mockPath: "mock",
    localEnabled: true, // 本地开关
    prodEnabled: false,
    injectCode: `
            import { setupProdMockServer } from './mock/mockProdServer';
            setupProdMockServer();
        `,
}),
```

详细功能见文章：[vue3+vite2+typescript+mock 移动端框架搭建](http://www.vuxd.cn/post/vite-vue3-typescript-mock.html)

## 快速开始

### 安装依赖

```sh
npm install
# or
yarn add
```

### 启动项目

```sh
// xxxx 为环境变量：development test production
// h5
npm run dev taizhou
// 微信小程序
npm run dev taizhou-mp-weixin(目前台州没有小程序，如需增加在package.json 增加配置)
```

### 项目打包

```sh
// xxxx 为环境变量：development test production
// h5
npm run build taizhou
// 微信小程序
npm run build taizhou-mp-weixin(目前台州没有小程序，如需增加在package.json 增加配置)
```

## 多银行配置

对应银行如果有多个平台需兼容：例如 h5、微信小程序，需加对应平台配置如下的 package.json 增加配置

## 多环境配置

```sh
在每个环境配置文件配置：env/.env.development、env/.env.test、env/.env.production

#湖南农信
// 小程序名称
VITE_TAIZHOU_APPNAME = 台州银行
// 主题色
VITE_TAIZHOU_THEME = #64C4D9
// 小程序appid
VITE_TAIZHOU_APPID = wx443af414e8b380b5
// 小程序请求的接口路径
VITE_TAIZHOU_APIDOMAIN = https://xysk.tzcb.com
// 小程序打包文件夹
VITE_TAIZHOU_STATIC = /webapp
```

运行 env/.env.development 开发环境变量

```sh
npm run dev taizhou --mode development
```

运行 env/.env.test 测试环境变量

```sh
npm run build taizhou --mode test
```

运行 env/.env.production 生产环境变量

```sh
npm run build taizhou --mode production
```

### package.json 增加配置

```sh
// 多银行在scripts继续添加新银行
"uni-app": {
    "scripts": {
        "hnnxbank": {
            "title": "湖南农信银行",
            "env": {
                "UNI_PLATFORM": "h5",
                "BANK_CODE": "hnnxbank",
                "APP_BASE_URL": "webapp"
            },
            "define": {
                "HNNXBANK": true
            }
        },
        "mp-weixin-hnnxbank": {
            "title": "湖南农信银行",
            "env": {
                "UNI_PLATFORM": "mp-weixin",
                "BANK_CODE": "hnnxbank",
                "APP_BASE_URL": "webapp"
            },
            "define": {
                "HNNXBANK": true
            }
        }
},
```

### 使用配置项

```sh
// HNNXBANK 对应package.json 的 uni-app.hnnxbank.define.HNNXBANK

// #ifdef HNNXBANK
// 湖南农信
// #endif

// #ifdef HNNXBANK || QSBANK
// 对应银行逻辑
// #endif
```

### 读取环境变量

```sh
const BANK_CODE = process.env.BANK_CODE;
console.log('BANK_CODE', BANK_CODE);
```

### 读取配置

```sh
import config from 'config/config';

config = {
    bankCode: processEnv.BANK_CODE,
    env: VITE_ENV,
    name: getViteEnv('appName'),
    theme: getViteEnv('theme'),
    curAppid: getAppId(),
    appid: getViteEnv('appid'),
    api: getViteEnv('api'),
    apiBase: getViteEnv('apiBase'),
}
```

## 对应平台资源加载

静态资源路径：public/银行编码/平台

env/.env.development
修改对应平台静态资源配置：VITE_HNNXBANK_STATIC = /public/h5

env/.env.production
修改对应平台静态资源配置：VITE_HNNXBANK_STATIC = /webapp

## 多银行换肤

在目录 src/assets/css 新增对应银行 bankCode 的 xxxxx.scss 文件，例如：hnnxbank.scss

文件内添加的 css 变量可以全局读取

## 接口请求

在目录 src/services 新增对应模块的 service，调用 Ajax 参考 register.ts 文件

### 支持 mock

在目录 mock 新建对应模块的.ts 文件，格式参考 register.ts 文件；

是否本地启动 mock 开关在 vite.config.ts 的 plugins 下

```
viteMockServe({
    mockPath: 'mock',
    localEnabled: true, // true为本地启动，false为本地关闭
    prodEnabled: false,
    injectCode: `
            import { setupProdMockServer } from './mock/mockProdServer';
            setupProdMockServer();
        `,
}),
```

## 存储数据状态

在目录 src/store 新建对应 module 的 store 文件，在 index.ts 中引入到 modules

```
import { createStore } from 'vuex';
import registerStore from './registerStore';

export default createStore({
    modules: {
        registerStore,
    },
});
```

### store 使用方法

```
import { useStore } from 'vuex';

setup(props, context) {
    const store = useStore();
    console.log('store', store);
    store.dispatch('setMerchantInfo', {
        userId: 1111,
        userName: 'hnnx',
    });
    console.log('merchantInfo', store.state.merchantStore.merchantInfo);
}
```

## 生命周期

建议使用 onLoad, onShow，可以兼容小程序

```
import { onLoad, onShow } from '@dcloudio/uni-app';

setup() {
    onLoad(() => {
        console.log('生命周期---等同于小程序的 onLoad');
    });

    onShow(() => {
        console.log('生命周期---等同于小程序的 onShow');
    });
}
```
