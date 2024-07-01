<template>
  <el-dialog
    :visible="createClusterDialogVisible"
    :close-on-click-modal="false"
    @close="dialogBeforeClose"
    title="创建集群"
    width="800px"
    class="create-cluster-dialog"
  >
    <div class="create-cluster-dialog__content">
      <!-- 创建集群步骤条 -->
      <el-steps :active="active" finish-status="success" align-center>
        <el-step
          v-for="(item, index) in stepList"
          :key="index"
          :title="item.title"
        ></el-step>
      </el-steps>

      <!-- 第一步填写基本信息 -->
      <el-form
        v-show="active === 0"
        :model="clusterBasicInfoData"
        :rules="clusterBasicInfoRules"
        ref="clusterBasicInfoData"
        label-width="80px"
        class="create-cluster-dialog__form"
      >
        <el-form-item label="集群名称" prop="name">
          <el-input
            v-model.trim="clusterBasicInfoData.name"
            placeholder="请输入集群名称"
            style="width: 100%"
          ></el-input>
        </el-form-item>
        <el-form-item label="集群用途" prop="useType">
          <el-select
            v-model="clusterBasicInfoData.useType"
            placeholder="请选择集群用途"
            style="width: 100%"
          >
            <el-option
              v-for="item in useTypeOptionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="集群类型" prop="type">
          <el-select
            v-model="clusterBasicInfoData.type"
            placeholder="请选择集群类型"
            style="width: 100%"
          >
            <el-option
              v-for="item in typeOptionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="集群描述" prop="desc">
          <el-input
            type="textarea"
            v-model.trim="clusterBasicInfoData.desc"
            placeholder="请描述集群的使用场景"
            style="width: 100%"
          ></el-input>
        </el-form-item>
      </el-form>

      <!-- 第二步添加IP端口 -->
      <el-form
        v-show="active === 1"
        :model="addIpPortData"
        :rules="addIpPortRules"
        class="create-cluster-dialog__second-form"
        ref="addIpPortData"
      >
        <el-table :data="addIpPortData.cloudServerList" max-height="180">
          <el-table-column
            v-for="(item, index) in cloudServerListColumnList"
            :key="index"
            :label="item.label"
            :prop="item.prop"
            :width="item.width"
          >
            <template slot-scope="{ $index }">
              <!-- IP/域名 -->
              <template v-if="item.prop === 'host'">
                <el-form-item
                  :prop="`cloudServerList[${$index}].host`"
                  :rules="addIpPortRules.host"
                >
                  <div class="item-content">
                    <el-select
                      v-model="addIpPortData.cloudServerList[$index].resolve"
                      style="width: 40%"
                    >
                      <el-option
                        v-for="item in resolveOptionList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                    <el-input
                      v-model.trim="addIpPortData.cloudServerList[$index].host"
                      :placeholder="judgeHostPlaceholder($index)"
                      style="width: 60%"
                    ></el-input>
                  </div>
                </el-form-item>
              </template>
              <!-- 端口 -->
              <template v-else-if="item.prop === 'port'">
                <el-form-item
                  :prop="`cloudServerList[${$index}].port`"
                  :rules="addIpPortRules.port"
                >
                  <el-input
                    v-model.number="addIpPortData.cloudServerList[$index].port"
                    placeholder="端口"
                    style="width: 100%"
                  ></el-input>
                </el-form-item>
              </template>
              <!-- 权重 -->
              <template v-else-if="item.prop === 'weight'">
                <el-form-item
                  :prop="`cloudServerList[${$index}].weight`"
                  :rules="addIpPortRules.weight"
                >
                  <el-input
                    v-model.number="
                      addIpPortData.cloudServerList[$index].weight
                    "
                    placeholder="权重"
                    style="width: 100%"
                  ></el-input>
                </el-form-item>
              </template>
              <!-- 是否备用 -->
              <template v-else-if="item.prop === 'isBackup'">
                <el-form-item
                  :prop="`cloudServerList[${$index}].isBackup`"
                  :rules="addIpPortRules.isBackup"
                >
                  <el-select
                    v-model="addIpPortData.cloudServerList[$index].isBackup"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in isBackupOptionList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </template>
              <!-- 是否停用 -->
              <template v-else-if="item.prop === 'down'">
                <el-form-item
                  :prop="`cloudServerList[${$index}].down`"
                  :rules="addIpPortRules.isBackup"
                >
                  <el-select
                    v-model="addIpPortData.cloudServerList[$index].down"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in downOptionList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ $index }">
              <div class="icon-wrapper">
                <i
                  v-if="$index > 0"
                  class="el-icon-delete"
                  @click="removeRowData($index)"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="button-wrapper">
          <el-button icon="el-icon-plus" plain @click="addRowData"
            >添加</el-button
          >
        </div>
      </el-form>

      <!-- 第三步设置超时时间 -->
      <el-form
        v-show="active === 2"
        :model="setTheTimeoutData"
        :rules="setTheTimeoutRules"
        ref="setTheTimeoutData"
        label-width="140px"
        class="create-cluster-dialog__form"
      >
        <el-form-item
          v-for="(item, index) in setTheTimeoutList"
          :key="index"
          :label="item.label"
          :prop="item.prop"
        >
          <el-input-number
            v-model="setTheTimeoutData[item.prop]"
            :min="1"
            :step="100"
            :precision="0"
            controls-position="right"
          ></el-input-number>
        </el-form-item>
      </el-form>

      <!-- 最后一步创建成功 -->
      <div v-show="active === 3" class="create-success">
        <i class="el-icon-success normalColor" />
        <p class="create-success__title">创建成功</p>
      </div>
    </div>

    <div slot="footer" class="create-cluster-dialog__footer">
      <div v-if="active === 0" class="button-wrapper">
        <el-button type="primary" @click="nextStep">下一步</el-button>
      </div>
      <div v-else-if="active === 1 || active === 2" class="button-wrapper">
        <el-button @click="active -= 1">上一步</el-button>
        <el-button
          type="primary"
          :loading="nextStepLoading"
          @click="nextStep"
          >{{ computeNextStepText }}</el-button
        >
      </div>
      <div v-else-if="active === 3" class="button-wrapper">
        <el-button type="primary" @click="continueCreate">继续创建</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import basicInfo from "@/api/intranet/apiManager/httpDetail/basicInfo.js";

export default {
  name: "CreateClusterDialog",
  props: {
    createClusterDialogVisible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    const validateHost = (rule, value, callback, source) => {
      const sourceKey = Object.keys(source)[0];
      const startIndex = sourceKey.indexOf("[") + 1;
      const endIndex = sourceKey.indexOf("]");
      const index = sourceKey.slice(startIndex, endIndex);
      if (this.addIpPortData.cloudServerList[index].resolve === 0) {
        // 当前表单项选择输入IP
        if (value === "") {
          callback(new Error("请输入IP"));
        } else {
          const reg = RegExp(
            /^((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)){3}$/
          );
          if (reg.test(value)) {
            callback();
          } else {
            callback(new Error("请输入正确的IP"));
          }
        }
      } else if (this.addIpPortData.cloudServerList[index].resolve === 1) {
        // 当前表单项选择输入域名
        if (value === "") {
          callback(new Error("请输入域名"));
        } else {
          const reg = RegExp(
            /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/
          );
          if (reg.test(value)) {
            callback();
          } else {
            callback(new Error("请输入正确的域名"));
          }
        }
      } else {
        callback(new Error("请选择IP/域名"));
      }
    };

    return {
      active: 0,
      stepList: [
        { title: "填写基本信息" },
        { title: "添加IP端口" },
        { title: "设置超时时间" },
        { title: "创建成功" },
      ],

      // 填写基本信息
      clusterBasicInfoData: { name: "", useType: null, type: null, desc: "" },
      clusterBasicInfoRules: {
        name: [
          { required: true, message: "请输入集群名称" },
          {
            pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]*$/,
            message: "请输入中文、英文字母或数字",
          },
          {
            min: 2,
            max: 20,
            message: "请输入2到20个字符",
          },
        ],
        useType: [{ required: true, message: "请选择集群用途" }],
        type: [{ required: true, message: "请选择集群类型" }],
        desc: [{ required: true, message: "请描述集群的使用场景" }],
      },
      useTypeOptionList: [{ value: 1, label: "服务路由" }],
      typeOptionList: [
        { value: 2, label: "HTTP服务" },
        { value: 3, label: "HTTP流" },
      ],

      // 添加IP端口
      addIpPortData: {
        cloudServerList: [
          { host: "", port: null, weight: 1, isBackup: 0, down: 0, resolve: 0 },
        ],
      },
      addIpPortRules: {
        host: [{ validator: validateHost }],
        port: [
          { required: true, message: "请输入端口" },
          {
            pattern: /^[0-9]*$/,
            message: "请输入数字",
          },
        ],
        weight: [
          { required: true, message: "请输入权重" },
          {
            pattern: /^[0-9]*$/,
            message: "请输入数字",
          },
        ],
      },
      cloudServerListColumnList: [
        { label: "IP/域名", prop: "host", width: "240" },
        { label: "端口", prop: "port" },
        { label: "权重", prop: "weight" },
        { label: "是否备用", prop: "isBackup" },
        { label: "是否停用", prop: "down" },
      ],
      resolveOptionList: [
        { value: 0, label: "IP" },
        { value: 1, label: "域名" },
      ],
      isBackupOptionList: [
        { value: 0, label: "否" },
        { value: 1, label: "是" },
      ],
      downOptionList: [
        { value: 0, label: "否" },
        { value: 1, label: "是" },
      ],

      // 设置超时时间
      setTheTimeoutData: {
        connectTimeout: 500,
        readTimeout: 5000,
        sendTimeout: 5000,
        reliveTimeout: 10000,
      },
      setTheTimeoutRules: {
        connectTimeout: [{ required: true, message: "请设置连接超时时间/ms" }],
        readTimeout: [{ required: true, message: "请设置读取超时时间/ms" }],
        sendTimeout: [{ required: true, message: "请设置发送超时时间/ms" }],
        reliveTimeout: [{ required: true, message: "请设置自动复活时间/ms" }],
      },
      setTheTimeoutList: [
        { label: "连接超时时间/ms", prop: "connectTimeout" },
        { label: "读取超时时间/ms", prop: "readTimeout" },
        { label: "发送超时时间/ms", prop: "sendTimeout" },
        { label: "自动复活时间/ms", prop: "reliveTimeout" },
      ],
      nextStepLoading: false,
    };
  },
  computed: {
    computeNextStepText() {
      return this.active === 2 ? "保存" : "下一步";
    },
  },
  methods: {
    async cloudClusterSave() {
      const { name, useType, type, desc } = this.clusterBasicInfoData;
      const { cloudServerList } = this.addIpPortData;
      const { connectTimeout, sendTimeout, readTimeout, reliveTimeout } =
        this.setTheTimeoutData;
      const data = {
        name,
        useType,
        type,
        desc,
        cloudServerList,
        connectTimeout,
        sendTimeout,
        readTimeout,
        reliveTimeout,
        sceneType: 1,
      };
      return await basicInfo.cloudClusterSave(data).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error(error);
      });
    },

    judgeHostPlaceholder(index) {
      const hashMap = { 0: "请输入IP", 1: "请输入域名" };
      const value = this.addIpPortData.cloudServerList[index].resolve;
      return hashMap[value];
    },
    addRowData() {
      this.addIpPortData.cloudServerList.push({
        host: "",
        port: null,
        weight: 1,
        isBackup: 0,
        down: 0,
        resolve: 0,
      });
    },
    removeRowData(index) {
      this.addIpPortData.cloudServerList.splice(index, 1);
    },

    dialogBeforeClose() {
      const formList = [
        "clusterBasicInfoData",
        "addIpPortData",
        "setTheTimeoutData",
      ];
      formList.forEach((item) => {
        this.$refs[item].resetFields();
      });
      this.active = 0;
      this.$emit("update:createClusterDialogVisible", false);
      this.$emit("queryRefresh", true);
    },
    // 下一步
    nextStep() {
      const hashMap = {
        0: "clusterBasicInfoData",
        1: "addIpPortData",
        2: "setTheTimeoutData",
      };
      this.$refs[hashMap[this.active]].validate(async (valid) => {
        if (valid) {
          if (this.active === 2) {
            this.nextStepLoading = true;
            await this.cloudClusterSave().catch((error) => {
              this.nextStepLoading = false;
              const { message } = error.data;
              message && this.$message.error(message);
              throw new Error(error);
            });
          }
          this.active += 1;
          this.nextStepLoading = false;
        } else {
          return false;
        }
      });
    },
    // 继续创建
    continueCreate() {
      const formList = [
        "clusterBasicInfoData",
        "addIpPortData",
        "setTheTimeoutData",
      ];
      formList.forEach((item) => {
        this.$refs[item].resetFields();
      });
      this.active = 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.create-cluster-dialog {
  .create-cluster-dialog__content {
    height: 280px;
    .el-steps {
      width: 640px;
      margin: 0 auto;
      margin-bottom: 16px;
    }
    .create-cluster-dialog__form {
      width: 320px;
      margin: 0 auto;
    }
    .create-cluster-dialog__second-form {
      width: 720px;
      margin: 0 auto;
      .item-content {
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
      .el-table {
        ::v-deep .cell {
          overflow: visible;
          .icon-wrapper {
            margin-top: -20px;
            .el-icon-delete {
              cursor: pointer;
            }
          }
        }
      }
      .button-wrapper {
        margin-top: 8px;
        display: flex;
        justify-content: center;
        .el-button {
          width: 100%;
          border: 1px dashed #ddd;
          color: #606266;
          transition: all 0.3s;
          &:hover {
            border: 1px dashed #409eff;
            color: #409eff;
          }
        }
      }
    }
    .create-success {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .el-icon-success {
        font-size: 64px;
        margin: 24px;
      }
      .create-success__title {
        font-size: 24px;
      }
    }
  }
  .create-cluster-dialog__footer {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>