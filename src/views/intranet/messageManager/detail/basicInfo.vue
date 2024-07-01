<template>
  <div>
    <el-form
      :model="formData"
      :rules="formRules"
      ref="form"
      label-position="right"
      :class="['form-content', !editing && 'form-content-disabled']"
      label-width="70px"
      :disabled="!editing"
    >
      <el-form-item label="通道" prop="channel">
        <el-select
          v-model="formData.channel"
          filterable
          remote
          reserve-keyword
          placeholder="搜索你在LSB系统创建的通道"
          :remote-method="handleRemote"
          :loading="remoteInfo.loading"
          :disabled="+status !== 0"
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
          :disabled="+status !== 0"
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
      <el-form-item label="描述" prop="desc">
        <el-input
          type="textarea"
          :row="5"
          v-model="formData.desc"
          placeholder="说明清楚哪些业务场景会触发系统发送该消息"
          maxlength="500"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="标签" prop="tag">
        <el-select
          v-model="formData.tag"
          filterable
          remote
          reserve-keyword
          placeholder="搜索、输入你想要为消息打的标签"
          class="select"
        >
          <el-option
            v-for="item in tagsRemoteList"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="btn-content">
      <template v-if="editing">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
      <el-button
        type="primary"
        v-else
        :disabled="+status === 2 || +status === 4"
        @click="handleEdit"
        >编辑</el-button
      >
    </div>
  </div>
</template>
<script>
import gateway from "@/api/intranet/gateway/index.js";
let formOriginData = {};
export default {
  data() {
    return {
      editing: false, // 是否是编辑态
      formData: {
        channel: "",
        topic: "",
        cnName: "",
        desc: "",
        tag: "",
        status: -1
      },
      formRules: {
        channel: [
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
                    "请输入英文、数字、-、_并且首字母必须为英文，尾字母必须为英文、数字"
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
        desc: [
          {
            required: true,
            min: 5,
            max: 500,
            message: "请输入5-500个字符",
            trigger: "change"
          }
        ],
        tag: []
      },
      remoteInfo: {
        loading: false,
        options: []
      },
      tagsRemoteList: [],
    };
  },
  computed: {
    status() {
      // 0初始化; 1编辑中; 2审批中; 3已发布; 4已下线;
      return this.formData.status;
    }
  },
  watch: {},
  mounted() {
    this.getFormOriginData();
  },
  methods: {
    handleEdit() {
      this.editing = true;
      this.handleTagsRemote();
    },
    handleCancel() {
      this.editing = false;
      this.formData = Object.assign({}, formOriginData);
      this.clearFormValidate();
    },
    handleSave() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          const param = [this.formData];
          const response = await gateway.messageAccessService.saveMessageBaseInfo(
            param
          );
          const { code, data } = response || {};
          if (+code === 20000) {
            this.editing = false;
            this.$emit("updateBasicInfo", data);
            formOriginData = Object.assign({}, data);
          }
        }
      });
    },
    async getFormOriginData() {
      const param = [{ topic: this.$route.params.topic }];
      const response = await gateway.messageAccessService.queryMessageBaseInfo(
        param
      );
      const { code, data } = response || {};
      if (+code === 20000) {
        formOriginData = Object.assign({}, data);
        this.formData = Object.assign({}, data);
        this.clearFormValidate();
        this.$emit("updateBasicInfo", data);
      }
    },
    clearFormValidate() {
      !this.editing &&
        this.$nextTick(() => {
          this.$refs.form.clearValidate(Object.keys(this.formData));
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
    },
    async handleTagsRemote(keyWords) {
      if(this.tagsRemoteList.length) return;
      const param = [{ keyWords }];
      const response = await gateway.messageAccessService
        .queryApiCategory(param)
        .catch(error => {});
      const { code, data } = response || {};
      if (+code === 20000) {
        this.tagsRemoteList = (data || []);
      }
    }
  },
  name: "messageManagerDetailBasicInfo"
};
</script>
<style lang="scss" scoped>
.form-content {
  width: 50%;
  padding: 12px 0;
  .select {
    width: 100%;
  }
}
.btn-content {
  text-align: center;
}
.form-content-disabled::v-deep {
  .el-input,
  .el-textarea {
    .el-input__inner,
    .el-textarea__inner {
      border-color: transparent;
      background: transparent;
      color: rgb(51, 51, 51);
      cursor: default;
      resize: none;
      &::placeholder {
        color: transparent;
      }
    }
    .el-input__inner:hover {
      border-color: transparent;
    }
  }
}
</style>
