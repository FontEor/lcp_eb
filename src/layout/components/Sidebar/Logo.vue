<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <!-- <transition name="sidebarLogoFade"> -->
      <a v-if="collapse" key="collapse" class="sidebar-logo-link" @click="gotoWeb">
        <img v-if="logo" style="width: 40px;height: 40px" src="@/assets/logo.png" class="sidebar-logo">
      </a>
      <a v-else key="expand" class="sidebar-logo-link" @click="gotoWeb">
        <img v-if="logo" style="background:#ffffff;width: 120px;height: 28px;padding: 0px 6px" src="@/assets/admin_logo2.png" class="sidebar-logo">
      </a>
    <!-- </transition> -->
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: this.$t('Sidebar.Logo.5ix5ixmeeec0'),
      logo: '@/assets/123.jpg'
    }
  },
  methods: {
    gotoWeb() {
      window.location.href = `/#/home`
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  //background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
