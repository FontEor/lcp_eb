<template>
  <div class="extension-point-log">
    <!-- 顶部提示 -->
    <el-alert
      v-show="computeAlertVisible"
      class="extension-point-log__alert"
      effect="dark"
      type="info"
      show-icon
      @close="closeAlert"
    >
      <pre class="pre">{{ tipContent }}</pre>
    </el-alert>

    <!-- 日志区域 -->
    <el-row class="extension-point-log__content">
      <!-- 左侧主要表单区域 -->
      <el-col :span="16" class="content__main-extension-point-log">
        <el-form
          class="main-extension-point-log-form"
          ref="mainExtensionPointLogForm"
          :model="mainExtensionPointLogFormData"
          :rules="mainExtensionPointLogFormRules"
          label-width="80px"
        >
          <!-- 表单第一行 -->
          <el-row>
            <el-col :span="8">
              <el-form-item label="运行环境" prop="env">
                <el-select
                  v-model="mainExtensionPointLogFormData.env"
                  placeholder="请选择运行环境"
                  style="width: 90%"
                >
                  <template
                    v-if="
                      env === 'local' ||
                      env === 'devtest' ||
                      env === 'publictest'
                    "
                  >
                    <el-option label="测试环境" value="test"></el-option>
                  </template>
                  <template v-else-if="env === 'uat' || env === 'prod'">
                    <el-option label="预发环境" value="uat"></el-option>
                    <el-option label="生产环境" value="production"></el-option>
                  </template>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="租户编码" prop="tenementCode">
                <el-input
                  v-model.trim="mainExtensionPointLogFormData.tenementCode"
                  placeholder="请输入租户编码"
                  style="width: 90%"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="扩展点" prop="spiCode">
                <el-select
                  v-model="mainExtensionPointLogFormData.spiCode"
                  placeholder="请输入扩展点"
                  style="width: 90%"
                  :clearable="true"
                >
                  <el-option
                    v-for="(item, index) in spiCodeOptionList"
                    :key="index"
                    :label="item.cnName"
                    :value="item.url"
                  >
                    <span style="float: left; margin-right: 8px">{{
                      item.cnName
                    }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">
                      {{ item.url }}
                    </span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 表单第二行 -->
          <el-row>
            <el-col :span="8">
              <el-form-item label="入参" prop="params">
                <el-input
                  v-model.trim="mainExtensionPointLogFormData.params"
                  placeholder="请输入关键词"
                  style="width: 90%"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出参" prop="result">
                <el-input
                  v-model.trim="mainExtensionPointLogFormData.result"
                  placeholder="请输入关键词"
                  style="width: 90%"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="账号" prop="pin">
                <el-input
                  v-model.trim="mainExtensionPointLogFormData.pin"
                  placeholder="请输入用户账号"
                  style="width: 90%"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 表单第三行 -->
          <el-row>
            <el-col :span="14">
              <el-form-item label="时间范围" prop="timeRange">
                <el-date-picker
                  v-model="mainExtensionPointLogFormData.timeRange"
                  type="datetimerange"
                  range-separator="-"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width: 100%"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-button
                type="primary"
                style="margin-left: 16px"
                @click="handleSearchSource"
                >查询</el-button
              >
            </el-col>
          </el-row>
        </el-form>
        <pre v-loading="mainLogLoading" class="main-extension-point-log-text">{{
          mainLog
        }}</pre>
      </el-col>
      <!-- 右侧次要表单区域 -->
      <el-col :span="8" class="content__aside-extension-point-log">
        <el-form
          class="aside-extension-point-log-form"
          ref="asideExtensionPointLogForm"
          :model="asideExtensionPointLogFormData"
          :rules="asideExtensionPointLogFormRules"
          label-width="80px"
        >
          <el-row>
            <el-col :span="16">
              <el-form-item label="traceID" prop="traceId">
                <el-input
                  v-model="asideExtensionPointLogFormData.traceId"
                  placeholder="请输入traceID"
                  style="width: 90%"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-button type="primary" @click="handleSearchTraceId"
                >查询</el-button
              >
            </el-col>
          </el-row>
        </el-form>
        <!-- 侧边日志区域 -->
        <div class="aside-extension-point-log-text-wrapper">
          <p class="aside-extension-point-log-title">
            日志第一段：底层通用SaaS系统触发扩展点
          </p>
          <pre
            v-loading="asideLogPartOneLoading"
            class="aside-extension-point-log-text"
            >{{ asideLogPartOne }}</pre
          >
          <p class="aside-extension-point-log-title">
            日志第二段：平台转发扩展点请求
          </p>
          <pre
            v-loading="asideLogPartTwoLoading"
            class="aside-extension-point-log-text"
            >{{ asideLogPartTwo }}</pre
          >
          <p class="aside-extension-point-log-title">
            日志第三段：扩展应用执行扩展逻辑
          </p>
          <pre
            v-loading="asideLogPartThreeLoading"
            class="aside-extension-point-log-text"
            >{{ asideLogPartThree }}</pre
          >
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import TagTip from "@/components/common/TagTip.vue";
import appManager from "@/api/intranet/appManager/index.js";

export default {
  name: "ExtensionPointLog",
  components: { TagTip },
  props: {
    appCode: {
      type: String,
      required: true,
    },
    productCode: {
      type: String,
      required: true,
    },
    productDomainName: {
      type: String,
      required: true,
    },
    productUatDomainName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      env: window.env.buildEnv,
      // 顶部警告提示
      alertVisibleList:
        JSON.parse(localStorage.getItem("alertVisibleList")) || [],
      tipContent: `日志工具使用方法：
1.每次扩展点调用都会产生三段日志（底层通用SaaS系统触发扩展点、开放平台寻找扩展点的实现、执行应用中的扩展点的实现），您可通过日志定位问题出现在哪个阶段。
2.建议您先通过左侧日志工具，定位到某次扩展点调用的traceID，再通过右侧日志工具查看本次扩展点调用的三段日志，如果缺失了哪段日志，证明这段日志对应的系统出了问题。
3.如果您可以完整地看到三段日志，但系统仍未按您预期的逻辑运行，请先自行排查扩展应用中的问题，再联系SaaS系统提供方排查问题。`,
      // 左侧查询表单
      mainExtensionPointLogFormData: {
        env: "",
        tenementCode: "",
        spiCode: "",
        params: "",
        result: "",
        pin: "",
        timeRange: [],
      },
      mainExtensionPointLogFormRules: {
        env: [{ required: true, message: "请选择运行环境" }],
        tenementCode: [{ required: true, message: "请选择租户编码" }],
      },
      // 扩展点选项列表
      spiCodeOptionList: [],
      mainLog: ``,
      mainLogLoading: false,
      // 右侧查询表单
      asideExtensionPointLogFormData: { traceId: "" },
      asideExtensionPointLogFormRules: {
        traceId: [{ required: true, message: "请输入traceID" }],
      },
      asideLogPartOne: ``,
      asideLogPartOneLoading: false,
      asideLogPartTwo: ``,
      asideLogPartTwoLoading: false,
      asideLogPartThree: ``,
      asideLogPartThreeLoading: false,
    };
  },
  computed: {
    // 计算顶部警告提示是否显示
    computeAlertVisible() {
      return !this.alertVisibleList.includes("extensionPointLog");
    },
  },
  methods: {
    // 日志工具-查询扩展点实现列表
    async queryListAll() {
      const { appCode } = this;
      const params = { appCode };
      return await appManager.queryListAll(params).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("queryListAll");
      });
    },
    // 日志工具-模糊查询
    async source() {
      const { productCode } = this;
      const { env, tenementCode, params, result, pin, timeRange } =
        this.mainExtensionPointLogFormData;
      const [startTime, endTime] = timeRange;
      let { spiCode = "" } = this.mainExtensionPointLogFormData;
      const { productDomainName, productUatDomainName } = this;
      console.log(productDomainName, productUatDomainName);
      const hashMap = {
        test: productUatDomainName,
        uat: productUatDomainName,
        production: productDomainName,
      };
      spiCode = spiCode && `${hashMap[env]}${spiCode}`;
      const query = {
        productCode,
        env,
        tenementCode,
        spiCode,
        params,
        result,
        pin,
        startTime,
        endTime,
      };
      return await appManager.source(query).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("source");
      });
    },
    // 日志工具-根据traceId查询
    async traceId() {
      const { productCode } = this;
      const { env, timeRange } = this.mainExtensionPointLogFormData;
      const [startTime, endTime] = timeRange;
      const { traceId } = this.asideExtensionPointLogFormData;
      const params = {
        productCode,
        env,
        startTime,
        endTime,
        traceId,
      };
      return await appManager.traceId(params).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("traceId");
      });
    },

    // 关闭警告时，记录下次不显示
    closeAlert() {
      this.alertVisibleList.push("extensionPointLog");
      this.alertVisibleList = Array.from(new Set(this.alertVisibleList));
      localStorage.setItem(
        "alertVisibleList",
        JSON.stringify(this.alertVisibleList)
      );
    },
    // 获取扩展点选择框列表
    async reloadSpiCodeOptionList() {
      const response = await this.queryListAll().catch(() => {
        throw new Error("reloadSpiCodeOptionList");
      });
      const { data } = response.data;
      const { list } = data;
      this.spiCodeOptionList = list || [];
    },
    // 点击左侧区域按钮查询操作
    handleSearchSource() {
      this.$refs.mainExtensionPointLogForm.validate(async (valid) => {
        if (valid) {
          this.mainLogLoading = true;
          const response = await this.source().catch(() => {
            throw new Error("handleSearchSource");
          });
          const { data } = response.data;
          this.mainLog = (data && data.length > 0 && data.join("\n\n")) || "";
          setTimeout(() => {
            this.mainLogLoading = false;
          }, 1000);
        } else {
          return false;
        }
      });
    },
    // 点击右侧区域按钮输入traceID查询操作
    handleSearchTraceId() {
      const propList = ["env"];
      let hasError = true;
      this.$refs.mainExtensionPointLogForm.validateField(
        propList,
        async (errorMessage) => {
          if (!errorMessage) {
            this.$refs.asideExtensionPointLogForm.validateField(
              "traceId",
              (asideErrorMessage) => {
                if (!asideErrorMessage) {
                  hasError = false;
                } else {
                  return false;
                }
              }
            );
          } else {
            this.$refs.asideExtensionPointLogForm.validateField("traceId");
            return false;
          }
        }
      );
      if (!hasError) {
        this.$refs.asideExtensionPointLogForm.validate(async (valid) => {
          if (valid) {
            this.asideLogPartOneLoading = true;
            this.asideLogPartTwoLoading = true;
            this.asideLogPartThreeLoading = true;
            const response = await this.traceId().catch(() => {
              throw new Error("handleSearchTraceId");
            });
            const { data } = response.data;
            const { Source, Route, Handler } = data;
            this.asideLogPartOne =
              (Source && Source.length > 0 && Source.join("\n\n")) || "";
            this.asideLogPartTwo =
              (Route && Route.length > 0 && Route.join("\n\n")) || "";
            this.asideLogPartThree =
              (Handler && Handler.length > 0 && Handler.join("\n\n")) || "";
            setTimeout(() => {
              this.asideLogPartOneLoading = false;
              this.asideLogPartTwoLoading = false;
              this.asideLogPartThreeLoading = false;
            }, 1000);
          } else {
            return false;
          }
        });
      }
    },
  },
  created() {
    this.reloadSpiCodeOptionList();
  },
};
</script>

<style lang="scss" scoped>
.extension-point-log {
  margin-top: 8px;
  // 顶部警告提示
  .extension-point-log__alert {
    background-color: #f5f5f5;
    ::v-deep .el-alert__icon {
      color: #999;
      font-size: 12px;
    }
    ::v-deep .el-alert__closebtn {
      color: #999;
    }
    .pre {
      color: #999;
      white-space: pre-line;
    }
  }
  // 日志区域
  .extension-point-log__content {
    margin-top: 8px;
    // 左侧主要表单区域
    .content__main-extension-point-log {
      border-right: 1px solid #dcdfe6;
      .main-extension-point-log-form {
      }
      .main-extension-point-log-text {
        margin: 0 auto;
        width: 95%;
        height: 60vh;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        white-space: pre-line;
        overflow: auto;
      }
    }
    // 右侧次要表单区域
    .content__aside-extension-point-log {
      .aside-extension-point-log-form {
        margin-bottom: -2px;
      }
      .aside-extension-point-log-text-wrapper {
        .aside-extension-point-log-title {
          margin: 8px auto;
          width: 90%;
        }
        .aside-extension-point-log-text {
          margin-left: 16px;
          height: 20vh;
          border: 1px solid #dcdfe6;
          border-radius: 4px;
          white-space: pre-line;
          overflow: auto;
        }
      }
    }
  }
}
</style>