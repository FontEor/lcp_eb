<template>
  <div class="group-header">
    <div class="com-view-dep com-tit-view">
      <div class="tit-wrap">
        <div>
          <h2 class="tit">{{ cnName }}({{ code }})</h2>
          <template>
            <div :class="computeStatusClass">● {{ computeStatusText }}</div>
          </template>
        </div>
        <p class="tip">{{ createUser }} 创建于 {{ computeCreateTime }}</p>
        <div class="btn-wrap">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import parseTime from "@/utils/parseTime.js";

export default {
  name: "HeaderInfo",
  props: {
    cnName: {
      type: String,
      default: "",
    },
    code: {
      type: String,
      default: "",
    },
    createUser: {
      type: String,
      default: "",
    },
    createTime: {
      type: String | Date,
      default: () => {
        return new Date();
      },
    },
    showStatus: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    computeCreateTime() {
      return parseTime.timeInTable(this.createTime);
    },
    computeStatusText() {
      const hashMap = { 1: "初始化", 2: "已发布", 3: "编辑中" };
      return hashMap[this.showStatus];
    },
    computeStatusClass() {
      const hashMap = {
        1: "com-tag initBtnColor",
        2: "com-tag normalBtnColor",
        3: "com-tag updateBtnColor",
      };
      return hashMap[this.showStatus];
    },
  },
};
</script>

<style lang="scss" scoped>
.group-header {
  .com-tit-view {
    .tit-wrap {
      padding-left: 12px;
      padding-right: 20%;
      background: #ffffff;
      border-radius: 0px;
      border-left: 4px solid #3c6ef0;
    }
  }
}
</style>