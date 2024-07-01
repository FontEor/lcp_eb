<template>
  <header class="header-info">
    <div class="header-info__content">
      <div class="image-wrapper">
        <img :src="imagePath" style="width: 100%" />
      </div>
      <div class="text-wrapper">
        <div class="title-wrapper">
          <p class="title">{{ url }}（{{ name }}）</p>
          <span :class="`${statusInfo.className} showStatus`"
            >● {{ statusInfo.text }}</span
          >
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
      required: true
    },
    url: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: ""
    },
    createUser: {
      type: String,
      default: ""
    },
    createTime: {
      type: String | Date,
      default: () => {
        return new Date();
      }
    },
    statusInfo: {
      type: Object,
      default: () => {
        return {
          text: "",
          className: ""
        };
      }
    }
  },
  computed: {
    computeCreateTime() {
      return parseTime.timeInTable(this.createTime);
    },
  }
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
      margin-right: 16px;
      width: 62px;
    }
    .text-wrapper {
      .title-wrapper {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
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

  .status {
    &_init {
      color: #3c6ef0;
      background: rgba(60, 110, 240, 0.1);
    }
    &_edit,
    &_approve {
      color: #ea730b;
      background: rgba(234, 115, 11, 0.1);
    }
    &_released {
      color: #26a872;
      background: rgba(38, 168, 114, 0.1);
    }
    &_offline {
      color: #666666;
      background: rgba(102, 102, 102, 0.1);
    }
  }
}
</style>