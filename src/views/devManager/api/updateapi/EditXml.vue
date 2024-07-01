<template>
  <div class="or">
    <el-row style="text-align: left">
      <el-col :push="3" :span="18">
        <codemirror
          ref="cmEditor"
          class="codemirror"
          :value.sync="codeData"
          :options="cmOptions"
          @ready="onCmReady"
          @focus="onCmFocus"
          @input="onCmCodeChange"
        />
      </el-col>
      <el-col :push="3" :span="18">
        <div class="tip" v-show="sta">
          <i class="el-icon-warning icon"></i>系统检测到API不符合<a
            :href="apiStandardUrl"
            style="color: #00bfff"
            >跨平台API定义规范</a
          >，由于调用方可能使用多种语言，为不影响其接入，请按照规范设计API
        </div>
      </el-col>
    </el-row>
    <br />
    <div style="text-align: center">
      <el-button type="" @click="prestep()">上一步</el-button>
      <el-button type="primary" style="" @click="next()">下一步</el-button>
    </div>
  </div>
</template>
<script>
import { codemirror } from "vue-codemirror";
// language
import "codemirror/mode/xml/xml.js";
// theme css
import "codemirror/theme/ttcn.css";
// require active-line.js
import "codemirror/addon/selection/active-line.js";
// closebrackets
import "codemirror/addon/edit/closebrackets.js";
//simplescrollbars
import "codemirror/addon/scroll/simplescrollbars.js";
import "codemirror/addon/scroll/simplescrollbars.css";

import request from "@/utils/request";
import gwApiRequest from '@/utils/gwApiRequest';
export default {
  components: {
    codemirror,
  },
  props: {
    apiMessage: Object,
  },
  data() {
    return {
      cmOptions: {
        autoCloseBrackets: true,
        tabSize: 2,
        styleActiveLine: true,
        mode: "xml",
        lineNumbers: true,
        line: true,
        theme: "ttcn",
        lineWrapping: true,
        scrollbarStyle: "simple",
      },
      codeData: String,
      sta: false,
      apiStandardUrl: "//lcp.jdl.com/#/apiNewHand/53036",
    };
  },
  created() {
    this.codeData = unescape(sessionStorage.getItem("apiXml"));
  },
  computed: {
    codemirror() {
      return this.$refs.cmEditor.codemirror;
    },
  },
  methods: {
    onCmReady(cm) {
      console.log("the editor is readied!", cm);
    },
    onCmFocus(cm) {
      console.log("the editor is focused!", cm);
    },
    onCmCodeChange(newCode) {
      // this.$emit("update:codeData", newCode);
      // sessionStorage.setItem("apiXml", escape(newCode));
      this.codeData = newCode;
      console.log("this is new code", newCode, this.codeData);
    },
    prestep() {
      sessionStorage.removeItem("apiXml");
      this.$emit("previous");
    },
    next() {
      this.verifyUpdateXml();
    },
    verifyUpdateXml() {
      const formData = new FormData();
      const blob = new Blob([this.codeData], { type: "text/xml" });
      formData.append("file", blob);
      formData.append("qualifiedName", this.$route.query.qualifiedName);
      gwApiRequest({
        method: "post",
        url: "/ApiManagerService/verifyApiForUpdate",
        data: formData,
        timeout: 3 * 60 * 1000,
      })
        .then((rsp) => {
          sessionStorage.removeItem("apiXml");
          sessionStorage.setItem("apiXml", escape(rsp.data.apiXml));
          this.apiMessage.apiupdatecompare = rsp.data;
          this.$emit("next");
          this.sta = false;
        })
        .catch((e) => {
          this.sta = true;
          console.log(e);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.codemirror {
  ::v-deep .CodeMirror {
    border: 1px solid #eee;
    height: 50vh;
  }
}
.tip {
  height: 23px;
  background-color: #fef3e9;
  margin-top: 5px;
  font-size: small;
  border-radius: 7px;
  padding-top: 3px;
}
.icon {
  padding-left: 5px;
  padding-right: 5px;
  color: #f49c00;
}
</style>
