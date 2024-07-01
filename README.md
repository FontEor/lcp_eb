# 物流开放平台控制台

## 安装依赖

```
使用 npm install --registry=http://registry.m.jd.com，该指令安装的不是一个确切的版本，可能会更新package-lock.json文件
```

```
如果依赖安装失败，就依次执行下面的指令
git config --global url."https://".insteadOf git://
```

## 本地开发 host

```
# 物流开放平台本地开发 host
# 本地内外网
127.0.0.1 test-cloud.jdl.com test-lcp.jdl.com
# yapi
11.51.194.248 cloud-yapi.jdl.cn

# passport
10.182.14.224 passport.jd.com
192.168.153.99 authcode.jd.com
192.168.153.99 sso.jd.com
# oa审批
10.170.230.27 oa.jd.com
# L-ui模板（运维端启动）
127.0.0.1 test.jd.com
127.0.0.1 test.jdwl.com
127.0.0.1 test.jdl.cn
127.0.0.1 test.jdl.com
# 图片管理
192.168.150.54 upload.erp.360buyimg.local
192.168.150.54 test.img30.360buyimg.com
# jss
192.168.170.182 test.storage.jd.com
192.168.170.182 test.oss.jd.com
# 网关新机器
11.91.143.146 proxy.jd.com
11.91.143.146 proxy.jdl.com
11.91.143.146 test-proxy.jd.com
11.91.143.146 test-api.jdl.com
# idaas账号测试环境
11.50.78.204 test-soms.jdl.com
172.25.51.113 iv.jd.com
111.206.88.32 misc.360buyimg.com
```

## 开发构建命令

```bash
# 启动本地服务（内网）
npm run serve:intranet
# 启动本地服务（外网）
npm run serve:extranet

# 研发测试、对外测试（内部客户）环境构建
# 预发测试环境（产品验收）构建
# 生产环境构建
npm run build
```

# 作为控制台升级版基座使用步骤：

## 1 项目克隆

### 1.1 使用递归

```bash
# 递归克隆整个项目
git clone git@coding.jd.com:lcp-saas/lcp_web_base.git --recursive
# 克隆完成后进入基座项目目录
cd lcp_web_base
```

### 1.2 不使用递归

1.  git clone 基座 git 地址
2.  初始化子模块：git submodule init
3.  更新子模块：git submodule update
4.  查看子项目：git submodule

## 2 依赖安装

### 2.1 首次安装

1. 必须安装 `node@16.20.0`、`npm@8.19.4` 与 `node@14.21.3`、`npm@6.14.18`（若安装了nvm，可在终端直接使用nvm use命令即可自动切换到对应版本）
2. 安装后打开终端，默认在 `lcp-web` 目录下
   1. 确认并切换分支（默认为 master）
   2. 执行 `nvm use` ，将 node 版本切换至 16.20.0
   3. 执行 `npm ci` 下载并安装依赖，该命令会根据 `package-lock.json` 安装确切的版本
3. 打开新终端，将目录切换至子应用项目目录下，如：`cd application/lcp_web_upgrade`
   1. 确认并切换分支（默认为 master）
   2. 查看子应用项目中 `package.json` 文件内"engines"字段，确认 node 与 npm 版本
   3. 切换 node 版本
   4. 执行 `npm ci` 下载并安装依赖
4. 重复步骤 3，直至所有子应用项目依赖全部安装完成

### 2.2 添加新依赖

```bash
# 优先使用京东源安装新依赖，有利于日后在行云平台在线构建部署
# 该命令安装的不是一个确切的版本，可能会更新package-lock.json文件，因此不推荐使用其用于首次安装依赖
npm install --registry=http://registry.m.jd.com
```

## 3 项目 GIT 提交
- 提交lcp-web 代码与之前保持一致
- 提交子模块代码， 通过命令 `cd application/子项目文件夹` 进入子项目提交代码

## 4 项目启动

1. 安装依赖后，可为基座与子应用分别新建多个终端（新建终端后，记得查看 node 版本）
2. 查看基座与子应用项目中 `package.json` 本地服务启动命令，以基座为例：
   1. 启动内网 `npm run serve:national-intranet` ，访问地址 `http://test-cloud.jdl.com:8081/admin/`
   2. 启动外网 `npm run serve:national-extranet` ，访问地址 `http://test-lcp.jdl.com:8081/admin/`
3. 在子应用终端中同样执行对应内外网环境的命令启动本地服务（由于端口号固定，暂不支持内外网同时启动）
4. 应用间嵌套关系影响基座项目启动后效果，由外到内依次为：
      1. 老版本控制台（基座） lcp-web
         1. 新版本控制台 lcp_web_upgrade

## 项目构建
- 使用自动化脚本
    1. 在终端运行 ./buildMicro.sh(初次运行需添加 buildMicro.sh 的权限，可执行 chmod +x ./buildMicro.sh)
    2. 按照脚本提示输入对应的构建文件类型及提交分支即可自动提交
- 不使用自动化脚本
    1. 在lcp-web文件目录下执行 npm run build:national
    2. 进入到子应用目录下执行对应的构建命令（例如： cd applications/lcp_web_upgrade  npm run build）
    3. 将子应用dist目录中的所有文件拷贝到 lcp-web文件下的dist文件夹内
    4. 在lcp-web项目的对应分支提交代码到远程仓库

## 项目部署
  选择行云对应环境
  编译命令为：
  ```
  cp bin/start.sh $BUILD/bin/
  cp bin/stop.sh $BUILD/bin/
  cp nginx/agent.conf $BUILD
  cp -r dist/ $BUILD/dist
  
  ```


## 注意事项

- 基座与一级子项目以及一级项目与二级项目全部有 css 与 js 沙箱
- 子项目中的 publicPath 不能随意更改

- 父子应用间通信方式：

  ### 一. 子应用获取来自基座应用的数据

  1. 方式一：直接获取数据
     ```js
     const data = window.microApp.getData(); // 返回基座下发的data数据
     ```
  2. 方式 2：绑定监听函数

     ```js
         function dataListener (data) {
             console.log('来自基座应用的数据', data)
         }

         /**
         * 绑定监听函数，监听函数只有在数据变化时才会触发
         * dataListener: 绑定函数
         * autoTrigger: 在初次绑定监听函数时如果有缓存数据，是否需要主动触发一次，默认为false
         * !!!重要说明: 因为子应用是异步渲染的，而基座发送数据是同步的，
         * 如果在子应用渲染结束前基座应用发送数据，则在绑定监听函数前数据已经发送，在初始化后不会触发绑定函数，
         * 但这个数据会放入缓存中，此时可以设置autoTrigger为true主动触发一次监听函数来获取数据。
         */
         window.microApp.addDataListener(dataListener: Function, autoTrigger?: boolean)

         // 解绑监听函数
         window.microApp.removeDataListener(dataListener: Function)

         // 清空当前子应用的所有绑定函数(全局数据函数除外)
         window.microApp.clearDataListener()
     ```

  ### 二、子应用向基座应用发送数据

  ```js
  // dispatch只接受对象作为参数
  window.microApp.dispatch({ type: "子应用发送的数据" });
  ```

  ### 三、基座应用向子应用发送数据

  基座应用向子应用发送数据有两种方式：

  #### 方式 1: 通过 data 属性发送数据

  ```js
  <template>
      <micro-app
          name='my-app'
          url='xx'
          :data='dataForChild' // data只接受对象类型，数据变化时会重新发送
      />
  </template>

  <script>
  export default {
      data () {
          return {
          dataForChild: {type: '发送给子应用的数据'}
          }
      }
  }
  </script>
  ```

  #### 方式 2: 手动发送数据

  手动发送数据需要通过 name 指定接受数据的子应用，此值和<micro-app>元素中的 name 一致。

  ```js
  import microApp from "@micro-zoe/micro-app";

  // 发送数据给子应用 my-app，setData第二个参数只接受对象类型
  microApp.setData("my-app", { type: "新的数据" });
  ```

  ### 四、基座应用获取来自子应用的数据

  基座应用获取来自子应用的数据有三种方式：

  #### 方式 1：直接获取数据

  ```js
  import microApp from "@micro-zoe/micro-app";

  const childData = microApp.getData(appName); // 返回子应用的data数据
  ```

  #### 方式 2: 监听自定义事件 (datachange)

  vue 中监听方式和普通事件一致。

  ```js
  <template>
      <micro-app
          name='my-app'
          url='xx'
          // 数据在事件对象的detail.data字段中，子应用每次发送数据都会触发datachange
          @datachange='handleDataChange'
      />
  </template>

  <script>
  export default {
      methods: {
          handleDataChange (e) {
          console.log('来自子应用的数据：', e.detail.data)
          }
      }
  }
  </script>
  ```

  #### 方式 3: 绑定监听函数

  绑定监听函数需要通过 name 指定子应用，此值和<micro-app>元素中的 name 一致。

  ```js
  import microApp from '@micro-zoe/micro-app'

  function dataListener (data) {
      console.log('来自子应用my-app的数据', data)
  }

  /**
  * 绑定监听函数
  * appName: 应用名称
  * dataListener: 绑定函数
  * autoTrigger: 在初次绑定监听函数时如果有缓存数据，是否需要主动触发一次，默认为false
  */
  microApp.addDataListener(appName: string, dataListener: Function, autoTrigger?: boolean)

  // 解绑监听my-app子应用的函数
  microApp.removeDataListener(appName: string, dataListener: Function)

  // 清空所有监听appName子应用的函数
  microApp.clearDataListener(appName: string)
  ```

  ### 全局数据通信

  全局数据通信会向基座应用和所有子应用发送数据，在跨应用通信的场景中适用。

  #### 发送全局数据

  - 基座应用

    ```js
    import microApp from "@micro-zoe/micro-app";

    // setGlobalData只接受对象作为参数
    microApp.setGlobalData({ type: "全局数据" });
    ```

  - 子应用
    ```js
    // setGlobalData只接受对象作为参数
    window.microApp.setGlobalData({ type: "全局数据" });
    ```

  #### 获取全局数据

  - 基座应用

    ```js
    import microApp from '@micro-zoe/micro-app'

    // 直接获取数据
    const globalData = microApp.getGlobalData() // 返回全局数据

    function dataListener (data) {
    console.log('全局数据', data)
    }

    /**
    * 绑定监听函数
    * dataListener: 绑定函数
    * autoTrigger: 在初次绑定监听函数时如果有缓存数据，是否需要主动触发一次，默认为false
    */
    microApp.addGlobalDataListener(dataListener: Function, autoTrigger?: boolean)

    // 解绑监听函数
    microApp.removeGlobalDataListener(dataListener: Function)

    // 清空基座应用绑定的所有全局数据监听函数
    microApp.clearGlobalDataListener()
    ```

  - 子应用

    ```js
    // 直接获取数据
    const globalData = window.microApp.getGlobalData() // 返回全局数据

    function dataListener (data) {
    console.log('全局数据', data)
    }

    /**
    * 绑定监听函数
    * dataListener: 绑定函数
    * autoTrigger: 在初次绑定监听函数时如果有缓存数据，是否需要主动触发一次，默认为false
    */
    window.microApp.addGlobalDataListener(dataListener: Function, autoTrigger?: boolean)

    // 解绑监听函数
    window.microApp.removeGlobalDataListener(dataListener: Function)

    // 清空当前子应用绑定的所有全局数据监听函数
    window.microApp.clearGlobalDataListener()
    ```


