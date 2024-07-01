<template>
  <div class="background" v-if="loginAuthArray!=null">
    <el-row class="top">
      <el-col :span="17">
        <div class="com-view-dep com-tit-view">
          <div class="tit-wrap1">
            <h3 class="tit1">登录态认证</h3>
            <el-button
                v-if="!edit&&isShowUsedLoginAuthType"
                type="text"
                style="padding: 0px"
                @click="computeShowWhichLoginAuthType"
                :disabled="editeDisabled"
            >
              <h3 class="tit2">{{ usedLoginAuthItemDesc[usedLoginAuthItemIndex] }}</h3>
            </el-button>
          </div>
          <div class="describe">
            通过对登录的账密进行认证，识别用户账号身份是否合法。
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
                @click="showItems"
            >设置
            </el-button>
          </div>
        </el-col>
      </div>
    </el-row>
    <!--具体的可选项-->
    <div v-if="edit">
      <el-row style="margin-left: 20px">
        <el-col :span="24">
          <el-radio-group v-model="loginAuthTypeSelectedIndex" style="margin-right: 0px">
            <!--            ERP-->
            <el-radio value="1" label="erp-auth">
              <el-button type="text"
                         style="padding: 0px;"
                         @click="showItemsDetails('erp-auth')"
              >
                <span style="color: #333333">ERP认证  ></span>
              </el-button>
              <span v-if="computeErpShowStatus" class="status">{{ computedErpStatus }}</span>
            </el-radio>
            <!--京ME-->
            <el-radio value="2" label="jing-me-auth">
              <el-button type="text"
                         style="padding: 0px"
                         @click="showItemsDetails('jing-me-auth')"
              >
                <span style="color: #333333">京ME认证></span>
              </el-button>
              <span v-if="computeJingmeAuthShowStatus" class="status">{{ computedJingmeAuthStatus }}</span>
            </el-radio>
            <!--passport-auth-->
            <el-radio value="3" label="passport-auth">
              <el-button
                  type="text"
                  style="padding: 0px"
                  @click="showItemsDetails('passport-auth')">
                <span style="color: #333333">Passport无线认证 ></span>
              </el-button>
              <span v-if="computedPassportAuthShowStatus" class="status">{{ computedPassportAuthStatus }}</span>
            </el-radio>
            <!--passport-pc-auth-->
            <el-radio value="4" label="passport-pc-auth">
              <el-button
                  type="text"
                  style="padding: 0px"
                  @click="showItemsDetails('passport-pc-auth')">
                <span style="color: #333333">PassportPC认证 ></span>
              </el-button>
              <span v-if="computedPassportPcAuthShowStatus" class="status">{{ computedPassportPcAuthStatus }}</span>
            </el-radio>

          </el-radio-group>
          <el-button v-if="loginAuthTypeSelectedIndex!=''"
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
        <el-button @click="closeAuthDialog">取消</el-button>
        <el-button type="primary" @click="save">保存
        </el-button>
      </div>
    </div>

    <!--    每个if对应一个编辑详情的对话框对话框的控制权在上述可选项中,后期可抽象成单组件,也可以直接复制,改动很少的部分适应新的插件  -->
    <div v-if="showClikedDetailsPluginName==='erp-auth'">
      <el-dialog title="ERP认证" :visible.sync="dialogDetailsDetVisible" width="600px">
        <div class="menuHeader">
          <h2 class="menuTitle">基本信息</h2>
        </div>
        <div style="margin: 20px">
          名称:{{ loginAuthTypeList[tempLateCodeMap['erp-auth']].templateName }}
        </div>
        <div style="margin: 20px">
          简介:{{ loginAuthTypeList[tempLateCodeMap['erp-auth']].templateDesc }}
        </div>
        <div class="menuHeader">
          <h2 class="menuTitle">认证配置</h2>
        </div>
        <el-form :model="erp_auth.configData"
                 :label-position="labelPosition"
                 label-width="120px"
        >
          <!--          非编辑态显示-->
          <el-form-item v-show="!erp_auth.configEditable" label="验证失败处理:" style="margin: 20px;" label-width="auto">
            <el-row v-if="erp_auth.returnType==='return_status'">返回http状态码:{{
                erp_auth.configData.return_status
              }}
            </el-row>
            <el-row v-if="erp_auth.returnType==='unLoginPaths'">跳转到:{{ erp_auth.configData.unLoginPaths }}</el-row>
          </el-form-item>
          <el-form-item v-show="!erp_auth.configEditable" label="cookie名:" style="margin:20px" label-width="auto">
            <el-row>{{ erp_auth.configData.cookie_name }}</el-row>
          </el-form-item>
          <el-form-item v-show="!erp_auth.configEditable" label="cookie写入域:" style="margin:20px" label-width="auto">
            <el-row>{{ erp_auth.configData.cookie_domain }}</el-row>
          </el-form-item>
          <el-form-item v-show="!erp_auth.configEditable" label="白名单:" style="margin:20px" label-width="auto">
            {{ erp_auth.white_list }}
          </el-form-item>

          <!--编辑态显示-->
          <el-form-item v-show="erp_auth.configEditable" label="验证失败处理" style="margin: 5px;">
            <el-select placeholder="return_status" v-model="erp_auth.returnType">
              <el-option label="返回HTTP状态码" value="return_status"></el-option>
              <el-option label="跳转到指定的URL" value="unLoginPaths"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="erp_auth.configEditable" style="margin: 5px;">
            <el-input v-model="erp_auth.returnData" :placeholder="erpAuthcomputeReturnData"
                      type="text"
                      id="erp_auth_returnData"
            >
            </el-input>
          </el-form-item>
          <el-form-item v-show="erp_auth.configEditable" label="cookie名" style="margin:5px">
            <el-input id="cookie_name" v-model="erp_auth.configData.cookie_name"
                      type="text"
                      :disabled="!erp_auth.configEditable"
            />
          </el-form-item>
          <el-form-item v-show="erp_auth.configEditable" label="cookie写入域" style="margin:5px">
            <el-input id="cookie_domain" v-model="erp_auth.configData.cookie_domain"
                      type="text"
                      :disabled="!erp_auth.configEditable"
            />
          </el-form-item>
          <el-form-item v-show="erp_auth.configEditable" label="白名单" style="margin: 5px;">
            <el-input id="white_list"
                      v-model="erp_auth.white_list"
                      type="textarea"
                      placeholder="输入相对路径，多个使用‘;’分割，如：/business/receiveNoLogin;/business/Login">

            </el-input>
          </el-form-item>
        </el-form>
        <div style="text-align: center">
          <el-button type="primary" @click="closeErpDialogDetails">关闭</el-button>
          <el-button v-show="!erp_auth.configEditable" type="primary" @click="editErpConfig">编辑</el-button>
          <el-button v-show="erp_auth.configEditable" type="primary" @click="saveErpEditedChanges">保存编辑</el-button>
        </div>
      </el-dialog>
    </div>

    <div v-if="showClikedDetailsPluginName==='jing-me-auth'">
      <el-dialog title="京ME认证" :visible.sync="dialogDetailsDetVisible" width="600px">
        <div class="menuHeader">
          <h2 class="menuTitle">基本信息</h2>
        </div>
        <div style="margin: 20px">
          名称:{{ loginAuthTypeList[tempLateCodeMap['jing-me-auth']].templateName }}
        </div>
        <div style="margin: 20px">
          简介:{{ loginAuthTypeList[tempLateCodeMap['jing-me-auth']].templateDesc }}
        </div>
        <div class="menuHeader">
          <h2 class="menuTitle">认证配置</h2>
        </div>
        <el-form :model="jing_me_auth.configData"
                 :label-position="labelPosition"
                 label-width="120px"
        >
          <!--          非编辑态显示-->
          <el-form-item v-show="!jing_me_auth.configEditable" label="京ME颁发的Key:" style="margin:20px" label-width="auto">
            <el-row>{{ jing_me_auth.configData.req[3].default }}</el-row>
          </el-form-item>

          <el-form-item v-show="!jing_me_auth.configEditable" label="验证失败处理:" style="margin: 20px;" label-width="auto">
            <el-row v-if="jing_me_auth.returnType==='return_status'">返回http状态码:{{
                jing_me_auth.configData.return_status
              }}
            </el-row>
            <el-row v-if="jing_me_auth.returnType==='unLoginPaths'">跳转到:{{
                jing_me_auth.configData.unLoginPaths
              }}
            </el-row>
          </el-form-item>
          <el-form-item v-show="!jing_me_auth.configEditable" label="白名单:" style="margin:20px" label-width="auto">
            {{ jing_me_auth.white_list }}
          </el-form-item>

          <!--编辑态显示-->
          <el-form-item v-show="jing_me_auth.configEditable" label="京ME颁发的Key" style="margin:5px">
            <el-input v-model="jing_me_auth.configData.req[3].default"
                      placeholder="输入京ME分配的Key，如：d42d91ba3b5bf8d5957"
                      type="text"
                      id="default"
            >
            </el-input>
          </el-form-item>
          <el-form-item v-show="jing_me_auth.configEditable" label="验证失败处理" style="margin: 5px;">
            <el-select v-model="jing_me_auth.returnType">
              <el-option label="返回HTTP状态码" value="return_status"></el-option>
              <el-option label="跳转到指定的URL" value="unLoginPaths"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="jing_me_auth.configEditable" style="margin: 5px;">
            <el-input v-model="jing_me_auth.returnData"
                      type="text"
                      id="jingMeReturnData"
                      :placeholder="jingmeAuthComputeReturnData"
            >
            </el-input>
          </el-form-item>

          <el-form-item v-show="jing_me_auth.configEditable" label="白名单" style="margin: 5px;">
            <el-input id="jingme-auth_white_list"
                      v-model="jing_me_auth.white_list"
                      type="textarea"
                      placeholder="输入相对路径，多个使用‘;’分割，如：/business/receiveNoLogin;/business/Login">

            </el-input>
          </el-form-item>
        </el-form>
        <div style="text-align: center">
          <el-button type="primary" @click="closeJingMeAuthDialogDetails">关闭</el-button>
          <el-button v-show="!jing_me_auth.configEditable" type="primary" @click="editJingMeAuthConfig">编辑
          </el-button>
          <el-button v-show="jing_me_auth.configEditable" type="primary" @click="saveJingMeAuthEditedChanges">
            保存编辑
          </el-button>
        </div>
      </el-dialog>
    </div>

    <div v-if="showClikedDetailsPluginName==='passport-auth'">
      <el-dialog title="Passport无线认证" :visible.sync="dialogDetailsDetVisible" width="600px">
        <div class="menuHeader">
          <h2 class="menuTitle">基本信息</h2>
        </div>
        <div style="margin: 20px">
          名称:{{ loginAuthTypeList[tempLateCodeMap['passport-auth']].templateName }}
        </div>
        <div style="margin: 20px">
          简介:{{ loginAuthTypeList[tempLateCodeMap['passport-auth']].templateDesc }}
        </div>
        <div class="menuHeader">
          <h2 class="menuTitle">认证配置</h2>
        </div>
        <el-form :model="passport_auth.configData"
                 :label-position="labelPosition"
                 label-width="120px"
        >
          <!--          非编辑态显示-->
          <el-form-item v-show="!passport_auth.configEditable" label="验证失败处理:" style="margin: 20px;" label-width="auto">
            <el-row v-if="passport_auth.returnType==='return_status'">
              返回http状态码:{{ passport_auth.configData.return_status }}
            </el-row>
            <el-row v-if="passport_auth.returnType==='unLoginPaths'">跳转到:{{
                passport_auth.configData.unLoginPaths
              }}
            </el-row>
          </el-form-item>
          <el-form-item v-show="!passport_auth.configEditable" label="白名单:" style="margin:20px" label-width="auto">
            {{ passport_auth.white_list }}
          </el-form-item>

          <!--编辑态显示-->
          <el-form-item v-show="passport_auth.configEditable" label="验证失败处理" style="margin: 5px;">
            <el-select v-model="passport_auth.returnType">
              <el-option label="返回HTTP状态码" value="return_status"></el-option>
              <el-option label="跳转到指定的URL" value="unLoginPaths"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="passport_auth.configEditable" style="margin: 5px;">
            <el-input v-model="passport_auth.returnData"
                      type="text"
                      id="jingMeReturnData"
                      :placeholder="passportAuthComputeReturnData"
            >
            </el-input>
          </el-form-item>

          <el-form-item v-show="passport_auth.configEditable" label="白名单" style="margin: 5px;">
            <el-input id="white_list"
                      v-model="passport_auth.white_list"
                      type="textarea"
                      placeholder="输入相对路径，多个使用‘;’分割，如：/business/receiveNoLogin;/business/Login">

            </el-input>
          </el-form-item>
        </el-form>
        <div style="text-align: center">
          <el-button type="primary" @click="closePassportAuthDialogDetails">关闭</el-button>
          <el-button v-show="!passport_auth.configEditable" type="primary" @click="editclosePassportAuthConfig">
            编辑
          </el-button>
          <el-button v-show="passport_auth.configEditable" type="primary"
                     @click="savePassportAuthEditedChanges">保存编辑
          </el-button>
        </div>
      </el-dialog>
    </div>

    <div v-if="showClikedDetailsPluginName==='passport-pc-auth'">
      <el-dialog title="PassportPC认证" :visible.sync="dialogDetailsDetVisible" width="600px">
        <div class="menuHeader">
          <h2 class="menuTitle">基本信息</h2>
        </div>
        <div style="margin: 20px">
          名称:{{ loginAuthTypeList[tempLateCodeMap['passport-pc-auth']].templateName }}
        </div>
        <div style="margin: 20px">
          简介:{{ loginAuthTypeList[tempLateCodeMap['passport-pc-auth']].templateDesc }}
        </div>
        <div class="menuHeader">
          <h2 class="menuTitle">认证配置</h2>
        </div>
        <el-form :model="passport_pc_auth.configData"
                 :label-position="labelPosition"
                 label-width="120px"
        >
          <!--          非编辑态显示-->
          <el-form-item v-show="!passport_pc_auth.configEditable" label="验证失败处理:" style="margin: 20px;"
                        label-width="auto">
            <el-row v-if="passport_pc_auth.returnType==='return_status'">
              返回http状态码:{{ passport_pc_auth.configData.return_status }}
            </el-row>
            <el-row v-if="passport_pc_auth.returnType==='unLoginPaths'">跳转到:{{
                passport_pc_auth.configData.unLoginPaths
              }}
            </el-row>
          </el-form-item>
          <el-form-item v-show="!passport_pc_auth.configEditable" label="cookie名:" style="margin:20px"
                        label-width="auto">
            <el-row>{{ passport_pc_auth.configData.cookie_name }}</el-row>
          </el-form-item>
          <el-form-item v-show="!passport_pc_auth.configEditable" label="白名单:" style="margin:20px" label-width="auto">
            {{ passport_pc_auth.white_list }}
          </el-form-item>

          <!--编辑态显示-->
          <el-form-item v-show="passport_pc_auth.configEditable" label="验证失败处理" style="margin: 5px;">
            <el-select v-model="passport_pc_auth.returnType">
              <el-option label="返回HTTP状态码" value="return_status"></el-option>
              <el-option label="跳转到指定的URL" value="unLoginPaths"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="passport_pc_auth.configEditable" style="margin: 5px;">
            <el-input v-model="passport_pc_auth.returnData"
                      type="text"
                      id="jingMeReturnData"
                      :placeholder="passportPcAuthComputeReturnData"
            >
            </el-input>
          </el-form-item>


          <el-form-item v-show="passport_pc_auth.configEditable" label="cookie名" style="margin:5px">
            <el-input id="cookie_name" v-model="passport_pc_auth.configData.cookie_name"
                      type="text"
                      :disabled="!passport_pc_auth.configEditable"
            />
          </el-form-item>

          <el-form-item v-show="passport_pc_auth.configEditable" label="白名单" style="margin: 5px;">
            <el-input id="white_list"
                      v-model="passport_pc_auth.white_list"
                      type="textarea"
                      placeholder="输入相对路径，多个使用‘;’分割，如：/business/receiveNoLogin;/business/Login">

            </el-input>
          </el-form-item>
        </el-form>
        <div style="text-align: center">
          <el-button type="primary" @click="closePassportPcAuthDialogDetails">关闭</el-button>
          <el-button v-show="!passport_pc_auth.configEditable" type="primary" @click="editclosePassportPcAuthConfig">
            编辑
          </el-button>
          <el-button v-show="passport_pc_auth.configEditable" type="primary" @click="savePassportPcAuthEditedChanges">
            保存编辑
          </el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import gwApiRequest from "@/utils/gwApiRequest";

export default {
  props: ["editeDisabled", "loginAuthArray"],
  data() {
    let checkCookieName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('cookie名不能为空'))
      }
    }
    let checkCookieDomain = (rule, value, callback) => {

      console.log(value)
      regexp.test(value)
      if (regexp.test(value))
        return callback(null);
      return callback(new Error("cookie域格式错误"))
    }
    return {
      /**
       * 公用数据部分：
       * edit：可否编辑
       * statusIndex：当前类型插件状态
       * statusValue：状态类型枚举
       * loginAuthTypeSelectedIndex：当前选中插件项
       * dialogDetailsDetVisible：弹出框是否开启
       * usedLoginAuthItemIndex：之前在使用或者在配的
       * usedLoginAuthItemDesc：插件类型和描述枚举
       * tempLateCodeMap：插件类型和原始数据下表枚举
       * showDetailsIndex：展示弹出框是对应插件原始数据下标
       * showClikedDetailsPluginName：当前点击了的插件名称
       * isHasClearAction：是否有清除动作
       * loginAuthTypeList：原始数据
       *
       *
       *
       * */
      edit: false,
      statusIndex: null,
      statusValue: {
        null: "",
        "0": "已设置，待发布",
        "1": "使用中",
        "2": "已清空，待发布",
        "3": "取消设置，已发布"
      },
      loginAuthTypeSelectedIndex: "",
      dialogDetailsDetVisible: false,
      usedLoginAuthItemIndex: "",
      usedLoginAuthItemDesc: {
        "": "",
        "erp-auth": "ERP认证 >",
        "passport-pc-auth": "PassportPC认证 >",
        "passport-auth": "Passport无线认证 >",
        "jing-me-auth": "京ME认证 >"
      },
      tempLateCodeMap: {
        "": "",
      },
      showDetailsIndex: -1,
      showClikedDetailsPluginName: "",
      isHasClearAction: false,
      loginAuthTypeList: null,
      labelPosition: 'left',
      //erp相关字段
      erp_auth: {
        configData: null,
        returnType: "return_status",
        configEditable: false,
        returnData: "",
        white_list: ""
      },
      //京me相关
      jing_me_auth: {
        configEditable: false,
        configData: null,
        returnData: "",
        returnType: "return_sattus",
        white_list: "",
      },
      //passport-auth
      passport_auth: {
        configEditable: false,
        configData: null,
        returnData: "",
        returnType: "return_sattus",
        white_list: "",
      },
      //passport-auth
      passport_pc_auth: {
        configEditable: false,
        configData: null,
        returnData: "",
        returnType: "return_sattus",
        white_list: "",
      },
    }
  },
  methods: {
    //打开可选项界面
    showItems() {
      this.edit = true;
    },
    //是否显示正在应用的插件
    isShowUsedLoginAuthType() {
      return (this.statusIndex === 0 || this.statusIndex == 1)
    },
    //计算使用的等陆态插件是哪个
    computeShowWhichLoginAuthType() {
      console.log("computeShowWhichLoginAuthType start");
      console.log(this.usedLoginAuthItemIndex)
      console.log("showDetailsIndex2" + this.showDetailsIndex)
      this.showDetailsIndex = this.tempLateCodeMap[this.usedLoginAuthItemIndex];
      console.log("showDetailsIndex2" + this.showDetailsIndex)
      if (!(this.showDetailsIndex > -1))
        return;
      this.showClikedDetailsPluginName = this.loginAuthTypeSelectedIndex;
      console.log(this.showClikedDetailsPluginName)
      this.edit = true;
      this.dialogDetailsDetVisible = true;
      console.log("computeShowWhichLoginAuthType end");
    },
    //展示具体的插件的弹出框
    showItemsDetails(pluginName) {
      console.log("pluginName", pluginName)
      this.showClikedDetailsPluginName = pluginName;
      console.log("showClikedDetailsPluginName", this.showClikedDetailsPluginName);
      this.showDetailsIndex = this.tempLateCodeMap[this.showClikedDetailsPluginName];
      console.log("showDetailsIndex", this.showDetailsIndex);
      console.log(this.showClikedDetailsPluginName + ":" + this.showDetailsIndex)
      if (!(this.showDetailsIndex > -1))
        return;
      this.edit = true;
      this.dialogDetailsDetVisible = true;
    },
    //清空选中
    clearPlugins() {
      this.isHasClearAction = true;
      this.loginAuthTypeSelectedIndex = "";
    },
    //关闭可选项展示
    closeAuthDialog() {
      this.edit = false;
      this.init();
    },
    //点击保存
    async save() {
      let saveResult = await this.doStatusChangedActions();
      console.log("save()", saveResult);
      // 重新加载组件
      if (saveResult === true) {
        this.edit = false;
        this.statusIndex = null;
        this.loginAuthTypeSelectedIndex = "";
        this.dialogDetailsDetVisible = false;
        this.usedLoginAuthItemIndex = "";
        this.showDetailsIndex = -1;
        this.showClikedDetailsPluginName = "";
        this.isHasClearAction = false;
        this.$emit("refresh")
      }
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
     * 1，选中和初始一样，保存操作
     * 2，选中和初始不一样更换保存操作
     */
    async doStatusChangedActions() {
      console.log("doStatusChangedActions")

      /**
       * 没有点击操作点击保存处理流程
       * isHasClearAction 是否有点击操作
       * result: true 标识正常处理结束
       *         fales:当前流程不匹配
       *         undefine:处理失败了
       *
       * */

      if (!this.isHasClearAction) {
        let result = await this.doSavePluginWithoutClearActionAction();
        if (result === true)
          return true;
        if (result === undefined)
          return false;
      }
      /**
       * 有清除动作看是否是无效清除流程---》无效的操作点击了保存
       * invalidCleanUp：
       *          true：无效清除流程走完
       *          false:继续向下走流程
       * */

      if (this.invalidCleanUp())
        return true;
      /**
       * 看是匹配清除流程
       * effectiveCleanUpResult：
       *                      true:是有效清除并执行完了该流程
       *                      false:不是该流程，继续向下分析
       *                      undefined:是该流程但是处理失败了
       *
       * */
      let effectiveCleanUpResult = await this.effectiveCleanUp();
      if (effectiveCleanUpResult === true) {
        this.$message.success("安全配置清除成功");
        return true;
      }
      if (effectiveCleanUpResult === undefined)
        return false;
      /**
       * 点击过清除看是否匹配保存更换或者更新操作
       * this.doSavePluginWithClearActionAction：
       *                                      true:是该流程处理完毕
       *                                      false：不是该流程没做处理
       *                                      undefined：是该流程处理失败
       *
       *
       * */
      return this.doSavePluginWithClearActionAction();
    },
    /**
     * 没有点击操作点击保存处理流程
     * isHasClearAction 是否有点击操作
     * result: true 标识正常处理结束
     *         fales:当前流程不匹配
     *         undefine:处理失败了
     *
     * */

    async doSavePluginWithoutClearActionAction() {
      console.log("doSavePluginWithoutClearActionAction")

      // loginAuthTypeSelectedIndex：单腔选中项
      // 无不用处理，应该是已经之前处理过的

      if (this.loginAuthTypeSelectedIndex === "")
        return true;
      /**
       * 匹配是否是更换插件的动作
       * result：
       *    true:p匹配且处理成功
       *    false:不匹配
       *    undefined：流程匹配但处理失败
       * */
      let result = await this.doChangedPluginThenSave();
      if (result === true)
        return true;
      if (result === undefined)
        return;
      /**
       * 更新插件的动作
       * result：
       *    true:p匹配且处理成功
       *    undefined：流程匹配但处理失败
       * */
      let updateResult = await this.doSaveUpdatedPlugin();
      if (updateResult === true)
        return true;

      return false;
    },
    /**
     * 无效清除动作流程判断处理
     * */
    invalidCleanUp() {
      console.log("invalidCleanUp")
      if ((this.statusIndex === 2 || this.usedLoginAuthItemIndex === "" || this.statusIndex === null) && this.loginAuthTypeSelectedIndex === "") {
        return true;
      }
      return false;
    },
    /**
     * 有效效清除动作流程判断处理
     * usedLoginAuthItemIndex：之前再用
     * statusIndex：单腔该类型插件的状态
     * loginAuthTypeSelectedIndex：当前选中
     * */
    async effectiveCleanUp() {
      console.log("effectiveCleanUp")
      if (this.usedLoginAuthItemIndex !== "" && (this.statusIndex === 0 || this.statusIndex === 1) && this.loginAuthTypeSelectedIndex === "") {
        try {
          let result = await this.doClearRequestAction();
          return result.code === 20000;
        } catch (e) {
          console.error(e)
          return;
        }
      }
      return false;
    },
    /**
     * 点击过清除现在有选中处理
     * */
    async doSavePluginWithClearActionAction() {
      console.log("doSavePluginWithClearActionAction")
      /**
       * 匹配是否是更换插件的动作
       * result：
       *    true:p匹配且处理成功
       *    false:不匹配
       *    undefined：流程匹配但处理失败
       * */
      let result = await this.doChangedPluginThenSave();
      if (result === true)
        return true;
      if (result === undefined)
        return;
      /**
       * 更新插件的动作
       * result：
       *    true:p匹配且处理成功
       *    undefined：流程匹配但处理失败
       * */
      let updateResult = await this.doSaveUpdatedPlugin();
      if (updateResult === true)
        return true;

    },
    /***
     * 更换插件处理流程
     * */
    async doChangedPluginThenSave() {
      console.log("doChangedPluginThenSave")
      /**
       * 流程不匹配
       */
      if (this.loginAuthTypeSelectedIndex === this.usedLoginAuthItemIndex || this.usedLoginAuthItemIndex === "")
        return false;
      /**
       * 先清除 ：doClearBeforeSaveRequest
       * 保存之前先清除：
       * doSaveAfterClearRequest ：清除之后在保存
       *
       *
       * @type {AxiosResponse<any>}
       */

      let clearResult = await this.doClearBeforeSaveRequest();
      if (clearResult.code === 20000) {
        this.$message.success("清除插件成功");
        let doSaveRequestResult = await this.doSaveAfterClearRequest();
        if (doSaveRequestResult.code === 20000) {
          this.$message.success("保存插件成功");
          return true;
        } else {
          this.$message.success("保存插件失败");
          return;
        }
      } else {
        this.$message.success("清除插件失败");
        return;
      }
      return false;
    },
    /**
     * 更新插件请求处理
     * */
    async doSaveUpdatedPlugin() {
      console.log("doSaveUpdatedPlugin")
      try {
        let updateResult = await this.doSavePluginRequestAction();
        if (updateResult.code === 20000) {
          this.$message.success("更新插件成功")
          return true;
        }
        if (updateResult.code !== 20000) {
          this.$message.error("更新插件失败请联系系统管理员!");
          // console.error(updateResult);
          throw new Error("更新插件失败请联系系统管理员" + JSON.stringify(updateResult));
        }
      } catch (e) {
        console.error(e)

      }
    },
    /**
     * 清除之后在保存
     * */
    doSaveAfterClearRequest() {
      console.log("doSaveAfterClearRequest")
      return this.doSavePluginRequestAction();
    },
    /**
     * 保存之前先清除：
     * :之前配的插件
     * */
    doClearBeforeSaveRequest() {
      console.log("doClearBeforeSaveRequest")
      return this.doClearRequestAction();
    },
    /**
     * 清理请求
     * usedLoginAuthItemIndex：之前配的插件
     * */
    doClearRequestAction() {
      console.log("doClearRequestAction")
      let domainId = parseInt(this.$route.params.id);
      let cloudPluginId = this.loginAuthTypeList[this.tempLateCodeMap[this.usedLoginAuthItemIndex]].id;
      let url = "/CloudPluginManagerService/clearCloudPluginByCondition";
      let params = [{
        domainId: domainId,
        id: cloudPluginId
      }];
      return gwApiRequest.post(url, params);

    },
    /**
     * 保存或者更新操作
     * templateId==null?保存：更新
     * @returns {AxiosPromise}
     */
    doSavePluginRequestAction() {
      console.log("doSavePluginRequestAction")
      let domainId = parseInt(this.$route.params.id);
      let templateId = this.loginAuthTypeList[this.tempLateCodeMap[this.loginAuthTypeSelectedIndex]].templateId
      const data = [{
        domainId: domainId,
        id: this.loginAuthTypeList[this.tempLateCodeMap[this.loginAuthTypeSelectedIndex]].id,
        templateType: this.loginAuthTypeList[this.tempLateCodeMap[this.loginAuthTypeSelectedIndex]].templateType,
        templateId: templateId === undefined ? null : templateId,
        templateConfig: JSON.stringify(this.loginAuthTypeList[this.tempLateCodeMap[this.loginAuthTypeSelectedIndex]].templateConfig),
      }];
      let url = "/CloudPluginManagerService/saveCloudPluginByCondition";
      return gwApiRequest.post(url,data);



    },
    //初始化data
    init() {
      console.log("init")
      if (this.loginAuthArray === null || this.loginAuthArray === undefined)
        return;
      this.loginAuthTypeList = JSON.parse(JSON.stringify(this.loginAuthArray));
      //遍历模板数据初始化config字段
      for (let index = 0; index < this.loginAuthTypeList.length; index++) {
        this.loginAuthTypeList[index].templateConfig = JSON.parse(this.loginAuthTypeList[index].templateConfig);
        this.tempLateCodeMap[this.loginAuthTypeList[index].templateCode] = index;
        if (this.loginAuthTypeList[index].status != null) {
          this.statusIndex = (this.statusIndex === 0 || this.statusIndex === 1) ? this.statusIndex : this.loginAuthTypeList[index].status;
          if (this.loginAuthTypeList[index].status === 1 || this.loginAuthTypeList[index].status === 0) {
            this.usedLoginAuthItemIndex = this.loginAuthTypeList[index].templateCode;
            this.loginAuthTypeSelectedIndex = this.loginAuthTypeList[index].templateCode;
            console.log(this.loginAuthTypeSelectedIndex)
            this.showDetailsIndex = index;
          }
        }
      }
      // 初始话erp对话框数据
      this.erpAuthInit();
      // 初始化京ME对话框数据
      this.jingmeAuthInit();
      //初始化无线passport对话框数据
      this.passportAuthInit();
      //初始化无线passport-pc-auth对话框数据
      this.passportPcAuthInit();
    },
    // 初始化京ME对话框数据
    jingmeAuthInit() {
      this.jing_me_auth.configData = JSON.parse(JSON.stringify(this.loginAuthTypeList[this.tempLateCodeMap['jing-me-auth']].templateConfig));
      if (this.jing_me_auth.configData.return_status !== undefined && this.jing_me_auth.configData.return_status !== null) {
        this.jing_me_auth.returnData = this.jing_me_auth.configData.return_status;
        this.jing_me_auth.returnType = "return_status";
      }
      if (this.jing_me_auth.configData.unLoginPaths !== undefined && this.jing_me_auth.configData.unLoginPaths !== null) {
        this.jing_me_auth.returnData = this.jing_me_auth.configData.unLoginPaths;
        this.jing_me_auth.returnType = "unLoginPaths";
      }
      this.loginAuthTypeList[this.tempLateCodeMap["jing-me-auth"]].templateConfig.alias = window.env.jingMeAuthAlias;
      this.jingme_auth_white_list();
    },
    // 初始话erp对话框数据
    erpAuthInit() {
      this.erp_auth.configData = JSON.parse(JSON.stringify(this.loginAuthTypeList[this.tempLateCodeMap['erp-auth']].templateConfig));
      if (this.erp_auth.configData.return_status !== undefined && this.erp_auth.configData.return_status !== null) {
        this.erp_auth.returnData = this.erp_auth.configData.return_status;
        this.erp_auth.returnType = "return_status";
      }
      if (this.erp_auth.configData.unLoginPaths !== undefined && this.erp_auth.configData.unLoginPaths !== null) {
        this.erp_auth.returnData = this.erp_auth.configData.unLoginPaths;
        this.erp_auth.returnType = "unLoginPaths";
      }
      this.erp_white_list();
    },
    //初始化无线passport对话框数据
    passportAuthInit() {
      this.passport_auth.configData = JSON.parse(JSON.stringify(this.loginAuthTypeList[this.tempLateCodeMap['passport-auth']].templateConfig));
      if (this.passport_auth.configData.return_status !== undefined && this.passport_auth.configData.return_status !== null) {
        this.passport_auth.returnData = this.passport_auth.configData.return_status;
        this.passport_auth.returnType = "return_status";
      }
      if (this.passport_auth.configData.unLoginPaths !== undefined && this.passport_auth.configData.unLoginPaths !== null) {
        this.passport_auth.returnData = this.passport_auth.configData.unLoginPaths;
        this.passport_auth.returnType = "unLoginPaths";
      }
      this.passport_auth_white_list();
    },
    passportPcAuthInit() {
      this.passport_pc_auth.configData = JSON.parse(JSON.stringify(this.loginAuthTypeList[this.tempLateCodeMap['passport-pc-auth']].templateConfig));
      if (this.passport_pc_auth.configData.return_status !== undefined && this.passport_pc_auth.configData.return_status !== null) {
        this.passport_pc_auth.returnData = this.passport_pc_auth.configData.return_status;
        this.passport_pc_auth.returnType = "return_status";
      }
      if (this.passport_pc_auth.configData.unLoginPaths !== undefined && this.passport_pc_auth.configData.unLoginPaths !== null) {
        this.passport_pc_auth.returnData = this.passport_pc_auth.configData.unLoginPaths;
        this.passport_pc_auth.returnType = "unLoginPaths";
      }
      this.passport_pc_auth_white_list();
    },
    //erp相关
    //ERP关闭弹出框
    closeErpDialogDetails() {
      this.dialogDetailsDetVisible = false;
      this.erp_auth.configEditable = false;
      this.erp_auth.configData = JSON.parse(JSON.stringify(this.loginAuthTypeList[this.tempLateCodeMap[this.showClikedDetailsPluginName]].templateConfig));
      this.edit = true;
      this.labelPosition = 'left'
    },
    //ERP信息编辑
    editErpConfig() {

      this.labelPosition = "right"
      this.erp_auth.configEditable = true;
      console.log("editErpConfig+configEditable", this.erp_auth.configEditable)
      if (this.erp_auth.returnType === "unLoginPaths") {
        console.log("editErpConfig+returnType", this.erp_auth.returnType)
        let index = this.erp_auth.returnData.indexOf("=");
        this.erp_auth.returnData = this.erp_auth.returnData.substr(index + 1);
      }
      console.log(this.erp_auth.returnData);
    },
    //ERP信息编辑暂存保存
    saveErpEditedChanges() {
      let domainReg = new RegExp(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/)
      if (this.erp_auth.configData.cookie_domain != "") {
        if (!domainReg.test(this.erp_auth.configData.cookie_domain)) {
          this.$message.warning("服务域格式错误:" + this.erp_auth.configData.cookie_domain);
          throw new Error("服务域格式错误:" + this.erp_auth.configData.cookie_domain);
        }
      }
      /**
       * 校验白名单
       *
       */

      let whiteUrlList = {}
      let whiteUrlReg = /^\/(\w+\/?)+$/;
      let urlSet = new Set();
      this.erp_auth.white_list = this.erp_auth.white_list.trim();
      this.erp_auth.white_list = this.erp_auth.white_list.endsWith(";") ? this.erp_auth.white_list.substr(0, this.erp_auth.white_list - 1) : this.erp_auth.white_list;
      if (this.erp_auth.white_list !== "") {
        let urlList = this.erp_auth.white_list.split(";");
        // console.log("urlList+****************", urlList)
        for (let i = 0; i < urlList.length; i++) {
          if (whiteUrlReg.test(urlList[i])) {
            if (!urlSet.add(urlList[i])) {
              this.$message.warning("白名单重复：" + urlList[i]);
              throw new Error("白名单重复：" + urlList[i]);
            }
          } else {
            this.$message.warning("白名单格式错误：" + urlList[i]);
            throw new Error("白名单格式错误：" + urlList[i]);
          }
        }
        urlSet.forEach((url) => whiteUrlList[url] = {});
      }
      this.erp_auth.configData.white_list.urls = whiteUrlList;


      /**
       * 校验验证失败跳转路径
       */
      if (this.erp_auth.returnType === "unLoginPaths") {
        console.log("window.env.baseEnv", window.env.baseEnv);
        let urlReg = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/;
        if (urlReg.test(this.erp_auth.returnData) === false) {
          this.$message.warning("校验验证失败跳转路径格式错误：" + this.erp_auth.returnData);
          return;
        }
        this.erp_auth.returnData = window.env.erpAuthReturn + this.erp_auth.returnData;
        console.log("this.erp_auth.returnData", this.erp_auth.returnData)
        this.erp_auth.configData.unLoginPaths = this.erp_auth.returnData;
        if (this.erp_auth.configData["return_status"] !== undefined)
          delete this.erp_auth.configData["return_status"];
      }
      /**
       * 验证返回 HTTP 状态码
       */
      if (this.erp_auth.returnType === "return_status") {
        let numReg = /^[0-9]*$/
        if (!numReg.test(this.erp_auth.returnData)) {
          this.$message.warning("验证返回 HTTP 状态码格式错误" + this.erp_auth.returnData);
          return;
        }
        this.erp_auth.configData.return_status = this.erp_auth.returnData;
        if (this.erp_auth.configData["unLoginPaths"] != undefined)
          delete this.erp_auth.configData["unLoginPaths"];
      }

      this.loginAuthTypeList[this.tempLateCodeMap[this.showClikedDetailsPluginName]].templateConfig = JSON.parse(JSON.stringify(this.erp_auth.configData));
      this.dialogDetailsDetVisible = false;
      this.erp_auth.configEditable = false;
      console.log("this.loginAuthTypeList[this.tempLateCodeMap[this.showClikedDetailsPluginName]].templateConfig,", this.loginAuthTypeList[this.tempLateCodeMap[this.showClikedDetailsPluginName]].templateConfig)
      this.labelPosition = "left"
    },
    // 初始化erp白名单
    erp_white_list() {
      console.log("white_list+start:")
      let urlList = '';
      let urlKeys = Object.keys(this.erp_auth.configData.white_list.urls);
      if (urlKeys === null || urlKeys.length == 0)
        return urlList = '';
      for (let i = 0; i < urlKeys.length - 1; i++)
        urlList += urlKeys[i] + ';';
      urlList += urlKeys[urlKeys.length - 1];
      this.erp_auth.white_list = urlList;

    },

    //jing-me-auth私有方法
    // 关闭京ME弹出框
    closeJingMeAuthDialogDetails() {
      this.dialogDetailsDetVisible = false;
      this.jing_me_auth.configEditable = false;
      this.jing_me_auth.configData = JSON.parse(JSON.stringify(this.loginAuthTypeList[this.tempLateCodeMap[this.showClikedDetailsPluginName]].templateConfig));
      this.edit = true;
      this.labelPosition = 'left'
    },
    //编辑京ME弹出框
    editJingMeAuthConfig() {
      this.labelPosition = "right"
      this.jing_me_auth.configEditable = true;
      console.log("editErpConfig+configEditable", this.jing_me_auth.configEditable)
      if (this.jing_me_auth.returnType === "unLoginPaths") {
        console.log("editErpConfig+returnType", this.jing_me_auth.returnType)
        let index = this.jing_me_auth.returnData.indexOf("=");
        this.jing_me_auth.returnData = this.jing_me_auth.returnData.substr(index + 1);
      }
      console.log(this.jing_me_auth.returnData);
    },
    //暂存编辑信息
    saveJingMeAuthEditedChanges() {
      /**
       * 校验验证失败跳转路径
       */
      console.log(" 校验验证失败跳转路径")
      if (this.jing_me_auth.returnType === "unLoginPaths") {
        console.log("window.env.baseEnv", window.env.baseEnv);
        let urlReg = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/;
        if (urlReg.test(this.jing_me_auth.returnData) === false) {
          this.$message.warning("校验验证失败跳转路径格式失败", this.jing_me_auth.returnData);
          return;
        }
        this.jing_me_auth.returnData = window.env.erpAuthReturn + this.jing_me_auth.returnData;
        console.log("this.erp_auth.returnData", this.jing_me_auth.returnData)
        this.jing_me_auth.configData.unLoginPaths = this.jing_me_auth.returnData;
        if (this.jing_me_auth.configData.return_status != undefined)
          delete this.jing_me_auth.configData["return_status"];
      }
      /**
       * 验证返回 HTTP 状态码
       */

      console.log("验证返回 HTTP 状态码")
      if (this.jing_me_auth.returnType === "return_status") {
        let numReg = /^[0-9]*$/
        if (!numReg.test(this.jing_me_auth.returnData)) {
          this.$message.warning("HTTP 状态码格式错误", this.jing_me_auth.returnData);
          return;
        }
        this.jing_me_auth.configData.return_status = this.jing_me_auth.returnData;
        if (this.jing_me_auth.configData["unLoginPaths"] != undefined)
          delete this.jing_me_auth.configData["unLoginPaths"];
      }
      /**
       * 校验白名单
       *
       */

      console.log("校验白名单")
      let whiteUrlList = {}
      let whiteUrlReg = /^\/(\w+\/?)+$/;
      let urlSet = new Set();
      this.jing_me_auth.white_list = this.jing_me_auth.white_list.trim();
      this.jing_me_auth.white_list = this.jing_me_auth.white_list.endsWith(";") ? this.jing_me_auth.white_list.substr(0, this.jing_me_auth.white_list.length - 1) : this.jing_me_auth.white_list;
      if (this.jing_me_auth.white_list !== "") {
        let urlList = this.jing_me_auth.white_list.split(";");
        console.log("urlList+****************", urlList)
        for (let i = 0; i < urlList.length; i++) {
          if (whiteUrlReg.test(urlList[i])) {
            if (!urlSet.add(urlList[i])) {
              this.$message.warning("白名单重复" + urlList[i]);
              throw new Error("白名单重复" + urlList[i]);
            }
          } else {
            this.$message.warning("格式错误：" + urlList[i]);
            throw new Error("格式错误：" + urlList[i]);
          }
        }
        urlSet.forEach((url) => whiteUrlList[url] = {});
      }
      console.log("close start")
      this.jing_me_auth.configData.white_list.urls = whiteUrlList;


      // console.log("this.loginAuthTypeList[this.tempLateCodeMap[this.showClikedDetailsPluginName]].templateConfig,",this.loginAuthTypeList[this.tempLateCodeMap[this.showClikedDetailsPluginName]].templateConfig)
      this.loginAuthTypeList[this.tempLateCodeMap[this.showClikedDetailsPluginName]].templateConfig = JSON.parse(JSON.stringify(this.jing_me_auth.configData));
      this.dialogDetailsDetVisible = false;
      this.jing_me_auth.configEditable = false;
      this.labelPosition = "left"
    },
    //初始化京ME白名单
    jingme_auth_white_list() {
      let urlList = '';
      let urlKeys = Object.keys(this.jing_me_auth.configData.white_list.urls);
      if (urlKeys === null || urlKeys.length == 0)
        return urlList = '';
      for (let i = 0; i < urlKeys.length - 1; i++)
        urlList += urlKeys[i] + ';';
      urlList += urlKeys[urlKeys.length - 1];
      this.jing_me_auth.white_list = urlList;
    },
    //passport-auth私有方法
    // 关闭passport弹出框
    closePassportAuthDialogDetails() {
      this.labelPosition = 'left'
      this.dialogDetailsDetVisible = false;
      this.passport_auth.configEditable = false;
      this.passport_auth.configData = JSON.parse(JSON.stringify(this.loginAuthTypeList[this.tempLateCodeMap[this.showClikedDetailsPluginName]].templateConfig));
      this.edit = true;
    },
    //编辑passport信息
    editclosePassportAuthConfig() {
      this.labelPosition = "right"
      this.passport_auth.configEditable = true;
      console.log("editErpConfig+configEditable", this.passport_auth.configEditable)
      if (this.passport_auth.returnType === "unLoginPaths") {
        console.log("editErpConfig+returnType", this.passport_auth.returnType)
        let index = this.passport_auth.returnData.indexOf("=");
        this.passport_auth.returnData = this.passport_auth.returnData.substr(index + 1);
      }
      console.log(this.passport_auth.returnData);
    },
    //暂存passport信息
    savePassportAuthEditedChanges() {
      /**
       * 校验验证失败跳转路径
       */
      console.log(" 校验验证失败跳转路径")
      if (this.passport_auth.returnType === "unLoginPaths") {
        console.log("window.env.baseEnv", window.env.baseEnv);
        let urlReg = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/;
        if (urlReg.test(this.passport_auth.returnData) === false) {
          this.$message.warning("校验验证失败跳转路径格式失败", this.passport_auth.returnData);
          return;
        }
        this.passport_auth.returnData = window.env.erpAuthReturn + this.passport_auth.returnData;
        this.passport_auth.configData.unLoginPaths = this.passport_auth.returnData;
        if (this.passport_auth.configData.return_status != undefined)
          delete this.passport_auth.configData["return_status"];
      }
      /**
       * 验证返回 HTTP 状态码
       */

      console.log("验证返回 HTTP 状态码")
      if (this.passport_auth.returnType === "return_status") {
        let numReg = /^[0-9]*$/
        if (!numReg.test(this.passport_auth.returnData)) {
          this.$message.warning("HTTP 状态码格式错误", this.passport_auth.returnData);
          return;
        }
        this.passport_auth.configData.return_status = this.passport_auth.returnData;
        if (this.passport_auth.configData["unLoginPaths"] != undefined)
          delete this.passport_auth.configData["unLoginPaths"];
      }
      /**
       * 校验白名单
       *
       */

      console.log("校验白名单")
      let whiteUrlList = {}
      let whiteUrlReg = /^\/(\w+\/?)+$/;
      let urlSet = new Set();
      this.passport_auth.white_list = this.passport_auth.white_list.trim();
      this.passport_auth.white_list = this.passport_auth.white_list.endsWith(";") ? this.passport_auth.white_list.substr(0, this.passport_auth.white_list.length - 1) : this.passport_auth.white_list;
      if (this.passport_auth.white_list !== "") {
        let urlList = this.passport_auth.white_list.split(";");
        console.log("urlList+****************", urlList)
        for (let i = 0; i < urlList.length; i++) {
          if (whiteUrlReg.test(urlList[i])) {
            if (!urlSet.add(urlList[i])) {
              this.$message.warning("白名单重复" + urlList[i]);
              throw new Error("白名单重复" + urlList[i]);
            }
          } else {
            this.$message.warning("格式错误：" + urlList[i]);
            throw new Error("格式错误：" + urlList[i]);
          }
        }
        urlSet.forEach((url) => whiteUrlList[url] = {});
      }
      console.log("close start")
      this.passport_auth.configData.white_list.urls = whiteUrlList;

      console.log("whiteList" + this.passport_auth.configData.white_list.urls);


      this.loginAuthTypeList[this.tempLateCodeMap[this.showClikedDetailsPluginName]].templateConfig = JSON.parse(JSON.stringify(this.passport_auth.configData));
      this.dialogDetailsDetVisible = false;
      this.passport_auth.configEditable = false;
      this.labelPosition = "left"
    },
    //初始化passport白名单
    passport_auth_white_list() {
      let urlList = '';
      let urlKeys = Object.keys(this.passport_auth.configData.white_list.urls);
      if (urlKeys === null || urlKeys.length == 0)
        return urlList = '';
      for (let i = 0; i < urlKeys.length - 1; i++)
        urlList += urlKeys[i] + ';';
      urlList += urlKeys[urlKeys.length - 1];
      this.passport_auth.white_list = urlList;
    },

    passport_pc_auth_white_list() {
      let urlList = '';
      let urlKeys = Object.keys(this.passport_pc_auth.configData.white_list.urls);
      if (urlKeys === null || urlKeys.length == 0)
        return urlList = '';
      for (let i = 0; i < urlKeys.length - 1; i++)
        urlList += urlKeys[i] + ';';
      urlList += urlKeys[urlKeys.length - 1];
      this.passport_pc_auth.white_list = urlList;
    },
    closePassportPcAuthDialogDetails() {
      this.labelPosition = 'left'
      this.dialogDetailsDetVisible = false;
      this.passport_pc_auth.configEditable = false;
      this.passport_pc_auth.configData = JSON.parse(JSON.stringify(this.loginAuthTypeList[this.tempLateCodeMap[this.showClikedDetailsPluginName]].templateConfig));
      this.edit = true;
    },
    editclosePassportPcAuthConfig() {
      this.labelPosition = "right"
      this.passport_pc_auth.configEditable = true;
      console.log("editErpConfig+configEditable", this.passport_pc_auth.configEditable)
      if (this.passport_pc_auth.returnType === "unLoginPaths") {
        console.log("editErpConfig+returnType", this.passport_pc_auth.returnType)
        let index = this.passport_pc_auth.returnData.indexOf("=");
        this.passport_pc_auth.returnData = this.passport_pc_auth.returnData.substr(index + 1);
      }
      console.log(this.passport_pc_auth.returnData);
    },
    savePassportPcAuthEditedChanges() {
      /**
       * 校验验证失败跳转路径
       */
      console.log(" 校验验证失败跳转路径")
      if (this.passport_pc_auth.returnType === "unLoginPaths") {
        console.log("window.env.baseEnv", window.env.baseEnv);
        let urlReg = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/;
        if (urlReg.test(this.passport_pc_auth.returnData) === false) {
          this.$message.warning("校验验证失败跳转路径格式失败", this.passport_pc_auth.returnData);
          return;
        }
        this.passport_pc_auth.returnData = window.env.erpAuthReturn + this.passport_pc_auth.returnData;
        this.passport_pc_auth.configData.unLoginPaths = this.passport_pc_auth.returnData;
        if (this.passport_pc_auth.configData.return_status != undefined)
          delete this.passport_pc_auth.configData["return_status"];
      }
      /**
       * 验证返回 HTTP 状态码
       */

      console.log("验证返回 HTTP 状态码")
      if (this.passport_pc_auth.returnType === "return_status") {
        let numReg = /^[0-9]*$/
        if (!numReg.test(this.passport_pc_auth.returnData)) {
          this.$message.warning("HTTP 状态码格式错误", this.passport_pc_auth.returnData);
          return;
        }
        this.passport_pc_auth.configData.return_status = this.passport_pc_auth.returnData;
        if (this.passport_pc_auth.configData["unLoginPaths"] != undefined)
          delete this.passport_pc_auth.configData["unLoginPaths"];
      }
      /**
       * 校验白名单
       *
       */

      console.log("校验白名单")
      let whiteUrlList = {}
      let whiteUrlReg = /^\/(\w+\/?)+$/;
      let urlSet = new Set();
      this.passport_pc_auth.white_list = this.passport_pc_auth.white_list.trim();
      this.passport_pc_auth.white_list = this.passport_pc_auth.white_list.endsWith(";") ? this.passport_pc_auth.white_list.substr(0, this.passport_pc_auth.white_list.length - 1) : this.passport_pc_auth.white_list;
      if (this.passport_pc_auth.white_list !== "") {
        let urlList = this.passport_pc_auth.white_list.split(";");
        console.log("urlList+****************", urlList)
        for (let i = 0; i < urlList.length; i++) {
          if (whiteUrlReg.test(urlList[i])) {
            if (!urlSet.add(urlList[i])) {
              this.$message.warning("白名单重复" + urlList[i]);
              throw new Error("白名单重复" + urlList[i]);
            }
          } else {
            this.$message.warning("格式错误：" + urlList[i]);
            throw new Error("格式错误：" + urlList[i]);
          }
        }
        urlSet.forEach((url) => whiteUrlList[url] = {});
      }
      console.log("close start")
      this.passport_pc_auth.configData.white_list.urls = whiteUrlList;

      console.log("whiteList" + this.passport_pc_auth.configData.white_list.urls);


      this.loginAuthTypeList[this.tempLateCodeMap[this.showClikedDetailsPluginName]].templateConfig = JSON.parse(JSON.stringify(this.passport_pc_auth.configData));
      this.dialogDetailsDetVisible = false;
      this.passport_pc_auth.configEditable = false;
      this.labelPosition = "left"
    },
  },
  computed: {
    //计算插状态颜色
    couputedStatusColor() {
      if (this.statusIndex == 0)
        return "updateColor";
      if (this.statusIndex == 1)
        return "c-999";
      return null;
    },
    // 状态描述
    computedShowStatusDescr() {
      console.log("computedShowStatusDescr:" + this.statusValue[this.statusIndex]);
      return this.statusValue[this.statusIndex];
    },
    // passport错误验证错误处理规则输入提示
    passportAuthComputeReturnData() {
      this.passport_auth.returnData = "";
      if (this.passport_auth.returnType === "return_status")
        return "输入HTTP的状态码，如：401";
      if (this.passport_auth.returnType === "unLoginPaths") {
        return "输入URL地址，如：http://lcp.jd.com"
      }
    },
    passportPcAuthComputeReturnData() {
      this.passport_pc_auth.returnData = "";
      if (this.passport_pc_auth.returnType === "return_status")
        return "输入HTTP的状态码，如：401";
      if (this.passport_pc_auth.returnType === "unLoginPaths") {
        return "输入URL地址，如：http://lcp.jd.com"
      }
    },
    // erpt错误验证错误处理规则输入提示
    erpAuthcomputeReturnData() {
      this.erp_auth.returnData = "";
      if (this.erp_auth.returnType === "return_status")
        return "输入HTTP的状态码，如：401";
      if (this.erp_auth.returnType === "unLoginPaths") {
        return "输入URL地址，如：http://lcp.jd.com"
      }
    },
    // 京ME错误验证错误处理规则输入提示
    jingmeAuthComputeReturnData() {
      this.jing_me_auth.returnData = "";
      if (this.jing_me_auth.returnType === "return_status")
        return "输入HTTP的状态码，如：401";
      if (this.jing_me_auth.returnType === "unLoginPaths") {
        return "输入URL地址，如：http://lcp.jd.com"
      }
    },
    computeErpShowStatus() {
      return (this.loginAuthTypeList[this.tempLateCodeMap['erp-auth']]["domainPluginId"] > 0 && this.loginAuthTypeList[this.tempLateCodeMap['erp-auth']]["domainPluginId"] !== null)
    },
    computedErpStatus() {
      return "使用中";
    },
    computeJingmeAuthShowStatus() {
      console.log("computeJingmeAuthShowStatus____________________________________________________")
      console.log("computeJingmeAuthShowStatus", this.loginAuthTypeList[this.tempLateCodeMap['jing-me-auth']]["domainPluginId"])
      return (this.loginAuthTypeList[this.tempLateCodeMap['jing-me-auth']]["domainPluginId"] > 0)
    },
    computedJingmeAuthStatus() {
      return "使用中";
    },
    computedPassportAuthShowStatus() {
      return (this.loginAuthTypeList[this.tempLateCodeMap['passport-auth']]["domainPluginId"] > 0 && this.loginAuthTypeList[this.tempLateCodeMap['passport-auth']]["domainPluginId"] !== null)
    },
    computedPassportAuthStatus() {
      return "使用中";
    },
    computedPassportPcAuthShowStatus() {
      return (this.loginAuthTypeList[this.tempLateCodeMap['passport-pc-auth']]["domainPluginId"] > 0 && this.loginAuthTypeList[this.tempLateCodeMap['passport-pc-auth']]["domainPluginId"] !== null)
    },
    computedPassportPcAuthStatus() {
      return "使用中";
    },
  },
  watch: {
    loginAuthArray: {
      handler(newData, oldData) {
        this.loginAuthArray = newData
        this.init();
      },
      immediate: true,
      deep: true
    }
  },
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
