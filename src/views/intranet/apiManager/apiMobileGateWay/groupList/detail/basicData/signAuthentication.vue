<template>
  <div class="background" v-if="algorithmList!==null&&algorithmList.length!==0">
    <el-row class="top">
      <el-col :span="17">
        <div class="com-view-dep com-tit-view">
          <div class="tit-wrap1">
            <h3 class="tit1">签名认证</h3>
            <el-button
                v-if="!edit&&isShowUsedSignAlgorithm"
                type="text"
                style="padding: 0px"
                @click="computedWhichAlgorithm"
                :disabled="editeDisabled"

            >
              <h3 class="tit2">{{ usedAlgorithmDesc[usedAlgorithmIndex] }}</h3>
            </el-button>
          </div>
          <div class="describe">
            API调用方使用应用的appkey、appsecret、指定算法进行签名，物流开放平台通过签名识别调用方身份。
          </div>
        </div>
      </el-col>
      <!--展示当前的插件的状态-->
      <el-col v-if="!edit" :span="4">
        <div
            :class="couputedStatusColor"
            style="margin: 30px;text-align: right;"
        >
          {{ computedShowStatusDescr }}
        </div>
      </el-col>
      <!--     设置按钮点击展示选项  -->
      <div>
        <el-col v-if="!edit" :span="3">
          <div style="margin: 25px">
            <el-button
                main
                :disabled="editeDisabled"
                @click="showItems">
              设置
            </el-button>
          </div>
        </el-col>
      </div>
    </el-row>
    <!--具体的可选项-->
    <div v-if="edit">
      <el-row style="margin-left: 20px">
        <el-col :span="24">
          <el-radio-group v-model="signAlgorithmSelectedIndex" style="margin-right: 0px">
            <el-radio value="1" label="hmac-auth">
              <el-button type="text"
                         style="padding: 0px;"
                         @click="showItemsDetails('hmac-auth')"
              >
                <span style="color: #333333">平台通过md5-salt签名规则></span>
              </el-button>
              <span v-if="computedHmacAuthShowStatus" class="status">{{ computedPassportAuthStatus }}</span>
            </el-radio>

          </el-radio-group>
          <el-button v-if="signAlgorithmSelectedIndex!=''"
                     plain
                     size="small"
                     style="margin-left: 20px; background-color: #fafafa"
                     @click="clearPlugins"
          >
            <img style="width: 13px; height: 13px"
                 src="@/assets/rubber.png"/>
            <span style="color: #999999">清空</span>
          </el-button>
        </el-col>
      </el-row>
      <div style="text-align: center">
        <el-button @click="closeSingDialog">取消</el-button>
        <el-button type="primary" @click="save">保存
        </el-button>
      </div>
    </div>

    <!-- 展示第一个签名方式-->
    <div v-if="showDetailsIndex>-1">
      <el-dialog title="签名规则详情" :visible.sync="dialogDetailsDetVisible" width="600px">
        <div class="menuHeader">
          <h2 class="menuTitle">基本信息</h2>
        </div>
        <div style="margin: 20px">
          名称：{{ signAlgorithmList[showDetailsIndex].templateName }}
        </div>
        <div style="margin: 20px">
          简介：{{ signAlgorithmList[showDetailsIndex].templateDesc }}
        </div>
        <div class="menuHeader">
          <h2 class="menuTitle">签名方式</h2>
        </div>
        <div style="margin: 20px">
          签名参数：{{ Params }}
        </div>
        <div style="margin: 20px">
          签名参数排序规则：{{ rule }}
        </div>
        <div style="margin: 20px">
          名称：{{ signAlgorithmList[showDetailsIndex].templateCode }}
        </div>
        <div style="text-align: center">
          <el-button type="primary" @click="dialogDetailsDetVisible=false">关闭
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
  <!--  签名详细信息-->
</template>
<script>
import gwApiRequest from "@/utils/gwApiRequest";

export default {
  props: ["editeDisabled", "algorithmList"],
  name: "signAuthentication",
  data() {
    return {
      edit: false,
      statusIndex: null,
      statusValue: {
        null: "",
        "0": "已设置，待发布",
        "1": "使用中",
        "2": "已清空，待发布",
        "3": "取消设置，已发布"
      },
      signAlgorithmSelectedIndex: "",
      dialogDetailsDetVisible: false,
      signAlgorithmList: null,
      usedAlgorithmIndex: "",
      usedAlgorithmDesc: {
        "": "",
        "hmac-auth": "平台通用MD5签名规则 >",
        "hmac-sha1": "平台通用hmac-sha1签名规则 >"
      },
      templateCodeMap: {
        "": "",
      },
      showDetailsIndex: -1,
      isHasClearAction: false,
    }
  },
  methods: {
    showItemsDetails(methodName) {
      this.showDetailsIndex = this.templateCodeMap[methodName];
      if (!(this.showDetailsIndex > -1))
        return;
      this.edit = true;
      this.dialogDetailsDetVisible = true;
    },
    showItems() {
      this.edit = true;
    },
    clearPlugins() {
      this.signAlgorithmSelectedIndex = "";
      this.isHasClearAction = true;
    },
    //取消--->关闭签名编辑
    closeSingDialog() {
      this.init();
      this.edit = false;
      this.dialogDetailsDetVisible = false;
    },
    //计算显示具体哪一个算法配置详情
    computedWhichAlgorithm() {
      this.showDetailsIndex = this.templateCodeMap[this.usedAlgorithmIndex];
      if (!(this.showDetailsIndex > -1))
        return;
      this.edit = true;
      this.dialogDetailsDetVisible = true;
    },
    /**
     * 1,如过当前有插件处于非选中态，则返回false
     * 2,如果选中和之前选中一样，则当前是一个更新操作
     * 3，如果当前选中和初始选中状态不是一个，那么是一个更换插件的动作(插件互斥)则执行先清除原始，再保存新插件操作，

     * 如果点击了清除按钮，
     * 1，判断是否是一个有效清除动作，
     * 2，invalidCleanUp如果当前无选中，且原始无选中，返回true 无效清除流程结束
     * 3，如果invalidCleanUp返回了false,进一步判断是否是有效清除动作
     * 4，如果之前有选中，且之前的状态为已设置待发布和使用中(0,1),且现在未选中，这是一个真清除，执行清除操作
     * 5，否则返回false

     * 如果点击了清除，且现在保存时还有选中，分三种情况
     * 1，之前没有-->现在有===>保存操作
     * 2，之前有点击了清除，又点击了选中--保存操作
     *    1，选中和初始一样，保存操作
     *    2，选中和初始不一样更换保存操作
     */
    async save() {
      let saveResult = await this.doStatusChangedActions();
      console.log("save()", saveResult);
      if (!saveResult) {
        this.$message.warning("系统异常请检查");
        return;
      }
      this.edit = false;
      this.statusIndex = null;
      this.signAlgorithmSelectedIndex = "";
      this.dialogDetailsDetVisible = false;
      this.usedAlgorithmIndex = "";
      this.showDetailsIndex = -1;
      this.isHasClearAction = false;
      this.$emit("refresh")
    },
    async doStatusChangedActions() {
      console.log("doStatusChangedActions")
      if (!this.isHasClearAction) {
        let result = await this.doSavePluginWithoutClearActionAction();
        if (result === true)
          return true;
      }
      if (this.invalidCleanUp()) {
        return true;
      }
      let effectiveCleanUpResult = await this.effectiveCleanUp();
      if (effectiveCleanUpResult === true) {
        this.$message.success("安全配置清除成功");
        return true;
      }
      return this.doSavePluginWithClearActionAction();

    },
    async doSavePluginWithoutClearActionAction() {
      console.log("doSavePluginWithoutClearActionAction")
      if (this.signAlgorithmSelectedIndex === "")
        return true;
      let result = await this.doChangedPluginThenSave();
      if (result === true)
        return true;
      let updateResult = await this.doSaveUpdatedPlugin();
      if (updateResult.code === 20000) {
        this.$message.success("保存插件成功")
        return true;
      }

    },
    async doChangedPluginThenSave() {
      console.log("doChangedPluginThenSave")
      if (this.signAlgorithmSelectedIndex === this.usedAlgorithmIndex || this.usedAlgorithmIndex === "")
        return false;

      let clearResult = await this.doClearBeforeSaveRequest();
      console.log("clearResult:",clearResult)

      if (clearResult.code === 20000) {
        this.$message.success("清除插件陈功")
        try {
          let afterSaveResult = await this.doSaveAfterClearRequest();
          if (afterSaveResult.code === 20000) {
            this.$message.success("保存插件成功")
            return true;
          }
        } catch (e) {
          console.error(e);
          throw new Error("清除请求失败")
        }

      }


      return false;
    },
    doClearBeforeSaveRequest() {
      console.log("doClearBeforeSaveRequest")
      let domainId = parseInt(this.$route.params.id);
      let cloudPluginId = this.signAlgorithmList[this.templateCodeMap[this.usedAlgorithmIndex]].id;
      let url = "/CloudPluginManagerService/clearCloudPluginByCondition";
      let params = [{
        domainId: domainId,
        id: cloudPluginId
      }];
      return gwApiRequest.post(url, params)
    },
    doSaveAfterClearRequest() {
      console.log("doSaveAfterClearRequest")
      return this.doSavePluginRequestAction();
    },
    doSavePluginRequestAction() {
      console.log("doSavePluginRequestAction")
      let domainId = parseInt(this.$route.params.id);
      let templateId = this.signAlgorithmList[this.templateCodeMap[this.signAlgorithmSelectedIndex]].templateId
      let id = this.signAlgorithmList[this.templateCodeMap[this.signAlgorithmSelectedIndex]].id;
      let templateType = this.signAlgorithmList[this.templateCodeMap[this.signAlgorithmSelectedIndex]].templateType;

      console.log("doSavePluginRequestAction+data", this.templateCodeMap)
      console.log("this.signAlgorithmSelectedIndex", this.signAlgorithmSelectedIndex)
      console.log("signAlgorithmList", this.signAlgorithmList)
      console.log("________________________________________")

      const data = {
        domainId: domainId,
        id: id,
        templateType: templateType,
        templateId: templateId === undefined ? null : templateId,
        templateConfig: JSON.stringify(this.signAlgorithmList[this.templateCodeMap[this.signAlgorithmSelectedIndex]].templateConfig)
      }
      console.log("doSavePluginRequestAction+data", data)
      let url = "/CloudPluginManagerService/saveCloudPluginByCondition";

      return gwApiRequest.post(url, [data])
    },
    doSaveUpdatedPlugin() {
      console.log("doSaveUpdatedPlugin")
      return this.doSavePluginRequestAction();
    },
    invalidCleanUp() {
      console.log("invalidCleanUp")
      if ((this.statusIndex === 2 || this.usedAlgorithmIndex === "" || this.statusIndex === null) && this.signAlgorithmSelectedIndex === "")
        return true;
      return false;
    },
    async effectiveCleanUp() {
      console.log("effectiveCleanUp")
      if (this.usedAlgorithmIndex != "" && (this.statusIndex === 0 || this.statusIndex === 1) && this.signAlgorithmSelectedIndex === "") {
        try {
          let result = await this.doClearRequestAction();
          console.log("effectiveCleanUp+result", result)
          return result.code === 20000;
        } catch (e) {
          console.error(e);
          throw new Error("清除请求失败")
        }
      }
      return false;
    },
    doClearRequestAction() {
      console.log("doClearRequestAction")
      let domainId = parseInt(this.$route.params.id);
      let cloudPluginId = this.signAlgorithmList[this.templateCodeMap[this.usedAlgorithmIndex]].id;
      let url = "/CloudPluginManagerService/clearCloudPluginByCondition";
      let params = [{
          domainId: domainId,
          id: cloudPluginId
        }]
      return gwApiRequest.post(url,params);

    },
    async doSavePluginWithClearActionAction() {
      console.log("doSavePluginWithClearActionAction")
      let changedPluginThenSaveResult = await this.doChangedPluginThenSave();
      if (changedPluginThenSaveResult === true)
        return true;
      let updateResult = await this.doSaveUpdatedPlugin();
      return updateResult.code === 20000;
    },

    init() {
      console.log("init.................")
      if (this.algorithmList === null || this.algorithmList == undefined)
        return;
      this.signAlgorithmList = JSON.parse(JSON.stringify(this.algorithmList));
      for (let i = 0; i < this.signAlgorithmList.length; i++) {
        this.signAlgorithmList[i].templateConfig = JSON.parse(this.signAlgorithmList[i].templateConfig);
        this.templateCodeMap[this.signAlgorithmList[i].templateCode] = i;
        if (this.signAlgorithmList[i].status != null) {
          this.statusIndex = (this.statusIndex === 0 || this.statusIndex === 1) ? this.statusIndex : this.signAlgorithmList[i].status;
          if (this.signAlgorithmList[i].status == 1 || this.signAlgorithmList[i].status === 0) {
            this.signAlgorithmSelectedIndex = this.signAlgorithmList[i].templateCode;
            this.usedAlgorithmIndex = this.signAlgorithmList[i].templateCode;
            this.showDetailsIndex = i;
            this.usedAlgorithmIndex = this.signAlgorithmList[i].templateCode;
          }
        }
      }
    },
  },
  computed: {
    // 计算是否显示插件详情
    isShowUsedSignAlgorithm() {
      if (this.statusIndex === 0 || this.statusIndex === 1)
        return true;
      return false;
    },

    //计算插状态颜色
    couputedStatusColor() {
      if (this.statusIndex == 0)
        return "updateColor";
      if (this.statusIndex == 1)
        return "c-999";
      return null;
    },
    // 计算插件状态描述
    computedShowStatusDescr() {
      return this.statusValue[this.statusIndex];
    },
    computedShowStatus() {
      if (this.statusIndex == 2)
        return true;
      return false;
    },
    rule() {
      let config = this.signAlgorithmList[this.showDetailsIndex].templateConfig;
      if (config.auth.sort_type === 1)
        return "按照字段ASCII码顺序排序";
      return "按照上述签名参数顺序排序"
    },
    Params() {
      let config = this.signAlgorithmList[this.showDetailsIndex].templateConfig;
      let params = ""
      let index = 0
      for (index; index < config.auth.rules.length; index++) {
        if (config.auth.rules[index].type === 9)
          params += config.auth.rules[index].name + "、"
      }
      return params.substr(0, params.length - 1)
    },
    computedHmacAuthShowStatus() {
      if (this.signAlgorithmList[this.templateCodeMap['hmac-auth']]["domainPluginId"] > 0 && this.signAlgorithmList[this.templateCodeMap['hmac-auth']]["domainPluginId"] !== null)
        return true;
    },
    computedPassportAuthStatus() {
      return "使用中"
    }


  },
  watch: {
    algorithmList: {
      handler(newData, oldDate) {
        this.algorithmList = newData
        this.init();
      },
      immediate: true,
      deep: true,
    }
  }
}
</script>

<style lang="scss" scoped>
.background {
  background-color: #fafafa;

  .top {
    margin-top: 20px;

    .broadcast {
      margin-top: 5px;
      margin-bottom: 5px;
      margin-left: 20px;

      .img {
        width: 20px;
        height: 20px;
      }
    }

    .com-view-dep {
      margin: 0px;
      padding: 12px 20px;
      background: #fafafa;
      border-radius: 4px;

      .tit-wrap1 {
        padding: 0 12px;
        position: relative;
        background: #fafafa;

        &::before {
          content: "";
          display: block;
          width: 3px;
          height: 50%;
          background: #3c6ef0;
          position: absolute;
          top: 6px;
          left: 0;
        }

        .tit1 {
          font-size: 16px;
          line-height: 24px;
          font-weight: 600;
          display: inline-block;
          max-width: 80%;
          word-break: break-all;
        }

        .tit2 {
          color: #333333;
          font-size: 14px;
          line-height: 24px;
          font-weight: 600;
          display: inline-block;
          max-width: 80%;
          word-break: break-all;
        }
      }

      .describe {
        color: #b5b5b5;
        margin-top: 10px;
      }
    }
  }

  .status {
    border: 1px solid;
    color: rgb(60, 110, 240);
    border-radius: 4px;
    font-size: 10px;
    padding: 1px;
    margin-left: 4px;
  }
}

.menuHeader {
  display: flex;
  align-items: center;

  .menuTitle {
    padding: 0 12px;
    font-size: 16px;
    font-weight: 600;
    position: relative;

    &::before {
      content: "";
      display: block;
      width: 3px;
      height: 50%;
      background: #3c6ef0;
      position: absolute;
      top: 5px;
      left: 0;
    }
  }
}
</style>
