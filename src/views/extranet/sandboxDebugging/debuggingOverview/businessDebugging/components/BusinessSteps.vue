<template>
  <div class="business-steps">
    <div
      v-for="(
        { title, description, icon, descriptionImage, descriptionActiveImage },
        index
      ) in stepList"
      :key="title"
      :class="judgeBusinessStepsStepClassName(index)"
      :style="{ width }"
    >
      <div :class="judgeStepTitleClassName(index)">
        <p class="title__text">{{ title }}</p>
      </div>

      <div class="step__description">
        <i
          v-if="icon"
          :class="judgeDescriptionIconLeftClassName(index, icon)"
        />
        <p
          v-else
          class="description__image-left"
          :style="
            judgeDescriptionImageLeftStyle(
              index,
              descriptionImage,
              descriptionActiveImage
            )
          "
        ></p>
        <span class="description__text">{{ description }}</span>
        <i class="description__icon-right el-icon-caret-right" />
      </div>
    </div>
  </div>
</template>

<script>
import circleCheckImageUrl from "@/assets/extranet/images/sandboxDebugging/circleCheck.svg";

export default {
  name: "BusinessSteps",
  props: {
    active: { type: Number, default: -1 },
    stepList: {
      type: Array,
      default: () => [],
    },
    width: { type: String, default: "270px" },
  },
  data() {
    return { circleCheckImageUrl };
  },
  methods: {
    judgeBusinessStepsStepClassName(index) {
      const { active } = this;
      return {
        "business-steps__step": true,
        "is-active": index === active,
        "is-success": index < active,
      };
    },
    judgeStepTitleClassName(index) {
      const { stepList } = this;
      return {
        step__title: true,
        "is-forward": index < stepList.length - 1,
      };
    },
    judgeDescriptionImageLeftStyle(
      index,
      descriptionImage,
      descriptionActiveImage
    ) {
      const { active, circleCheckImageUrl } = this;
      const backgroundImageUrl =
        index > active
          ? descriptionImage
          : index < active
          ? circleCheckImageUrl
          : descriptionActiveImage;
      const backgroundImage = `url(${backgroundImageUrl})`;
      return { backgroundImage };
    },
    judgeDescriptionIconLeftClassName(index, icon) {
      const { active } = this;
      return {
        "description__icon-left": true,
        [icon]: index >= active,
        "el-icon-circle-check": index < active,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.business-steps {
  display: flex;
  justify-content: center;
  align-items: center;

  // 未激活步骤
  .business-steps__step {
    .step__title {
      margin: 4px 4px 0 0;
      padding: 12px;
      color: #999;
      background-color: #f5f5f5;

      .title__text {
        line-height: 1;
        font-size: 18px;
        font-weight: 500;
        white-space: nowrap;
        text-align: center;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      // 除了最后一步以外的其他步骤
      &.is-forward {
        position: relative;

        &::before {
          position: absolute;
          top: 0;
          right: -8px;
          z-index: 2;
          display: block;
          content: "";
          width: 0;
          height: 0;
          border: 21px solid transparent;
          border-left: 8px solid #f5f5f5;
          border-right: none;
        }

        &::after {
          position: absolute;
          top: 0;
          right: -12px;
          z-index: 1;
          display: block;
          content: "";
          width: 0;
          height: 0;
          border: 21px solid transparent;
          border-left: 8px solid #fff;
          border-right: none;
        }
      }
    }

    .step__description {
      margin: 4px 4px 0 0;
      padding: 8px;
      padding-right: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 24px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      color: #999;
      background-color: #f5f5f5;

      .description__image-left {
        width: 24px;
        height: 24px;
        background-size: contain;
      }

      .description__text {
        font-size: 14px;
      }

      .description__icon-right {
        color: #f5f5f5;
      }
    }

    // 激活步骤，已完成步骤
    &.is-active,
    &.is-success {
      .step__title {
        color: #3c6ef0;
        background-color: #d3e2fc;
        background-image: url("~@/assets/extranet/images/sandboxDebugging/businessStepsTitleBackground.png");
        background-size: cover;

        &.is-forward {
          &::before {
            border-left: 8px solid #d3e2fc;
          }
        }
      }

      .step__description {
        color: #3c6ef0;
        background-color: #ebf0fd;
      }

      .description__icon-right {
        color: #d7e1fa;
      }
    }
  }
}
</style>