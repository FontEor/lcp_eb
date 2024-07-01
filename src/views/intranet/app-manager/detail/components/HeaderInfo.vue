<template>
  <header class="header-info">
    <div class="header-info__content">
      <div :class="computeImageWrapperClass">
        <img v-if="imagePath" :src="imagePath" style="width: 100%" />
      </div>
      <div class="text-wrapper">
        <div class="title-wrapper">
          <p class="title">{{ name }}</p>
          <span :class="computeStatusClass">{{ computeStatusText }}</span>
        </div>
        <p class="subtitle">{{ createUser }} 创建于 {{ computeCreateTime }}</p>
      </div>
    </div>
    <div class="header-info__button-wrapper">
      <slot></slot>
    </div>
  </header>
</template>

<script>
import parseTime from "@/utils/parseTime.js";

export default {
  name: "HeaderInfo",
  props: {
    imagePath: {
      type: String | Function,
    },
    url: {
      type: String,
      default: "",
    },
    name: {
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
      return this.$store.state.tools.dictionary.appStatus[this.showStatus]
        .value;
    },
    computeStatusClass() {
      const hashMap = {
        1: "showStatus normalBtnColor",
        2: "showStatus initBtnColor",
        3: "showStatus updateBtnColor",
      };
      return hashMap[this.showStatus];
    },
    computeImageWrapperClass() {
      return this.imagePath ? "image-wrapper" : "image-wrapper no-image";
    },
  },
};
</script>

<style lang="scss" scoped>
.header-info {
  margin-bottom: 8px;
  padding: 10px 16px;
  background: #fff;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .header-info__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .image-wrapper {
      min-height: 62px;
      &.no-image {
        margin-right: 16px;
        width: 4px;
        border-radius: 4px;
        background: #3c6ef0;
      }
    }
    .text-wrapper {
      .title-wrapper {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .title {
          color: #333;
          font-size: 18px;
          font-weight: 600;
        }
        .showStatus {
          padding: 2px 12px;
          border-radius: 12px;
          margin-left: 8px;
        }
      }
      .subtitle {
        color: #666;
      }
    }
  }
}
</style>