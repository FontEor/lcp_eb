import Layout from "@/layout";

const extranetRoutes = [
  {
    path: "/developmentManagement",
    component: Layout,
    meta: { title: "开发管理", icon: "dev", name: "开发管理" },
    redirect: "/appManager",
    children: [
      {
        path: "/appManager",
        name: "extranetAppManager",
        meta: {
          icon: "placeholder",
          title: "应用管理",
          name: "应用管理",
          activeMenu: "/appManager",
        },
        component: () => import("@/views/extranet/app-manager/index.vue"),
      },
      {
        path: "/sandbox",
        name: "sandbox",
        meta: {
          icon: "placeholder",
          title: "沙箱联调",
          name: "沙箱联调",
          activeMenu: "/sandbox",
        },
        component: () => import("@/views/extranet/sandbox/index.vue"),
      },
      {
        path: "/sandbox/basicInfo",
        name: "basicInfo",
        hidden: true,
        meta: [
          {
            icon: "placeholder",
            title: "沙箱联调",
            name: "沙箱联调",
            url: "/sandbox",
          },
          {
            title: "联调场景详情",
          },
        ],
        component: () => import("@/views/extranet/sandbox/basicInfo.vue"),
      },
      {
        path: "/sandbox/commonInfo",
        name: "commonInfo",
        hidden: true,
        meta: [
          {
            icon: "placeholder",
            title: "沙箱联调",
            name: "沙箱联调",
            url: "/sandbox",
          },
          {
            title: "联调场景详情",
          },
        ],
        component: () => import("@/views/extranet/sandbox/commonInfo.vue"),
      },
      // 开发管理-业务联调
      // {
      //   path: "/sandboxDebugging",
      //   name: "SandboxDebugging",
      //   meta: {
      //     icon: "placeholder",
      //     title: "业务联调",
      //     name: "业务联调",
      //     activeMenu: "/sandboxDebugging"
      //   },
      //   component: () => import("@/views/extranet/sandboxDebugging/index.vue")
      // },
      // {
      //   path: "/sandboxDebugging/:scene/:activeName",
      //   name: "SandboxDebuggingOverview",
      //   hidden: true,
      //   meta: [
      //     { title: "业务联调", url: "/sandboxDebugging" },
      //     { title: "联调概览" }
      //   ],
      //   component: () =>
      //     import(
      //       "@/views/extranet/sandboxDebugging/debuggingOverview/index.vue"
      //     )
      // }
    ],
  },
  {
    path: "/personalCenter",
    component: Layout,
    meta: { title: "个人中心", icon: "personal", name: "个人中心" },
    redirect: "/userManager",
    children: [
      {
        path: "/userBaseInfo",
        meta: {
          icon: "placeholder",
          title: "基本信息",
          name: "基本信息",
          activeMenu: "/userBaseInfo",
        },
        component: () => import("@/views/extranet/userBaseInfo/index.vue"),
      },
      {
        path: "/userManager",
        meta: {
          icon: "placeholder",
          title: "成员管理",
          name: "成员管理",
          activeMenu: "/userManager",
        },
        component: () => import("@/views/userManager/index.vue"),
      },
      {
        path: "/qualificationManagement",
        meta: {
          icon: "placeholder",
          title: "资质管理",
          name: "资质管理",
          activeMenu: "/qualificationManagement",
        },
        name: "Qualification",
        component: () =>
          import("@/views/extranet/applyQualification/index.vue"),
      },
      {
        path: "/qualificationManagement/applySupplierQualification",
        hidden: true,
        meta: [
          { title: "资质管理", url: "/qualificationManagement" },
          { title: "自研商家资质" },
        ],
        name: "ApplySupplierQualification",
        component: () =>
          import("@/views/extranet/applyQualification/supplier.vue"),
      },
      {
        path: "/qualificationManagement/applyPartnerQualification",
        hidden: true,
        meta: [
          { title: "资质管理", url: "/qualificationManagement" },
          { title: "合作伙伴资质" },
        ],
        name: "ApplyPartnerQualification",
        component: () =>
          import("@/views/extranet/applyQualification/partner.vue"),
      },
      {
        path: "/qualificationManagement/applyIsvQualification",
        hidden: true,
        meta: [
          { title: "资质管理", url: "/qualificationManagement" },
          { title: "ISV资质" },
        ],
        name: "ApplyIsvQualification",
        component: () => import("@/views/extranet/applyQualification/isv.vue"),
      },
      {
        path: "/qualificationManagement/applyBasicInfo",
        hidden: true,
        meta: [
          { title: "资质管理", url: "/qualificationManagement" },
          { title: "基本信息" },
        ],
        component: () =>
          import("@/views/extranet/applyQualification/basicInfo.vue"),
      },
    ],
  },
  // 原为消息中心，现为平台支持
  {
    path: "/platform-support",
    component: Layout,
    meta: { title: "平台支持", icon: "app", name: "平台支持" },
    redirect: "/messageReceive",
    children: [
      {
        path: "/upgrade*",
        meta: {
          title: "工单管理",
          icon: "placeholder",
          name: "工单管理",
          activeMenu: "/upgrade*",
          microUsePath: "/upgrade/",
        },
        component: () => import("@/views/extranet/upgrade/index.vue"),
      },
      {
        path: "/messageReceive",
        hidden: false,
        meta: {
          icon: "placeholder",
          title: "消息中心",
          name: "消息中心",
          activeMenu: "/messageReceive",
        },
        component: () => import("@/views/messageManager/message.vue"),
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
      // 开发管理-应用管理
      {
        path: "/appManager/createApp",
        meta: [
          { title: "应用管理", url: "/appManager" },
          { title: "创建应用" },
        ],
        name: "AppManagerCreateApp",
        component: () =>
          import("@/views/extranet/app-manager/create-app/index.vue"),
      },
      {
        path: "/appManager/appTabs/:id",
        meta: [
          { title: "应用管理", url: "/appManager" },
          { title: "应用详情" },
        ],
        name: "AppManagerAppTabs",
        component: () =>
          import("@/views/extranet/app-manager/app-tabs/index.vue"),
      },
      {
        path: "/appManager/appTabs/:id/subscribeDockingScheme",
        meta: [
          { title: "应用管理", url: "/appManager" },
          {
            title: "应用详情",
            url: "/appManager/appTabs/:id?tabName=DockingScheme",
            join: "true",
          },
          { title: "订阅对接方案" },
        ],
        name: "AppManagerAppTabsSubscribeDockingScheme",
        component: () =>
          import(
            "@/views/extranet/app-manager/app-tabs/subscribe-docking-scheme.vue"
          ),
      },
    ],
  },
];

export default extranetRoutes;
