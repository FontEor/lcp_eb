import Layout from "@/layout/international";

const extranetRoutes = [
  {
    path: "/developmentManagement",
    component: Layout,
    meta: { title: "开发管理", icon: "dev", name: "开发管理" },
    redirect: "/appManager",
    children: [
      {
        path: "/appManager",
        meta: {
          icon: "placeholder",
          title: "应用管理",
          name: "应用管理",
          activeMenu: "/appManager",
        },
        component: () => import("@/views/extranet/app-manager/index.vue"),
      },
      // 开发管理-沙箱联调
      // {
      //   path: "/sandboxDebugging",
      //   name: "SandboxDebugging",
      //   meta: {
      //     icon: "placeholder",
      //     title: "沙箱联调",
      //     name: "沙箱联调",
      //     activeMenu: "/sandboxDebugging"
      //   },
      //   component: () => import("@/views/extranet/sandboxDebugging/index.vue")
      // },
      // {
      //   path: "/sandboxDebugging/:scene/:activeName",
      //   name: "SandboxDebuggingOverview",
      //   hidden: true,
      //   meta: [
      //     { title: "沙箱联调", url: "/sandboxDebugging" },
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
  {
    path: "/messageCenter",
    component: Layout,
    meta: { title: "消息中心", icon: "app", name: "消息中心" },
    redirect: "/messageReceive",
    children: [
      {
        path: "/messageReceive",
        hidden: false,
        meta: {
          icon: "placeholder",
          title: "消息接收",
          name: "消息接收",
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
        component: () => import("@/views/extranet/app-manager/index.vue"),
      },
      {
        path: "/appManager/appTabs/:id/subscribe-docking-scheme",
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
