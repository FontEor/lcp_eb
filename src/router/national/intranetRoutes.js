import Layout from "@/layout";
import BasicLayout from "@/layout/basicLayout.vue";

const intranetRoutes = [
  {
    path: "/openTechnology",
    component: Layout,
    meta: { title: "技术开放", icon: "table", name: "技术开放" },
    redirect: "/openBiz",
    children: [
      {
        path: "/openBiz",
        meta: {
          title: "方案管理",
          icon: "placeholder",
          name: "方案管理",
          activeMenu: "/openBiz",
        },
        component: () => import("@/views/intranet/scheme-manager/index.vue"),
      },
      {
        path: "/softwareSystem",
        meta: {
          title: "软件系统",
          icon: "placeholder",
          name: "软件系统",
          activeMenu: "/softwareSystem",
        },
        name: "SoftwareSystem",
        component: () => import("@/views/intranet/softwareSystem/index.vue"),
      },
    ],
  },
  {
    path: "/developmentManagement",
    component: Layout,
    meta: { title: "开发管理", icon: "dev", name: "开发管理" },
    redirect: "/appManager",
    children: [
      {
        path: "/appManager",
        meta: {
          title: "应用管理",
          icon: "placeholder",
          name: "应用管理",
          activeMenu: "/appManager",
        },
        component: () => import("@/views/intranet/app-manager/index.vue"),
      },
      {
        path: "/apiManager",
        meta: {
          title: "API管理",
          icon: "placeholder",
          name: "API管理",
          activeMenu: "/apiManager",
        },
        component: () => import("@/views/intranet/apiManager/index.vue"),
      },
      {
        path: "/messageManager",
        name: "messageManager",
        meta: {
          title: "消息管理",
          icon: "placeholder",
          name: "消息管理",
          activeMenu: "/messageManager",
        },
        component: () => import("@/views/intranet/messageManager/index.vue"),
      },
      {
        path: "/messageManagerDetail/:topic",
        name: "messageManagerDetail",
        redirect: "/messageManager/basicInfo/:topic",
        hidden: true,
        meta: {
          title: "消息详情",
          icon: "placeholder",
          name: "消息详情",
          activeMenu: "/messageManager",
        },
        component: () =>
          import("@/views/intranet/messageManager/detail/index.vue"),
        children: [
          {
            path: "/messageManager/basicInfo/:topic",
            name: "messageManagerBasicInfo",
            meta: [
              { title: "消息管理", url: "/messageManager" },
              { title: "详情" },
            ],
            component: () =>
              import("@/views/intranet/messageManager/detail/basicInfo.vue"),
          },
          {
            path: "/messageManager/messageDoc/:topic",
            name: "messageManagerMessageDoc",
            meta: [
              { title: "消息管理", url: "/messageManager" },
              { title: "详情" },
            ],
            component: () =>
              import("@/views/intranet/messageManager/detail/messageDoc.vue"),
          },
          {
            path: "/messageManager/subscriber/:topic",
            name: "messageManagerSubscriber",
            meta: [
              { title: "消息管理", url: "/messageManager" },
              { title: "详情" },
            ],
            component: () =>
              import("@/views/intranet/messageManager/detail/subscriber.vue"),
          },
          {
            path: "/messageManager/publishRecords/:topic",
            name: "messageManagerPublishRecords",
            meta: [
              { title: "消息管理", url: "/messageManager" },
              { title: "详情" },
            ],
            component: () =>
              import(
                "@/views/intranet/messageManager/detail/publishRecords.vue"
              ),
          },
        ],
      },
      {
        path: "/messageManagerPublish/:topic",
        name: "messageManagerPublish",
        redirect: "/messageManagerPublish/one/:topic",
        hidden: true,
        component: () =>
          import("@/views/intranet/messageManager/publish/index.vue"),
        children: [
          {
            path: "/messageManagerPublish/one/:topic",
            name: "messageManagerPublishOne",
            meta: [
              { title: "消息管理", url: "/messageManager" },
              { title: "详情", url: "/messageManagerDetail/:topic" },
              { title: "发布" },
            ],
            component: () =>
              import("@/views/intranet/messageManager/publish/stepOne.vue"),
          },
          {
            path: "/messageManagerPublish/two/:topic",
            name: "messageManagerPublishTwo",
            meta: [
              { title: "消息管理", url: "/messageManager" },
              { title: "详情", url: "/messageManagerDetail/:topic" },
              { title: "发布" },
            ],
            component: () =>
              import("@/views/intranet/messageManager/publish/stepTwo.vue"),
          },
          {
            path: "/messageManagerPublish/three/:topic",
            name: "messageManagerPublishThree",
            meta: [
              { title: "消息管理", url: "/messageManager" },
              { title: "详情", url: "/messageManagerDetail/:topic" },
              { title: "发布" },
            ],
            component: () =>
              import("@/views/intranet/messageManager/publish/stepThree.vue"),
          },
        ],
      },
    ],
  },
  {
    path: "/operationsCenter",
    component: Layout,
    meta: { title: "运维中心", icon: "dev", name: "运维中心" },
    redirect: "/logTool",
    children: [
      {
        path: "/logTool",
        meta: {
          title: "日志工具",
          icon: "placeholder",
          name: "日志工具",
          activeMenu: "/logTool",
        },
        component: () =>
          import("@/views/intranet/operationsManager/logTool/index.vue"),
      },
    ],
  },
  {
    path: "/personalCenter",
    component: Layout,
    meta: { title: "个人中心", icon: "personal", name: "个人中心" },
    redirect: "/userManager",
    children: [
      {
        path: "/userManager",
        meta: {
          title: "成员管理",
          icon: "placeholder",
          name: "成员管理",
          activeMenu: "/userManager",
        },
        component: () => import("@/views/userManager/index.vue"),
      },
      {
        path: "/assetTransfer",
        meta: {
          title: "资产交接",
          icon: "placeholder",
          name: "资产交接",
          activeMenu: "/assetTransfer",
        },
        component: () => import("@/views/intranet/assetTransfer/index.vue"),
      },
    ],
  },
  {
    path: "/messageCenter",
    component: Layout,
    meta: { title: "消息中心", icon: "dev", name: "消息中心" },
    redirect: "/messageReceive",
    children: [
      {
        path: "/messageReceive",
        meta: {
          title: "消息接收",
          icon: "placeholder",
          name: "消息接收",
          activeMenu: "/messageReceive",
        },
        component: () => import("@/views/intranet/messageReceive/index.vue"),
      },
    ],
  },

  // EDI独立页面
  {
    path: "/edi",
    component: BasicLayout,
    hidden: true,
    children: [
      {
        path: "newMerchant",
        component: () => import("@/views/intranet/ediManager/newMerchant.vue"),
      },
      {
        path: "editMerchant",
        component: () => import("@/views/intranet/ediManager/editMerchant.vue"),
      },
    ],
  },

  // 以下页面亟待重构
  //管理端的路由配置
  {
    path: "/_7",
    title: "管理端路由",
    component: Layout,
    redirect: "/",
    hidden: true,
    children: [
      // 技术开放
      {
        path: "/openBiz/createBizUnit",
        meta: [
          { title: "方案管理", url: "/openBiz" },
          { title: "创建对接方案" },
        ],
        name: "OpenBizCreateBizUnit",
        component: () => import("@/views/intranet/scheme-manager/create.vue"),
      },
      {
        path: "/openBiz/openBizDetail/:id",
        // 面包屑需要meta数组
        meta: [{ title: "方案管理", url: "/openBiz" }, { title: "详情" }],
        name: "OpenBizOpenBizDetail",
        component: () =>
          import("@/views/intranet/scheme-manager/detail/index.vue"),
      },
      {
        path: "/openBiz/openBizDetail/:id/submitReview",
        meta: [
          { title: "方案管理", url: "/openBiz" },
          { title: "详情", url: "/openBiz/openBizDetail/:id" },
          { title: "提交审核" },
        ],
        name: "OpenBizOpenBizDetailSubmitReview",
        component: () =>
          import("@/views/intranet/scheme-manager/submit-review.vue"),
      },
      {
        path: "/openBiz/openBizDetail/:id/publishBizUnit",
        meta: [
          { title: "方案管理", url: "/openBiz" },
          { title: "详情", url: "/openBiz/openBizDetail/:id" },
          { title: "发布对接方案" },
        ],
        name: "OpenBizOpenBizDetailPublishBizUnit",
        component: () => import("@/views/intranet/scheme-manager/publish.vue"),
      },
      // 技术开放-软件系统
      {
        path: "/softwareSystem/detail/:id",
        meta: [
          { title: "软件系统", url: "/softwareSystem" },
          { title: "详情" },
        ],
        name: "SoftwareSystemDetail",
        component: () =>
          import("@/views/intranet/softwareSystem/softwareSystemDetail.vue"),
      },
      {
        path: "/softwareSystem/detail/:id/publish",
        meta: [
          { title: "软件系统", url: "/softwareSystem" },
          { title: "详情", url: "/softwareSystem/detail/:id" },
          { title: "发布" },
        ],
        name: "SoftwareSystemDetailPublish",
        component: () =>
          import("@/views/intranet/softwareSystem/publish/index.vue"),
      },
      // 开发管理-应用管理
      {
        path: "/appManager/detail/:type/:id",
        meta: [
          { title: "应用管理", url: "/appManager" },
          { title: "应用详情" },
        ],
        name: "AppManagerDetail",
        component: () =>
          import("@/views/intranet/app-manager/detail/index.vue"),
      },
      {
        path: "/appManager/detail/:type/:id/publish",
        meta: [
          { title: "应用管理", url: "/appManager" },
          { title: "应用详情", url: "/appManager/detail/:type/:id" },
          { title: "发布" },
        ],
        name: "AppManagerDetailPublish",
        component: () =>
          import(
            "@/views/intranet/app-manager/detail/softwareSystemApp/publish/index.vue"
          ),
      },
      {
        path: "/appManager/create-app",
        meta: [
          { title: "应用管理", url: "/appManager" },
          { title: "创建应用" },
        ],
        name: "AppManagerCreateApp",
        component: () => import("@/views/intranet/app-manager/create-app.vue"),
      },
      {
        path: "/appManager/create-app/fill-in-info",
        meta: [
          { title: "应用管理", url: "/appManager" },
          { title: "填写信息" },
        ],
        name: "AppManagerCreateAppFillInIno",
        component: () =>
          import("@/views/intranet/app-manager/create-app-fill-in-info.vue"),
      },
      {
        path: "/appManager/create-app-finish",
        meta: [
          { title: "应用管理", url: "/appManager" },
          { title: "注册成功" },
        ],
        name: "AppManagerCreateAppFinish",
        component: () =>
          import("@/views/intranet/app-manager/create-app-finish.vue"),
      },
      {
        path: "/appManager/create-secondary-development-app/:id/:productCode",
        meta: [
          { title: "应用管理", url: "/appManager" },
          { title: "创建应用" },
        ],
        name: "AppManagerCreateSecondaryDevelopmentApp",
        component: () =>
          import(
            "@/views/intranet/app-manager/create-secondary-development-app.vue"
          ),
      },
      {
        path: "/appManager/appTabs/:id",
        meta: [
          { title: "应用管理", url: "/appManager" },
          { title: "应用详情" },
        ],
        name: "AppManagerAppTabs",
        component: () =>
          import("@/views/intranet/app-manager/app-tabs/index.vue"),
      },
      // 开发管理-API管理
      {
        path: "/apiManager/registerApi",
        meta: [
          // { title: "API管理", url: "/apiManager" },
          // { title: "API列表", url: "/apiManager" },
          // { title: "注册API" }
        ],
        name: "ApiManagerRegisterApi",
        beforeEnter(to, from, next) {
          const { type } = to.query || {};
          if (type === "jsf") {
            to.meta.splice(
              0,
              3,
              { title: "开放API", url: "/apiManager" },
              { title: "JSF服务API", url: "/apiManager?type=jsf" },
              { title: "注册API" }
            );
          }
          if (type === "http") {
            to.meta.splice(
              0,
              3,
              { title: "开放API", url: "/apiManager" },
              { title: "HTTP服务API", url: "/apiManager?type=http" },
              { title: "注册API" }
            );
          }
          next();
        },
        component: () =>
          import("@/views/intranet/apiManager/register/index.vue"),
      },
      {
        path: "/apiManager/detail/:type/:id",
        meta: [
          // { title: "API管理", url: "/apiManager" },
          // { title: "API列表", url: "/apiManager?type=:type" },
          // { title: "详情" }
        ],
        beforeEnter: (to, from, next) => {
          const { params } = to || {};
          if (params.type === "jsf") {
            to.meta.splice(
              0,
              3,
              {
                title: "开放API",
                url: "/apiManager",
              },
              {
                title: "JSF服务API",
                url: "/apiManager?type=:type",
              },
              { title: "详情" }
            );
          }
          if (params.type === "http") {
            to.meta.splice(
              0,
              3,
              { title: "开放API", url: "/apiManager" },
              {
                title: "HTTP服务API",
                url: "/apiManager?type=:type",
              },
              { title: "详情" }
            );
          }
          next();
        },
        name: "ApiManagerDetail",
        component: () =>
          import("@/views/intranet/apiManager/apiList/detail/index.vue"),
      },
      {
        path: "/apiManager/detail/:type/:id/publishApi", // http用，jsf用的publishOne
        meta: [
          { title: "开放API", url: "/apiManager" },
          { title: "HTTP服务API", url: "/apiManager?type=:type" },
          {
            title: "详情",
            url: "/apiManager/detail/:type/:id",
            join: "true",
          },
          { title: "发布" },
        ],
        name: "PublishApi",
        component: () =>
          import("@/views/intranet/apiManager/apiList/publishApi/index.vue"),
      },
      {
        path: "/apiManager/apiTabs/:id/publishOne",
        meta: [
          { title: "开放API", url: "/apiManager" },
          { title: "JSF服务API", url: "/apiManager?type=jsf" },
          {
            title: "详情",
            url: "/apiManager/detail/jsf/:id",
            join: "true",
          },
          { title: "发布" },
        ],
        name: "ApiManagerApiTabsPublishOne",
        component: () =>
          import("@/views/devManager/api/publish/publishOne.vue"),
      },
      {
        path: "/apiManager/apiTabs/:id/publishTwo",
        meta: [
          { title: "开放API", url: "/apiManager" },
          { title: "JSF服务API", url: "/apiManager?type=jsf" },
          {
            title: "详情",
            url: "/apiManager/detail/jsf/:id",
            join: "true",
          },
          { title: "发布" },
        ],
        name: "ApiManagerApiTabsPublishTwo",
        component: () =>
          import("@/views/devManager/api/publish/publishTwo.vue"),
      },
      {
        path: "/apiManager/apiTabs/:id/publishThree",
        meta: [
          { title: "开放API", url: "/apiManager" },
          { title: "JSF服务API", url: "/apiManager?type=jsf" },
          {
            title: "详情",
            url: "/apiManager/detail/jsf/:id",
            join: "true",
          },
          { title: "发布" },
        ],
        name: "ApiManagerApiTabsPublishThree",
        component: () =>
          import("@/views/devManager/api/publish/publishThree.vue"),
      },
      {
        path: "/apiManager/apiTabs/:id/publishAddThree",
        meta: [
          { title: "开放API", url: "/apiManager" },
          { title: "JSF服务API", url: "/apiManager?type=jsf" },
          {
            title: "详情",
            url: "/apiManager/detail/jsf/:id",
            join: "true",
          },
          { title: "发布" },
        ],
        name: "ApiManagerApiTabsPublishAddThree",
        component: () =>
          import("@/views/devManager/api/publish/publishAddThree.vue"),
      },
      {
        path: "/apiManager/apiTabs/:id/publishFour",
        meta: [
          { title: "开放API", url: "/apiManager" },
          { title: "JSF服务API", url: "/apiManager?type=jsf" },
          {
            title: "详情",
            url: "/apiManager/detail/jsf/:id",
            join: "true",
          },
          { title: "发布" },
        ],
        name: "ApiManagerApiTabsPublishFour",
        component: () =>
          import("@/views/devManager/api/publish/publishFour.vue"),
      },
      {
        path: "/apiManager/apiGroup",
        name: "ApiManagerApiGroup",
        meta: {
          activeMenu: "/apiManager",
        },
        component: () => import("@/views/intranet/apiManager/index.vue"),
      },
      {
        path: "/apiManager/apiGroup/createApiGroup",
        meta: [
          { title: "开放API", url: "/apiManager" },
          { title: "API分组", url: "/apiManager/apiGroup" },
          { title: "注册API分组" },
        ],
        name: "ApiManagerCreateApiGroup",
        component: () =>
          import(
            "@/views/intranet/apiManager/groupList/createApiGroup/index.vue"
          ),
      },
      {
        path: "/apiManager/apiGroup/detail/:id",
        meta: [
          { title: "开放API", url: "/apiManager" },
          { title: "API分组", url: "/apiManager/apiGroup" },
          { title: "详情" },
        ],
        name: "ApiManagerApiGroupDetail",
        component: () =>
          import("@/views/intranet/apiManager/groupList/detail/index.vue"),
      },
      {
        path: "/apiManager/apiGroup/detail/:id/publish",
        meta: [
          { title: "开放API", url: "/apiManager" },
          { title: "API分组", url: "/apiManager/apiGroup" },
          { title: "详情", url: "/apiManager/apiGroup/detail/:id" },
          { title: "发布" },
        ],
        name: "ApiManagerApiGroupDetailPublish",
        component: () =>
          import(
            "@/views/intranet/apiManager/groupList/detail/publish/index.vue"
          ),
      },
      {
        path: "/apiManager/cluster",
        name: "ApiManagerCluster",
        meta: {
          activeMenu: "/apiManager",
        },
        component: () => import("@/views/intranet/apiManager/index.vue"),
      },
      // 开发管理-API管理-京东调外部API列表
      {
        path: "/apiManager/passBack",
        name: "ApiManagerPassBack",
        meta: {
          activeMenu: "/apiManager",
        },
        component: () => import("@/views/intranet/apiManager/index.vue"),
      },
      {
        path: "/apiManager/passBack/register",
        meta: [
          { title: "开放API", url: "/apiManager" },
          { title: "回传API", url: "/apiManager/passBack" },
          { title: "注册API" },
        ],
        name: "ApiManagerPassBackRegister",
        component: () =>
          import(
            "@/views/intranet/apiManager/apiPassbackList/register/index.vue"
          ),
      },
      {
        path: "/apiManager/passBack/detail/:id",
        meta: [
          { title: "开放API", url: "/apiManager" },
          { title: "回传API", url: "/apiManager/passBack" },
          { title: "详情" },
        ],
        name: "ApiManagerPassBackDetail",
        component: () =>
          import(
            "@/views/intranet/apiManager/apiPassbackList/detail/index.vue"
          ),
      },
      {
        path: "/apiManager/passBack/detail/:id/publish",
        meta: [
          { title: "开放API", url: "/apiManager" },
          { title: "回传API", url: "/apiManager/passBack" },
          {
            title: "详情",
            url: "/apiManager/passBack/detail/:id",
          },
          { title: "发布" },
        ],
        name: "ApiManagerPassBackPublish",
        component: () =>
          import("@/views/intranet/apiManager/apiPassbackList/publishApi.vue"),
      },
      // 开发管理-API管理-移动端网关
      {
        path: "/apiManager/mobile",
        name: "ApiManagerMobile",
        meta: {
          activeMenu: "/apiManager",
        },
        component: () => import("@/views/intranet/apiManager/index.vue"),
      },
      {
        path: "/apiManager/mobile/registerApi",
        meta: [
          { title: "移动端网关API", url: "/apiManager/mobile" },
          { title: "HTTP协议API", url: "/apiManager/mobile" },
          { title: "注册API" },
        ],
        name: "ApiManagerMobileRegisterApi",
        component: () =>
          import(
            "@/views/intranet/apiManager/apiMobileGateWay/register/index.vue"
          ),
      },
      {
        path: "/apiManager/mobile/detail/http/:id",
        meta: [
          { title: "移动端网关API", url: "/apiManager/mobile" },
          { title: "HTTP协议API", url: "/apiManager/mobile" },
          { title: "详情" },
        ],
        name: "ApiManagerMobileDetail",
        component: () =>
          import(
            "@/views/intranet/apiManager/apiMobileGateWay/apiList/detail/index.vue"
          ),
      },
      {
        path: "/apiManager/mobile/detail/http/:id/publishApi",
        meta: [
          { title: "移动端网关API", url: "/apiManager/mobile" },
          { title: "HTTP协议API", url: "/apiManager/mobile" },
          {
            title: "详情",
            url: "/apiManager/mobile/detail/http/:id",
            join: "true",
          },
          { title: "发布" },
        ],
        name: "PublishMobileApi",
        component: () =>
          import(
            "@/views/intranet/apiManager/apiMobileGateWay/apiList/publishApi/index.vue"
          ),
      },
      {
        path: "/apiManager/mobile/apiGroup",
        name: "ApiManagerMobileApiGroup",
        meta: {
          activeMenu: "/apiManager",
        },
        component: () => import("@/views/intranet/apiManager/index.vue"),
      },
      {
        path: "/apiManager/mobile/apiGroup/createApiGroup",
        meta: [
          { title: "移动端网关API", url: "/apiManager/mobile" },
          { title: "API分组", url: "/apiManager/mobile/apiGroup" },
          { title: "注册API分组" },
        ],
        name: "ApiManagerMobileCreateApiGroup",
        component: () =>
          import(
            "@/views/intranet/apiManager/apiMobileGateWay/groupList/createApiGroup/index.vue"
          ),
      },
      {
        path: "/apiManager/mobile/apiGroup/detail/:id",
        meta: [
          { title: "移动端网关API", url: "/apiManager/mobile" },
          { title: "API分组", url: "/apiManager/mobile/apiGroup" },
          { title: "详情" },
        ],
        name: "ApiManagerMobileApiGroupDetail",
        component: () =>
          import(
            "@/views/intranet/apiManager/apiMobileGateWay/groupList/detail/index.vue"
          ),
      },
      {
        path: "/apiManager/mobile/apiGroup/detail/:id/publish",
        meta: [
          { title: "移动端网关API", url: "/apiManager/mobile" },
          { title: "API分组", url: "/apiManager/mobile/apiGroup" },
          { title: "详情", url: "/apiManager/mobile/apiGroup/detail/:id" },
          { title: "发布" },
        ],
        name: "ApiManagerMobileApiGroupDetailPublish",
        component: () =>
          import(
            "@/views/intranet/apiManager/apiMobileGateWay/groupList/detail/publish/index.vue"
          ),
      },
      {
        path: "/apiManager/mobile/cluster",
        name: "ApiManagerMobileCluster",
        meta: {
          activeMenu: "/apiManager",
        },
        component: () => import("@/views/intranet/apiManager/index.vue"),
      },
    ],
  },
];
export default intranetRoutes;
