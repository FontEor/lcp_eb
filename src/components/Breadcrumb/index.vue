<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <!-- <transition-group name="fade-transform" mode="out-in"> -->
      <el-breadcrumb-item v-for="item in meta" :key="item.index">
        <router-link v-if="item.url" :to="skip(item.url)" class="has-url">{{
          item.title
        }}</router-link>
        <span
          v-else
          :class="{
            'no-url': item.index !== meta.length - 1,
            'current-page': item.index === meta.length - 1,
          }"
        >
          {{ item.title }}
        </span>
      </el-breadcrumb-item>
    <!-- </transition-group> -->
  </el-breadcrumb>
</template>

<script>
export default {
  data() {
    return {
      meta: [],
    };
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    },
  },
  methods: {
    skip(url) {
      let hash = window.location.hash;
      // if (hash.startsWith("#/submitReview")) {
      //   let routerName = "#/submitReview";
      //   let id = hash.replace(routerName, "");
      //   return url + id;
      // }
      //如果面包屑的路由包含/:说明需要把path中的/:id根据当前路由替换一下
      if (url.indexOf("/:") != -1 || url.indexOf(":") != -1) {
        console.log("this.$route.params", this.$route.params);
        console.log("keys", Object.keys(this.$route.params));
        let keys = Object.keys(this.$route.params);
        for (let index = 0; index < keys.length; index++) {
          let key = keys[index];
          let replaceKey = ":" + key;
          url = url.replace(replaceKey, this.$route.params[key]);
        }
      }
      return url;
    },
    getBreadcrumb() {
      this.meta = [];
      const { meta } = this.$route;
      if (meta) {
        if (meta instanceof Array) {
          this.meta = meta.map((item, index) => ({ ...item, index }));
        }
      }
    },
  },
  created() {
    this.getBreadcrumb();
  },
};
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  font-size: 14px;
  line-height: 40px;
  // 二级菜单不显示面包屑仍需要占据高度
  min-height: 20px;
  margin-left: 20px;
  .has-url {
    color: #666;
  }
  .no-url {
    color: #999;
  }
  .current-page {
    color: #3c6ef0;
  }
}
</style>
