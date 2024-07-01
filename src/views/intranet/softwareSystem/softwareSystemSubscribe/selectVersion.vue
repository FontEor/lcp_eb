<template>
  <div>
    <el-row>
      <el-col :offset="3" :span="16">
        <el-form
          :rules="rules"
          ref="subscribeVersionForm"
          :model="subscribeVersionForm"
          label-width="120px"
        >
          <el-form-item label="租户名称:" prop="tenementName">
            <el-input
              disabled
              v-model="subscribeVersionForm.tenementName"
            ></el-input>
          </el-form-item>
          <el-form-item label="租户编码:" prop="tenementCode">
            <el-input
              disabled
              v-model="subscribeVersionForm.tenementCode"
            ></el-input>
          </el-form-item>
          <el-form-item label="版本:" prop="versionName">
            <el-select
              v-model="versionInfo"
              filterable
              remote
              :remote-method="querySearch"
              value-key="id"
              @change="handleSelect"
              style="width: 100%"
              placeholder="请选择版本"
            >
              <el-option
                v-for="item in queryVersionOptions"
                :key="item.id"
                :label="item.name"
                :value="item"
              >
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{
                  item.code
                }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注:" prop="remark">
            <el-input
              type="textarea"
              :autosize="{ minRows: 3 }"
              maxlength="120"
              placeholder="请输入内容"
              show-word-limit
              v-model="subscribeVersionForm.remark"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <br />
    <div class="select-version-btn">
      <span class="dialog-footer" slot="footer">
        <el-button v-on:click="onCancel" type="default">取消</el-button>
        <el-button type="primary" v-on:click="next">下一步</el-button>
      </span>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";

export default {
  props: {
    tenementInfo: Object,
    systemMessage: Object,
    subscribeVersionForm: Object,
  },
  data() {
    var validateVersionName = (rule, value, callback) => {
      console.log("this.versionInfo", this.versionInfo);
      console.log("this.versionInfo.id", this.versionInfo.id);
      if (this.versionInfo.id !== null && this.versionInfo.id !== undefined) {
        callback();
      } else {
        callback(new Error("请选择版本"));
      }
    };
    return {
      rules: {
        versionName: [{ required: true, validator: validateVersionName }],
      },
      versionInfo: {},
      //版本列表，存储后端传过来的版本，全部的
      versionOptions: [],
      //模糊版本列表，用于模糊查询，符合匹配规则的
      queryVersionOptions: [],
    };
  },
  methods: {
    onCancel() {
      this.$emit("onCancel");
    },
    next() {
      this.$refs["subscribeVersionForm"].validate((valid) => {
        if (valid) {
          this.$emit("next");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**
     * 版本的模糊查询,前端根据后端传输的版本列表模糊匹配
     */
    querySearch(queryString) {
      console.log("查询次数", queryString);
      if (queryString !== null && queryString.trim() !== "") {
        this.queryVersionOptions = [];
        for (let index = 0; index < this.versionOptions.length; index++) {
          if (this.versionOptions[index].name.search(queryString) !== -1) {
            this.queryVersionOptions.push(this.versionOptions[index]);
          }
        }
      } else {
        this.queryVersionOptions = this.versionOptions;
      }
    },
    /**
     * 选择框选择时触发
     */
    handleSelect(item) {
      this.subscribeVersionForm.versionId = item.id;
      this.subscribeVersionForm.versionCode = item.code;
      this.subscribeVersionForm.versionName = item.name;
    },
    /**
     * 获得版本的候选列表
     */
    getVersionOptions() {
      let url = "/sysVersion/queryVersionList";
      request({
        url: url,
        method: "post",
        data: {
          productId: this.systemMessage.id,
          category: "MENUTREE",
          pageNum: 1,
          pageSize: 500,
        },
      })
        .then((rsp) => {
          console.log("版本候选列表", rsp.data);
          this.versionOptions = [];
          for (let index = 0; index < rsp.data.list.length; index++) {
            this.versionOptions.push({
              id: rsp.data.list[index].id,
              name: rsp.data.list[index].versionName,
              code: rsp.data.list[index].versionCode,
            });
          }
          this.queryVersionOptions = this.versionOptions;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },

  mounted() {
    //如果是第二步回到的第一步，则需要返显
    if (this.subscribeVersionForm.versionId !== 0) {
      this.versionInfo.id = this.subscribeVersionForm.versionId;
      this.versionInfo.code = this.subscribeVersionForm.versionCode;
      this.versionInfo.name = this.subscribeVersionForm.versionName;
    }
    this.getVersionOptions();
  },
};
</script>
<style lang="scss" scoped>
.select-version-btn {
  display: flex;
  justify-content: flex-end;
}
</style>