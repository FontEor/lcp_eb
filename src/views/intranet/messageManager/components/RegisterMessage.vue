<template>
  <div>
    <el-dialog
      title="注册消息"
      :visible.sync="dialogVisible"
      class="dialog-content"
      width="35%"
    >
      <template v-if="!registerSuccess">
        <div class="tip" v-if="showTip">
          <span class="el-icon-info"></span>
          <span class="tip-text">
            请确保你在
            <el-link
              type="primary"
              :underline="false"
              target="_blank"
              href="http://lsb.jdl.com/#"
              >LSB</el-link
            >
            系统开通了通道，详情请咨询dongguojun1。
          </span>
          <span class="el-icon-close" @click="() => (showTip = false)"></span>
        </div>
        <el-form
          :model="formData"
          :rules="formRule"
          ref="form"
          class="form-content"
          label-position="right"
          label-width="70px"
        >
          <el-form-item label="通道" prop="lsbChannel">
            <el-select
              v-model="formData.lsbChannel"
              filterable
              remote
              reserve-keyword
              placeholder="搜索你在LSB系统创建的通道"
              :remote-method="handleRemote"
              :loading="remoteInfo.loading"
              class="select"
            >
              <el-option
                v-for="item in remoteInfo.options"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="TOPIC" prop="topic">
            <el-input
              v-model="formData.topic"
              placeholder="示例：eclp_back_po_lop_message"
              maxlength="120"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="cnName">
            <el-input
              v-model="formData.cnName"
              placeholder="示例：五道口仓商品变更消息"
              maxlength="30"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input
              type="textarea"
              :row="5"
              v-model="formData.description"
              placeholder="说明清楚哪些业务场景会触发系统发送该消息"
              maxlength="500"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleRegister">注 册</el-button>
        </div>
      </template>
      <template v-else>
        <div class="success-content">
          <div class="entrySuccess">
            <i class="el-icon-success"></i>
          </div>
          <p class="success-tip">注册成功</p>
          <p>快去完善消息文档吧，完善后发布即可对外生效</p>
        </div>
        <div class="button-content">
          <el-button @click="initFormStatus">继续注册消息</el-button>
          <el-button type="primary" @click="handleSwitchRoute"
            >维护消息文档</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import gateway from "@/api/intranet/gateway/index.js";
const formOriginData = {
  lsbChannel: "",
  topic: "",
  cnName: "",
  description: ""
};
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    dialogVisible: {
      get() {
        if (!this.visible) {
          this.$emit("updateMessageList", this.registerSuccess);
        }
        return this.visible;
      },
      set(newVal) {
        this.$emit("update:visible", newVal);
      }
    }
  },
  watch: {
    visible: {
      handler(newVal) {
        if (newVal) {
          this.initFormStatus();
          this.showTip = true;
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      showTip: true,
      registerSuccess: false,
      formData: {},
      formRule: {
        lsbChannel: [
          {
            required: true,
            message: "请选择你在LSB系统创建的通道",
            trigger: "change"
          }
        ],
        topic: [
          {
            required: true,
            min: 2,
            max: 120,
            message: "长度为2-120个字符",
            trigger: "change"
          },
          {
            validator: (rule, value, callback) => {
              const reg = /^[a-zA-Z][\w\-]*[a-zA-Z0-9]$/;
              if (!reg.test(value)) {
                callback(
                  new Error(
                    "请输入英文、数字、-、_且首字母须为英文，尾字母须为英文、数字"
                  )
                );
                return;
              }
              callback();
            },
            trigger: "change"
          }
        ],
        cnName: [
          {
            required: true,
            min: 2,
            max: 30,
            message: "请输入2-30个字符",
            trigger: "change"
          }
        ],
        description: [
          {
            required: true,
            min: 5,
            max: 500,
            message: "请输入5-500个字符",
            trigger: "change"
          }
        ]
      },
      remoteInfo: {
        loading: false,
        options: []
      }
    };
  },
  methods: {
    handleRegister() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          const param = [this.formData];
          const response = await gateway.messageAccessService.registerMessage(
            param
          );
          const { code } = response || {};
          if (+code === 20000) {
            this.registerSuccess = true;
          }
        }
      });
    },
    initFormStatus() {
      this.registerSuccess = false;
      this.formData = Object.assign({}, formOriginData);
      this.remoteInfo = {
        loading: false,
        options: []
      };
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.resetFields();
      });
    },
    handleSwitchRoute() {
      this.$router.push({
        name: "messageManagerMessageDoc",
        params: { topic: this.formData.topic }
      });
    },
    async handleRemote(keyWords) {
      this.remoteInfo.loading = true;
      const param = [keyWords.trim()];
      const response = await gateway.messageAccessService
        .queryLsbChannel(param)
        .catch(error => {
          this.remoteInfo.loading = false;
        });
      const { code, data } = response || {};
      if (+code === 20000) {
        this.remoteInfo = {
          loading: false,
          options: [data] || []
        };
      }
    }
  },
  components: {},
  name: "RegisterMessage"
};
</script>
<style lang="scss" scoped>
.dialog-content {
  &::v-deep .el-dialog {
    min-width: 454px;
  }
}
.select {
  width: 100%;
}
.form-content {
  padding: 0 16px;
}
.tip {
  height: 32px;
  padding: 0 12px;
  line-height: 30px;
  background: rgb(245, 245, 245);
  border-radius: 4px;
  color: rgba(51, 51, 51, 0.6);
  font-size: small;
  display: flex;
  align-items: center;
  margin: -20px 0 12px 0;
  .tip-text {
    flex: 1;
    padding-left: 12px;
  }
}
.success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 65px 0;
  .entrySuccess {
    font-size: 46px;
    color: #60ca02;
  }
  .success-tip {
    font-size: 20px;
    padding: 20px 0;
    font-weight: bold;
  }
}
.button-content {
  text-align: right;
}
</style>
