<template>
  <div class="publish">
    <div v-loading="loading" class="app-container">
      <h2 class="menuTitle">发布对接方案</h2>

      <Steps :active="steps.active" :tiptitle="steps.tiptitle" />

      <div class="stepForm">
        <!-- 第一步选择发布环境表单 -->
        <div v-show="steps.active === 0" class="formChooseEnv">
          <p class="stepFormTip">
            发布后，公网用户可在物流开放平台查看该对接方案中的所有信息，包括概览信息、接口、SDK、使用手册。
          </p>
          <el-form
            :model="formChooseEnv.data"
            :rules="formChooseEnv.rules"
            ref="formChooseEnv"
            label-width="80px"
          >
            <el-form-item
              v-for="(item, index) in formChooseEnv.itemList"
              :key="index"
              :label="item.label"
              :prop="item.prop"
            >
              <el-input
                v-if="index === 0"
                v-model="formChooseEnv.data.publishRecord"
                type="textarea"
                placeholder="记录本次发布较上次的变更，例如添加接口、SDK等"
                resize="vertical"
                :autosize="{ minRows: 3 }"
              ></el-input>
            </el-form-item>
          </el-form>
          <div class="buttonWrapper">
            <el-button
              @click="
                $router.push({
                  name: 'OpenBizOpenBizDetail',
                  params: { id: unitId },
                })
              "
              >取 消</el-button
            >
            <el-button
              type="primary"
              :loading="confirmPublishButtonLoading"
              @click="onClickConfirmPublishButton"
              >确认发布</el-button
            >
          </div>
        </div>

        <!-- 第二步发布进度 -->
        <div v-if="steps.active === 1" class="publishProgress">
          <el-progress
            :percentage="percentage"
            :status="progressStatus"
            :text-inside="true"
            :stroke-width="20"
          ></el-progress>
          <p class="stepFormTip taskMessage" :class="computeTipTextClass">
            {{ tipText }}
          </p>
          <div v-if="secondStepButtonWrapperVisible" class="buttonWrapper">
            <el-button
              v-if="nextStepButtonVisible"
              type="primary"
              @click="steps.active = 2"
              >下一步</el-button
            >
            <div v-else>
              <el-button @click="steps.active = 0">上一步</el-button>
              <el-button
                type="primary"
                :loading="retryButtonLoading"
                @click="onClickRetryButton"
                >重 试</el-button
              >
            </div>
          </div>
        </div>

        <!-- 第三步完成 -->
        <div v-if="steps.active === 2" class="publishFinish">
          <div class="finishImage">
            <img src="~@/assets/img/publishFinish.png" style="width: 100%" />
          </div>
          <p class="stepFormTitle">发布成功</p>
          <div class="buttonWrapper">
            <el-button v-if="publishRange === 2" @click="goToOpenBiz"
              >查看对接方案</el-button
            >
            <el-button type="primary" @click="goToOpenBizDetail"
              >继续管理</el-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Steps from "@/components/steps/index.vue";
import { mapGetters } from "vuex";
import lcp from "@/api/intranet/lcp/index.js";

export default {
  name: "Publish",
  components: { Steps },
  data() {
    return {
      unitId: parseInt(this.$route.params.id),
      taskId: 0,
      loading: true,
      env: window.env.baseEnv,
      steps: {
        active: 0,
        tiptitle: ["填写发布记录", "发布", "完成"],
      },
      formChooseEnv: {
        data: {
          environmentList: [],
          publishRecord: "",
        },
        itemList: [{ label: "发布记录", prop: "publishRecord" }],
        rules: {
          publishRecord: [{ required: true, message: "请输入发布记录" }],
        },
      },
      percentage: 0,
      tipText: "",
      progressStatus: null,
      secondStepButtonWrapperVisible: false,
      nextStepButtonVisible: false,
      publishRange: 2, //1为私有，2为公开
      hasUat: 0,
      confirmPublishButtonLoading: false,
      createPublishTaskDebounceTimer: null,
      retryButtonLoading: false,
      runPublishDebounceTimer: null,
    };
  },
  computed: {
    ...mapGetters({ pin: "user_pin" }),
    computeTipTextClass() {
      let classString = "stepFormTip taskMessage";
      if (this.tipText === "正在发布...") {
        return classString;
      } else if (this.tipText === "发布成功") {
        return `${classString} successMessage`;
      } else {
        return `${classString} errorMessage`;
      }
    },
  },
  methods: {
    // 根据对接方案ID查询对接方案类型
    async getBizUnitPreById() {
      const id = this.unitId;
      const params = { id };
      return await lcp.bizunit.getBizUnitPreById(params).catch((error) => {
        throw new Error(`getBizUnitPreById, ${error}`);
      });
    },
    // 创建发布对接方案任务
    async createTask() {
      const { unitId, pin } = this;
      const { environmentList } = this.formChooseEnv.data;
      const publishRecord = this.formChooseEnv.data.publishRecord.replace(
        /"/g,
        "'"
      );
      const data = { unitId, pin, environmentList, publishRecord };
      return await lcp.bizunit.createTask(data).catch((error) => {
        throw new Error(`createTask, ${error}`);
      });
    },
    // 执行对接方案发布任务
    async runTask() {
      const { unitId, taskId } = this;
      const params = { unitId, taskId };
      return await lcp.bizunit.runTask(params).catch((error) => {
        const { message } = error;
        throw new Error(`runTask, ${message || error}`);
      });
    },
    // 查看对接方案发布任务进度
    async progressTask() {
      const { taskId } = this;
      const params = { taskId };
      return await lcp.bizunit.progressTask(params).catch((error) => {
        throw new Error(`progressTask, ${error}`);
      });
    },

    async handleGetBizUnitPreById() {
      const {
        data: { status, publishRange, hasUat },
      } = await this.getBizUnitPreById().catch((error) => {
        throw new Error(`handleGetBizUnitPreById, ${error}`);
      });
      if (status === 4) {
        this.loading = false;
      } else {
        this.$message.error("该对接方案未处于审核通过状态，请先提交审核");
        this.$router.back();
      }
      this.publishRange = publishRange;
      this.hasUat = hasUat;
    },
    onClickConfirmPublishButton() {
      this.$refs["formChooseEnv"]
        .validate()
        .then(async () => {
          const { env, hasUat } = this;
          const isProduction = env === "uat" || env === "prod";
          this.formChooseEnv.data.environmentList = isProduction
            ? hasUat === 1
              ? ["prod", "uat"]
              : ["prod"]
            : [env];
          await this.handleCreateTask().catch((error) => {
            throw new Error(`onClickConfirmPublishButton, ${error}`);
          });
        })
        .catch(() => {});
    },
    async handleCreateTask() {
      clearTimeout(this.createPublishTaskDebounceTimer);
      this.createPublishTaskDebounceTimer = setTimeout(async () => {
        this.confirmPublishButtonLoading = true;
        const { data } = await this.createTask().catch((error) => {
          this.confirmPublishButtonLoading = false;
          throw new Error(`handleCreateTask, ${error}`);
        });
        this.taskId = data;
        this.steps.active = 1;
        this.confirmPublishButtonLoading = false;
        this.onClickRetryButton();
      }, 300);
    },
    async handleProgressTask() {
      const {
        data: { taskStatus = 4, taskCount = 1, successCount = 1 },
      } = await this.progressTask().catch((error) => {
        throw new Error(`handleProgressTask, ${error}`);
      });
      if (taskStatus === 2) {
        this.percentage = parseInt((successCount * 100) / taskCount);
      } else if (taskStatus === 200) {
        this.percentage = 100;
      } else {
        throw new Error(`handleProgressTask, taskStatus:${taskStatus}`);
      }
    },
    pollHandleProgressTask() {
      return new Promise((resolve, reject) => {
        setTimeout(async () => {
          try {
            await this.handleProgressTask();
            if (this.percentage === 100) {
              resolve();
            } else {
              await this.pollHandleProgressTask();
              resolve();
            }
          } catch (error) {
            reject(new Error(`pollHandleProgressTask, ${error}`));
          }
        }, 1000);
      });
    },
    onClickRetryButton() {
      clearTimeout(this.runPublishDebounceTimer);
      this.runPublishDebounceTimer = setTimeout(async () => {
        this.secondStepButtonWrapperVisible = false;
        this.retryButtonLoading = true;
        this.progressStatus = null;
        this.percentage = 0;
        this.tipText = "正在发布...";
        await this.runTask().catch((error) => {
          if (`${error}`.indexOf("timeout") === -1) {
            if (`${error}`.indexOf("任务已经执行成功") === -1) {
              this.secondStepButtonWrapperVisible = true;
              this.nextStepButtonVisible = false;
              this.progressStatus = "exception";
              this.tipText = "发布失败，请重试";
              this.retryButtonLoading = false;
              throw new Error(`onClickRetryButton, ${error}`);
            }
          }
        });
        await this.pollHandleProgressTask().catch((error) => {
          this.secondStepButtonWrapperVisible = true;
          this.nextStepButtonVisible = false;
          this.progressStatus = "exception";
          this.tipText = "发布失败，请重试";
          this.retryButtonLoading = false;
          throw new Error(`onClickRetryButton, ${error}`);
        });
        this.secondStepButtonWrapperVisible = true;
        this.tipText = "发布成功";
        this.nextStepButtonVisible = true;
        this.progressStatus = "success";
        this.retryButtonLoading = false;
      }, 300);
    },
    goToOpenBiz() {
      window.open(
        `//${window.env.extranetHost}:${window.location.port}/#/quick?id=${this.unitId}`,
        "_blank"
      );
    },
    goToOpenBizDetail() {
      this.$router.push({
        // path: "/openBiz/openBizDetail",
        name: "OpenBizOpenBizDetail",
        params: { id: this.unitId },
      });
    },
  },
  async created() {
    await this.handleGetBizUnitPreById().catch((error) => {
      throw new Error(`created, ${error}`);
    });
  },
};
</script>

<style lang="scss" scoped>
.publish {
  .menuTitle {
    padding: 0 12px;
    font-size: 16px;
    font-weight: 600;
    position: relative;
    &::before {
      content: "";
      display: block;
      width: 3px;
      height: 100%;
      background: #3c6ef0;
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  ::v-deep .my-step-bar {
    margin: 32px auto;
  }

  .stepForm {
    display: flex;
    flex-direction: column;
    align-items: center;
    .publishProgress {
      width: 50%;
    }
    .stepFormTip {
      text-align: center;
      margin: 8px auto;
      &.taskMessage {
        margin: 24px auto;
      }
      &.successMessage {
        color: #26a872;
      }
      &.errorMessage {
        color: #e1251b;
      }
    }
    .finishImage {
      width: 56px;
      margin: 0 auto;
    }
    .stepFormTitle {
      text-align: center;
      font-size: 24px;
      margin: 16px auto;
    }

    .buttonWrapper {
      display: flex;
      justify-content: center;
    }
  }
}
</style>