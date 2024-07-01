<template>
  <div>
    <div
      v-if="apiupdatecompare.publish"
      style="color: red; margin-bottom: 20px; margin-left: 40px"
    >
      注意：删除方法或变更方法可能导致原有调用方无法正常使用！
    </div>

    <div style="margin-bottom: 10px">更新记录</div>
    <el-input
      type="textarea"
      v-model="logcontent"
      maxlength="500"
      :rows="6"
      show-word-limit
    ></el-input>
    <div class="mt40">
      <el-button type="default" @click="prestep">上一步</el-button>
      <el-button type="primary" @click="saveupdateapi">保存并提交</el-button>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";
import { Loading } from "@lui/lui-ui";

export default {
  props: {
    apiMessage: Object,
  },
  data() {
    return {
      apiupdatecompare: "",
      logcontent: "",
    };
  },
  mounted() {
    this.apiupdatecompare = this.apiMessage.apiupdatecompare;
    if (this.apiupdatecompare) {
      let newMethodMap = this.handlerStr(
        "新增方法:",
        this.apiupdatecompare.newMethodMap
      );
      let dropMethodMap = this.handlerStr(
        "删除方法:",
        this.apiupdatecompare.dropMethodMap
      );
      let modifyMethodMap = this.handlerStr(
        "修改方法:",
        this.apiupdatecompare.newModifyMethodMap
      );
      let joinStr = "";
      if (newMethodMap) {
        joinStr = newMethodMap + "。";
      }
      if (dropMethodMap) {
        joinStr = joinStr + dropMethodMap + "。";
      }
      if (modifyMethodMap) {
        joinStr = joinStr + modifyMethodMap + "。";
      }
      this.logcontent = joinStr;
    }
  },
  methods: {
    saveupdateapi() {
      if (
        this.apiupdatecompare &&
        this.apiupdatecompare.hasOwnProperty("remark")
      ) {
        if (this.logcontent.length >= 500) {
          this.$message.error("更新内容长度不能大于500个字符!");
          return false;
        }
        let loadingInstance = Loading.service({
          fullscreen: true,
          text: "数据更新中请稍等...",
        });
        let url = "/api/saveApiForUpdate";
        this.apiupdatecompare.remark = this.logcontent;
        this.apiupdatecompare.registerType = this.apiMessage.registerType;
        this.apiupdatecompare.jsfAlias = this.apiMessage.jsfDate.jsfAlias;
        request({
          headers: {
            "Content-Type": "application/json",
          },
          url: url,
          method: "post",
          data: JSON.stringify(this.apiupdatecompare),
          timeout: 3 * 60 * 1000,
        })
          .then((rsp) => {
            loadingInstance.close();

            this.apiMessage.id = rsp.data.apiInstanceId;
            this.apiMessage.apiupdatecompare = this.apiupdatecompare;
            this.$emit("next");
          })
          .catch((e) => {
            console.log(e);
            loadingInstance.close();
          });
      } else {
        this.$message.error("传递对象不能为空!请重新上传更新文件!");
      }
    },
    /**
     * 处理字符串
     */
    handlerStr(pre, methodMap) {
      let retStr = pre;
      if (methodMap) {
        for (let key in methodMap) {
          retStr = retStr + key + ",";
        }
        retStr =
          retStr.substring(retStr.length - 1) == ","
            ? retStr.substring(0, retStr.length - 1)
            : retStr;
      }
      if (retStr == pre) {
        retStr = null;
      }
      return retStr;
    },
    /**
     * 上一步
     */
    prestep() {
      this.apiMessage.apiupdatecompare = this.apiupdatecompare;
      this.$emit("previous");
    },
  },
};
</script>
