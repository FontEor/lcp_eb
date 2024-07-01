<template>
  <div>
    <p class="protocol-desc">请填写API基本信息</p>
    <div class="protocol-content">
      <el-form
        :model="jsfForm"
        :rules="rules"
        ref="ruleForm"
        label-width="110px"
      >
        <el-form-item prop="pass">
          <span slot="label">
            JSF接口名&nbsp;<el-tooltip
              class="item"
              content="请求方式"
              placement="top"
              ><i style="color: #3c6ef0" class="el-icon-help"
            /></el-tooltip>
          </span>
          <el-col :span="18">
            <el-input v-model="jsfForm.pass"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item prop="checkPass">
          <span slot="label">
            API中文名称&nbsp;<el-tooltip
              class="item"
              content="请求方式"
              placement="top"
              ><i style="color: #3c6ef0" class="el-icon-help"
            /></el-tooltip>
          </span>
          <el-col :span="18">
            <el-input
              v-model="jsfForm.checkPass"
              placeholder="请输入API中文名称"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item prop="age">
          <span slot="label">
            所属应用&nbsp;<el-tooltip
              class="item"
              content="请求方式"
              placement="top"
              ><i style="color: #3c6ef0" class="el-icon-help"
            /></el-tooltip>
          </span>
          <el-col :span="18">
            <el-select
              style="width: 100%"
              v-model="jsfForm.value"
              placeholder="请选择API所属应用"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item prop="age">
          <span slot="label">
            所属分组&nbsp;<el-tooltip
              class="item"
              content="请求方式"
              placement="top"
              ><i style="color: #3c6ef0" class="el-icon-help"
            /></el-tooltip>
          </span>
          <el-col :span="18">
            <el-select
              style="width: 100%"
              v-model="jsfForm.value"
              placeholder="请选择API所属分组"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
          <!-- <el-col :span="6">
            <el-button type="text" @click="createGroup">+创建分组</el-button>
          </el-col> -->
        </el-form-item>
        <el-form-item>
          <el-button @click="previous">上一步</el-button>
          <el-button type="primary" @click="nextStep">下一步</el-button>
        </el-form-item>
      </el-form>
      <el-dialog title="创建应用" width="440px" :visible.sync="showAppDialog">
        <el-form :model="appForm">
          <el-form-item label-width="110px">
            <span slot="label">
              应用名称&nbsp;<el-tooltip
                class="item"
                content="请求方式"
                placement="top"
                ><i style="color: #3c6ef0" class="el-icon-help"
              /></el-tooltip>
            </span>
            <el-input
              v-model="appForm.name"
              autocomplete="off"
              placeholder="请输入应用中文名称"
            ></el-input>
          </el-form-item>
          <el-form-item label-width="110px">
            <span slot="label">
              应用描述&nbsp;<el-tooltip
                class="item"
                content="请求方式"
                placement="top"
                ><i style="color: #3c6ef0" class="el-icon-help"
              /></el-tooltip>
            </span>
            <el-input
              type="textarea"
              v-model="appForm.name"
              placeholder="请输入应用使用场景的描述"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showAppDialog = false">取 消</el-button>
          <el-button type="primary" @click="showAppDialog = false"
            >保 存</el-button
          >
        </div>
      </el-dialog>
      <el-dialog title="创建分组" width="500px" :visible.sync="showGroupDialog">
        <el-form :model="groupForm">
          <el-form-item label-width="110px">
            <span slot="label">
              分组英文名称<el-tooltip
                class="item"
                content="请求方式"
                placement="top"
                ><i style="color: #3c6ef0" class="el-icon-help"
              /></el-tooltip>
            </span>
            <el-input
              v-model="groupForm.name"
              autocomplete="off"
              placeholder="请输入分组编码"
            ></el-input>
          </el-form-item>
          <el-form-item label-width="110px">
            <span slot="label">
              分组中文名称<el-tooltip
                class="item"
                content="请求方式"
                placement="top"
                ><i style="color: #3c6ef0" class="el-icon-help"
              /></el-tooltip>
            </span>
            <el-input
              v-model="groupForm.name"
              autocomplete="off"
              placeholder="请输入分组中文名称"
            ></el-input>
          </el-form-item>
          <el-form-item label-width="110px">
            <span slot="label">
              分组描述&nbsp;<el-tooltip
                class="item"
                content="请求方式"
                placement="top"
                ><i style="color: #3c6ef0" class="el-icon-help"
              /></el-tooltip>
            </span>
            <el-input
              type="textarea"
              v-model="groupForm.name"
              placeholder="请输入分组使用场景的描述"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <span slot="label">
              发布范围&nbsp;<el-tooltip
                class="item"
                content="请求方式"
                placement="top"
                ><i style="color: #3c6ef0" class="el-icon-help"
              /></el-tooltip>
            </span>
            <el-radio v-model="groupForm.radio" label="1">发布到内网</el-radio>
            <el-radio v-model="groupForm.radio" label="2">发布到公网</el-radio>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showGroupDialog = false">取 消</el-button>
          <el-button type="primary" @click="showGroupDialog = false"
            >保 存</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      jsfForm: {},
      rules: {},
      appForm: {},
      groupForm: {},
      showAppDialog: false,
      showGroupDialog: false,
    };
  },
  mounted() {},
  methods: {
    nextStep() {
      this.$emit("next");
    },
    previous() {
      this.$emit("previous");
    },
    createGroup() {
      this.showGroupDialog = true;
    },
    createApp() {
      this.showAppDialog = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.protocol-desc {
  margin-top: 40px;
  font-size: 16px;
}
.protocol-content {
  width: 500px;
  margin: 40px auto;
}
</style>
