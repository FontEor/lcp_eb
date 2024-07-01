<template>
  <div class="over-view" ref="overview">
    <div>
      <el-form
        v-loading="loading"
        element-loading-text="加载中"
        element-loading-spinner="el-icon-loading"
        :model="bizUnitSummary"
        :rules="rules"
        ref="bizUnitSummary"
        label-width="118px"
        class="overview-apiSummaryForm"
        :disabled="!editor.status"
        size="small"
        style="margin-bottom: 24px"
      >
        <el-row>
          <el-col :span="14">
            <div class="sub-title">基本信息</div>
            <el-form-item label="方案类型" prop="solutionType">
              <el-col :span="24">
                <el-select
                  style="width: 100%"
                  v-model="bizUnitSummary.solutionType"
                  filterable
                  @change="changeCheckType"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in typeoptions"
                    :key="item.dictName"
                    :label="item.dictValue"
                    :value="item.dictName"
                  ></el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="所属分类" prop="businessTypeCode">
              <el-col :span="24">
                <el-select
                  style="width: 100%"
                  v-model="bizUnitSummary.businessTypeCode"
                  filterable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in businesstypesoptions"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="名称" prop="name" placeholder="2-30个字符">
              <el-col :span="24">
                <el-input
                  v-model="bizUnitSummary.name"
                  style="width: 100%"
                ></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="方案编码" prop="code" placeholder="方案编码">
              <el-col :span="24">
                <el-input
                  v-model="bizUnitSummary.code"
                  style="width: 100%"
                  :disabled="publishStatus!==1"
                ></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="产品负责人" prop="productPrincipal">
              <el-col :span="24">
                <el-tooltip
                  v-if="productPrincipalDisabled || !editor.status"
                  effect="dark"
                  content="修改对接方案负责人请前往【个人中心-资产交接】操作“个人资产交接”。如负责人已离职，请联系管理员进行操作“个人资产交接”。"
                  placement="top"
                >
                  <el-select
                    style="width: 100%"
                    v-model="addProdPinData.value"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入产品负责人京东账号"
                    :remote-method="searchProdPin"
                    :loading="addProdPinData.loading"
                    :disabled="productPrincipalDisabled"
                    @change="prodPinSelectChange"
                  >
                    <el-option
                      class="select-drop"
                      v-for="user in addProdPinData.account"
                      :key="user.userName"
                      :label="user.userName"
                      :value="user.userName"
                    >
                      <div class="j-v-center">
                        <div
                          class="avatar__wrapper"
                          style="display: inline-flex; height: 34px"
                        >
                          <div
                            :style="{
                              display: 'inlineFlex',
                              margin: '2px',
                              width: '30px',
                              height: '30px',
                              borderRadius: '50%',
                              lineHeight: '31px',
                              fontWeight: 'bold',
                              alignItems: 'center',
                              justifyContent: 'center',
                              textASSSSlign: 'center',
                              background:
                                'url(' +
                                user.headImg +
                                ') 0% 0% / 30px 30px no-repeat scroll content-box border-box transparent',
                            }"
                          ></div>
                        </div>
                        <div class="inputUsers__input__autocomplete--info">
                          <span>{{ user.userName }} ({{ user.realName }})</span>
                          <span>{{ user.organizationFullName }}</span>
                        </div>
                      </div>
                    </el-option>
                  </el-select>
                </el-tooltip>
                <el-select
                  v-else
                  style="width: 100%"
                  v-model="addProdPinData.value"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入产品负责人京东账号"
                  :remote-method="searchProdPin"
                  :loading="addProdPinData.loading"
                  :disabled="productPrincipalDisabled"
                  @change="prodPinSelectChange"
                >
                  <el-option
                    class="select-drop"
                    v-for="user in addProdPinData.account"
                    :key="user.userName"
                    :label="user.userName"
                    :value="user.userName"
                  >
                    <div class="j-v-center">
                      <div
                        class="avatar__wrapper"
                        style="display: inline-flex; height: 34px"
                      >
                        <div
                          :style="{
                            display: 'inlineFlex',
                            margin: '2px',
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            lineHeight: '31px',
                            fontWeight: 'bold',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textASSSSlign: 'center',
                            background:
                              'url(' +
                              user.headImg +
                              ') 0% 0% / 30px 30px no-repeat scroll content-box border-box transparent',
                          }"
                        ></div>
                      </div>
                      <div class="inputUsers__input__autocomplete--info">
                        <span>{{ user.userName }} ({{ user.realName }})</span>
                        <span>{{ user.organizationFullName }}</span>
                      </div>
                    </div>
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="研发负责人" prop="developPrincipal">
              <el-col :span="24">
                <el-tooltip
                  v-if="developPrincipalDisabled || !editor.status"
                  effect="dark"
                  content="修改对接方案负责人请前往【个人中心-资产交接】操作“个人资产交接”。如负责人已离职，请联系管理员进行操作“个人资产交接”。"
                  placement="top"
                >
                  <el-select
                    style="width: 100%"
                    v-model="addDevPinData.value"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入研发负责人京东账号"
                    :remote-method="searchDevPin"
                    :loading="addDevPinData.loading"
                    :disabled="developPrincipalDisabled"
                    @change="devPinSelectChange"
                  >
                    <el-option
                      class="select-drop"
                      v-for="user in addDevPinData.account"
                      :key="user.userName"
                      :label="user.userName"
                      :value="user.userName"
                    >
                      <div class="j-v-center">
                        <div
                          class="avatar__wrapper"
                          style="display: inline-flex; height: 34px"
                        >
                          <div
                            :style="{
                              display: 'inlineFlex',
                              margin: '2px',
                              width: '30px',
                              height: '30px',
                              borderRadius: '50%',
                              lineHeight: '31px',
                              fontWeight: 'bold',
                              alignItems: 'center',
                              justifyContent: 'center',
                              textASSSSlign: 'center',
                              background:
                                'url(' +
                                user.headImg +
                                ') 0% 0% / 30px 30px no-repeat scroll content-box border-box transparent',
                            }"
                          ></div>
                        </div>
                        <div class="inputUsers__input__autocomplete--info">
                          <span>{{ user.userName }} ({{ user.realName }})</span>
                          <span>{{ user.organizationFullName }}</span>
                        </div>
                      </div>
                    </el-option>
                  </el-select>
                </el-tooltip>
                <el-select
                  v-else
                  style="width: 100%"
                  v-model="addDevPinData.value"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入研发负责人京东账号"
                  :remote-method="searchDevPin"
                  :loading="addDevPinData.loading"
                  :disabled="developPrincipalDisabled"
                  @change="devPinSelectChange"
                >
                  <el-option
                    class="select-drop"
                    v-for="user in addDevPinData.account"
                    :key="user.userName"
                    :label="user.userName"
                    :value="user.userName"
                  >
                    <div class="j-v-center">
                      <div
                        class="avatar__wrapper"
                        style="display: inline-flex; height: 34px"
                      >
                        <div
                          :style="{
                            display: 'inlineFlex',
                            margin: '2px',
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            lineHeight: '31px',
                            fontWeight: 'bold',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textASSSSlign: 'center',
                            background:
                              'url(' +
                              user.headImg +
                              ') 0% 0% / 30px 30px no-repeat scroll content-box border-box transparent',
                          }"
                        ></div>
                      </div>
                      <div class="inputUsers__input__autocomplete--info">
                        <span>{{ user.userName }} ({{ user.realName }})</span>
                        <span>{{ user.organizationFullName }}</span>
                      </div>
                    </div>
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="简介" prop="remark">
              <el-input
                type="textarea"
                v-model="bizUnitSummary.remark"
                placeholder="描述对接方案的主要服务内容，10-200个字符."
                style="width: 100%"
              ></el-input>
            </el-form-item>
            <el-form-item label="可见范围" prop="publishRange">
              <el-radio-group
                v-model="bizUnitSummary.publishRange"
                @change="changePublishRange"
                style="width: 100%"
              >
                <el-radio :label="2">所有人可见</el-radio>
                <el-radio :label="1">指定开发团队可见</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="bizUnitSummary.publishRange == 1">
              <el-select
                class="remote-style"
                v-model="bizUnitSummary.visibleSupplierIsvList"
                multiple
                filterable
                remote
                placeholder="请输入公司名称或社会信用代码，指定可见的开发团队"
                @remove-tag="removeTag"
                value-key="supplierId"
                :remote-method="remoteMethod"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, index) in options"
                  :key="index"
                  :label="`${item.supplierName} ${item.companyCode}`"
                  :value="item"
                >
                  <span style="float: left">{{ item.supplierName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{
                    item.companyCode
                  }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 搜索公司下拉框 -->
          <el-col>
            <el-form-item label="对接环境">
              <el-checkbox-group
                v-model="formChooseEnv.data.environmentList"
                @change="onChangeEnvCheckboxGroup"
              >
                <el-checkbox
                  :label="env | formatFormCurrentEnvLabel"
                  :disabled="true"
                  >{{ env | formatFormCurrentEnvText }}</el-checkbox
                >
                <template v-if="env === 'uat' || env === 'prod'">
                  <template v-if="oldbizUnitSummary.hasUat === 0">
                    <el-popover
                      v-model="hasUatVisible"
                      placement="top"
                      width="160"
                      :disabled="!editor.status"
                    >
                      <p>预发环境开启后将无法关闭，是否仍要开启？</p>
                      <div style="text-align: right; margin: 10px 0 0">
                        <el-button
                          size="mini"
                          type="text"
                          @click="hasUatVisible = false"
                          >取消</el-button
                        >
                        <el-button
                          type="primary"
                          size="mini"
                          @click="onClickPopoverTurnOnButton"
                          >开启</el-button
                        >
                      </div>
                      <el-checkbox
                        slot="reference"
                        label="uat"
                        style="margin-left: 30px"
                        >预发环境（UAT）</el-checkbox
                      >
                    </el-popover>
                  </template>
                  <template v-else-if="oldbizUnitSummary.hasUat === 1">
                    <el-checkbox label="uat" :disabled="true">
                      <el-tooltip
                        effect="dark"
                        content="预发环境开启后将无法再关闭。"
                        placement="right"
                        :disabled="!editor.status"
                      >
                        <span>预发环境（UAT）</span>
                      </el-tooltip>
                    </el-checkbox>
                  </template>
                </template>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item>
              <span slot="label">
                订阅方案审批
                <el-tooltip
                  content="开启后，开发者订阅对接方案需要产品负责人和研发负责人在【OA-流程中心】审批，审批通过后方可订阅成功。"
                  placement="top"
                >
                  <i class="el-icon-help-solid" />
                </el-tooltip>
              </span>
              <el-switch
                v-model="bizUnitSummary.needApprove"
                size="big"
                active-inner-text="开"
                inactive-inner-text="关"
                :active-value="1"
                :inactive-value="0"
              >
              </el-switch>
            </el-form-item>
          </el-col>
          
        </el-row>
      </el-form>
    </div>
    <div class="edit-footer" ref="editfooter">
      <div class="edit-button">
        <el-button v-if="editor.status" @click="resetForm('bizUnitSummary')"
          >取消
        </el-button>
        <el-button
          type="primary"
          v-if="editor.status"
          @click="submitForm('bizUnitSummary')"
          >保存
        </el-button>
        <el-button
          type="primary"
          @click="editorForm()"
          style=""
          v-if="!editor.status"
          :disabled="editor.status"
          >编辑
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { hrFindUser } from "@/api/user";
import request from "@/utils/request";
import { Message } from "@lui/lui-ui";
import lcp from "@/api/intranet/lcp/index.js";


export default {
  name: "overView",
  props: {
    publishStatus: Number,
  },
  data() {
    const validateCode = async (rule, value, callback) => {
      if(value !== this.oldbizUnitSummary.code){
        const result = await this.handleIsCodeExist(value).catch((error) => {
          callback(new Error("对接方案编码校验异常"));
          throw new Error(`validateCode, ${error}`);
        });
        callback(result ? undefined : new Error("对接方案编码已存在"));
      }
    };
    return {
      env: window.env.baseEnv,
      editor: {
        status: false,
      },
      hasUatVisible: false,
      loading: true,
      bizUnitSummary: {
        id: "",
        code: "",
        name: "",
        solutionType: "", //方案类别
        businessTypeCode: "", //所属分类
        publishRange: 2, //1为私有，2为公开
        productPrincipal: "",
        developPrincipal: "",
        steps: [],
        remark: "",
        status: 1,
        visibleSupplierIsvList: [],
        needApprove: 1,
      },
      oldbizUnitSummary: {
        id: "",
        code: "",
        name: "",
        solutionType: "", //方案类别
        businessTypeCode: "", //所属分类
        publishRange: 2,
        productPrincipal: "",
        developPrincipal: "",
        steps: [{ title: "" }, { title: "" }, { title: "" }, { title: "" }],
        remark: "",
        status: 1,
        visibleSupplierIsvList: [],
        needApprove: 1,
      },
      rules: {
        businessTypeCode: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
        solutionType: [{ required: true, message: "请输入", trigger: "blur" }],
        name: [{ required: true, message: "请输入", trigger: "blur" }],
        code: [{ required: true, message: "请输入", trigger: "blur" },
            { min: 2, max: 30, message: "请输入2-30个字符" },
            { pattern: /^[A-Za-z_]*$/, message: "请输入英文字母、_" },
            { validator: validateCode },
            ],
        
        publishRange: [{ required: true, message: "请输入", trigger: "blur" }],
        productPrincipal: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
        developPrincipal: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
        remark: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      accessControlRules: {
        appType: [
          { required: true, message: "请选择应用类型", trigger: "blur" },
        ],
      },
      showRuleError: {
        step0: false,
        step1: false,
        step2: false,
        step3: false,
        step4: false,
        step5: false,
      },
      businessTypes: [],
      addProdPinData: {
        account: [],
        loading: false,
        value: "",
        realName: "",
        mobile: "",
        email: "",
        realNameEdit: true,
        mobileEdit: true,
        emailEdit: true,
      },
      addDevPinData: {
        account: [],
        loading: false,
        value: "",
        realName: "",
        mobile: "",
        email: "",
        realNameEdit: true,
        mobileEdit: true,
        emailEdit: true,
      },
      unitId: 0,
      accessId: "",
      accessControl: {
        appType: 2,
      },
      options: [],
      list: [],
      loading: false,
      supplierArray: [],
      tempVisibleSupplierIsvList: [],
      formChooseEnv: {
        data: {
          environmentList: [],
        },
      },
      typeoptions: [], //方案类别Options
      businesstypesoptions: [], //所属分类Options

      productPrincipalDisabled: false,
      developPrincipalDisabled: false,
    };
  },
  filters: {
    formatFormCurrentEnvLabel(env) {
      const hashMap = { test: "test", uat: "prod", prod: "prod" };
      return hashMap[env] || "";
    },
    formatFormCurrentEnvText(env) {
      const hashMap = { test: "测试环境", uat: "生产环境", prod: "生产环境" };
      return hashMap[env] || "-";
    },
  },
  methods: {
    onChangeEnvCheckboxGroup(value) {
      if (value.includes("uat")) {
        this.formChooseEnv.data.environmentList = ["prod"];
        this.hasUatVisible = true;
      } else {
        this.hasUatVisible = false;
      }
    },
    onClickPopoverTurnOnButton() {
      this.formChooseEnv.data.environmentList = ["prod", "uat"];
      this.hasUatVisible = false;
    },
    returnStepsIndex(index) {
      if (index == 0) {
        return "一";
      } else if (index == 1) {
        return "二";
      } else if (index == 2) {
        return "三";
      } else if (index == 3) {
        return "四";
      } else if (index == 4) {
        return "五";
      } else if (index == 5) {
        return "六";
      } else if (index == 6) {
        return "七";
      }
    },
    flowLableClass(index) {
      if (index > 3) {
        return {
          "flow-lable": true,
          "is-required-flow": false,
        };
      } else {
        return {
          "flow-lable": true,
          "is-required-flow": true,
        };
      }
    },
    changeRuleErrorVisible(title, index) {
      if (title.length < 4 || title.length > 40) {
        this.showRuleError["step" + index] = true;
      } else {
        this.showRuleError["step" + index] = false;
      }
    },
    fetchBizUnitSummary() {
      let _this = this;
      let url = "/bizunit/getOverview";
      _this.loading = true;
      request({
        url: url,
        method: "get",
        params: { id: _this.oldbizUnitSummary.id },
      })
        .then((rsp) => {
          if (rsp.data) {
            this.fetchBusinessTypes(rsp.data.solutionType + "");
            _this.oldbizUnitSummary = rsp.data;
            this.oldbizUnitSummary.solutionType =
              _this.oldbizUnitSummary.solutionType + "";
            this.bizUnitSummary.VisibleSupplierIsvList =
              rsp.data.visibleSupplierIsvList;
            console.log(this.options, "this.options");
            if (this.options && this.options.length === 0) {
              this.options = this.bizUnitSummary.VisibleSupplierIsvList;
            }
            this.tempVisibleSupplierIsvList = rsp.data.visibleSupplierIsvList;
            // if (
            //   !_this.oldbizUnitSummary.steps ||
            //   _this.oldbizUnitSummary.steps.length == 0
            // ) {
            //   _this.oldbizUnitSummary.steps = [
            //     {
            //       title: "",
            //       unitId: _this.oldbizUnitSummary.id,
            //       serialNumber: 1,
            //     },
            //     {
            //       title: "",
            //       unitId: _this.oldbizUnitSummary.id,
            //       serialNumber: 2,
            //     },
            //     {
            //       title: "",
            //       unitId: _this.oldbizUnitSummary.id,
            //       serialNumber: 3,
            //     },
            //     {
            //       title: "",
            //       unitId: _this.oldbizUnitSummary.id,
            //       serialNumber: 4,
            //     },
            //   ];
            // }
            _this.bizUnitSummary = _this.copyDeep(_this.oldbizUnitSummary);
            if (_this.bizUnitSummary.productPrincipal) {
              this.productPrincipalDisabled = true;
              _this.addProdPinData.value =
                _this.bizUnitSummary.productPrincipal.split(":")[0];
            }
            if (_this.bizUnitSummary.developPrincipal) {
              this.developPrincipalDisabled = true;
              _this.addDevPinData.value =
                _this.bizUnitSummary.developPrincipal.split(":")[0];
            }
            this.loading = false;
            // 表单发布环境数据初始化 其中生产环境下值为["uat", "prod"]
            this.formChooseEnv.data.environmentList = [this.env];
            if (this.env == "uat" || this.env == "prod") {
              if (_this.oldbizUnitSummary.hasUat == 1) {
                this.formChooseEnv.data.environmentList = ["prod", "uat"];
              } else if (_this.oldbizUnitSummary.hasUat == 0) {
                this.formChooseEnv.data.environmentList = ["prod"];
              }
            }
          } else {
            Message.error("无权限查看数据");
          }
        })
        .catch((e) => {
          console.log(e);
          this.loading = false;
        });
    },
    searchProdPin(key) {
      if (key !== "") {
        this.addProdPinData.loading = true;
        setTimeout(() => {
          hrFindUser(key)
            .then((rsp) => {
              this.addProdPinData.loading = false;
              this.addProdPinData.account = rsp.data;
            })
            .catch((e) => {});
        }, 200);
      } else {
        this.addProdPinData.account = [];
        this.addDevPinData.account = [];
      }
    },
    searchDevPin(key) {
      if (key !== "") {
        this.addDevPinData.loading = true;
        setTimeout(() => {
          hrFindUser(key)
            .then((rsp) => {
              this.addDevPinData.loading = false;
              this.addDevPinData.account = rsp.data;
            })
            .catch((e) => {});
        }, 200);
      } else {
        this.addProdPinData.account = [];
        this.addDevPinData.account = [];
      }
    },
    prodPinSelectChange(value) {
      this.addProdPinData.realName = "";
      this.addProdPinData.mobile = "";
      this.addProdPinData.email = "";
      this.addProdPinData.account.forEach((val, index) => {
        if (value === val.userName) {
          if (val.realName) {
            this.addProdPinData.realNameEdit = true;
            this.addProdPinData.realName = val.realName;
          } else {
            this.addProdPinData.realNameEdit = false;
          }
          if (val.mobile) {
            this.addProdPinData.mobileEdit = true;
            this.addProdPinData.mobile = val.mobile;
          } else {
            this.addProdPinData.mobileEdit = false;
          }
          if (val.email) {
            this.addProdPinData.emailEdit = true;
            this.addProdPinData.email = val.email;
          } else {
            this.addProdPinData.emailEdit = false;
          }
          this.bizUnitSummary.productPrincipal =
            val.userName + ":" + val.realName;
        }
      });
    },
    devPinSelectChange(value) {
      this.addDevPinData.realName = "";
      this.addDevPinData.mobile = "";
      this.addDevPinData.email = "";
      this.addDevPinData.account.forEach((val, index) => {
        if (value === val.userName) {
          if (val.realName) {
            this.addDevPinData.realNameEdit = true;
            this.addDevPinData.realName = val.realName;
          } else {
            this.addDevPinData.realNameEdit = false;
          }
          if (val.mobile) {
            this.addDevPinData.mobileEdit = true;
            this.addDevPinData.mobile = val.mobile;
          } else {
            this.addDevPinData.mobileEdit = false;
          }
          if (val.email) {
            this.addDevPinData.emailEdit = true;
            this.addDevPinData.email = val.email;
          } else {
            this.addDevPinData.emailEdit = false;
          }
          this.bizUnitSummary.developPrincipal =
            val.userName + ":" + val.realName;
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
        
          if(this.publishStatus===1){
            this.updateOverview();
          }else{
            this.$confirm('点击【确定】后，<span style="color: red;">方案类型、所属分类、名称、简介</span>和<span style="color: red;">可见范围</span>，将立即更新至前台，其余信息将随方案发布而更新。', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              dangerouslyUseHTMLString: true,
              type: 'warning'
            }).then(() => {
              this.updateOverview();
            }).catch(() => {
              this.loading = false;
            });
          }
         
        } else {
          return false;
        }
      });
    },

    updateOverview(){
      //添加如果是现实并且选择了uat逻辑
      this.bizUnitSummary.hasUat = 0;
        if (this.env === "uat" || this.env === "prod") {
          if (this.formChooseEnv.data.environmentList.includes("uat")) {
            this.bizUnitSummary.hasUat = 1;
          }
        }
        request({
          url: "/bizunit/updateOverview",
          method: "post",
          data: this.bizUnitSummary,
        })
          .then((rsp) => {
            if (rsp.data) {
              Message.success("操作成功");
              this.$emit("overviewEditEvent", this.bizUnitSummary.hasUat); //给父组件传递hasUat
              this.fetchBizUnitSummary();
              this.editor.status = false;
            } else {
              Message.error("操作失败");
            }
          })
          .catch((e) => {
            console.log(e);
            Message.error("操作失败");
            this.loading = false;
          });
    },

    resetForm(formName) {
      this.$refs[formName].clearValidate();
      this.$refs[formName].resetFields();
      this.bizUnitSummary.id = this.oldbizUnitSummary.id;
      this.bizUnitSummary.name = this.oldbizUnitSummary.name;
      this.bizUnitSummary.code = this.oldbizUnitSummary.code;
      this.bizUnitSummary.solutionType = this.oldbizUnitSummary.solutionType;
      this.bizUnitSummary.businessTypeCode =
        this.oldbizUnitSummary.businessTypeCode;
      this.bizUnitSummary.publishRange = this.oldbizUnitSummary.publishRange;
      this.bizUnitSummary.productPrincipal =
        this.oldbizUnitSummary.productPrincipal;
      this.bizUnitSummary.developPrincipal =
        this.oldbizUnitSummary.developPrincipal;
      this.bizUnitSummary.steps = this.copyDeep(this.oldbizUnitSummary.steps);
      this.bizUnitSummary.remark = this.oldbizUnitSummary.remark;
      this.bizUnitSummary.visibleSupplierIsvList =
        this.oldbizUnitSummary.visibleSupplierIsvList;
      this.bizUnitSummary.needApprove = this.oldbizUnitSummary.needApprove;
      this.editor.status = false;
      this.showRuleError = {
        step1: false,
        step2: false,
        step3: false,
        step4: false,
        step5: false,
        step6: false,
      };
    },
    editorForm() {
      if (this.oldbizUnitSummary.status === 3) {
        Message.error("信息正在审核中，不能编辑");
      } else {
        this.editor.status = true;
      }
    },
    copyDeep(templateData) {
      return JSON.parse(JSON.stringify(templateData));
    },

    fetchBizUnitAccess() {
      let _this = this;
      let url = "/bizaccess/getBizAccessByUnitId";
      request({
        url: url,
        method: "get",
        params: { bizUnitId: this.unitId },
      })
        .then((rsp) => {
          if (rsp.data) {
            let config = rsp.data;
            let accessConfig = JSON.parse(config.access);
            _this.accessId = config.id;
            if (accessConfig["type"] === "oauth2") {
              _this.accessControl.appType = 2;
            }
            this.accessControl.appType = rsp.data.appType;
          }
        })
        .catch((e) => {
          console.log(e);
          this.loading = false;
        });
    },
    remoteMethod(query) {
      if (query !== "") {
        setTimeout(() => {
          this.findVisibleSuppliers(query);
        }, 200);
      } else {
        this.options = [];
      }
    },
    async changePublishRange() {
      if (this.bizUnitSummary.publishRange == 1) {
        //私有
        await this.queryOrder();
      }
    },
    queryOrder() {
      let url = "/bizunit/findBizOrderList";
      let params = {
        pageSize: 50,
        pageNumb: 1,
        unitId: this.unitId,
        status: 1,
      };
      request({
        url: url,
        method: "get",
        params: params,
      })
        .then((rsp) => {
          if (rsp.data) {
            if (rsp.data.length > 0) {
              this.supplierArray = [];
              for (var i = 0; i < rsp.data.length; i++) {
                this.supplierArray.push(rsp.data[i].supplierName);
              }
              //一个开发商有多个应用可以订阅同一个对接方案，所以需要对开发商名称做去重处理
              this.supplierArray = Array.from(new Set(this.supplierArray));
              this.$alert(
                this.supplierArray.join(",") +
                  "开发商已订阅对接方案，对接方案私有后，如不被指定为可见开发商，将无法看到对接方案相关文档",
                "提示",
                {
                  confirmButtonText: "确定",
                }
              );
            }
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    findVisibleSuppliers(query) {
      request({
        url: "/bizvisiblesupplier/getBizVisibleSupplierPreList",
        method: "get",
        params: { unitId: this.unitId, name: query },
      })
        .then((rsp) => {
          if (rsp.data) {
            this.options = rsp.data;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },

    checkSupplierOrder(index, val) {
      let url = "/bizunit/checkSupplierOrder";
      const unitId = Number(this.unitId);
      const supplierId = Number(val.supplierId);
      let params = { unitId, supplierId };
      request({
        url: url,
        method: "post",
        data: params,
      })
        .then((rsp) => {
          if (rsp.data) {
            //不能删除
            this.bizUnitSummary.visibleSupplierIsvList.splice(index, 0, val);
            this.$alert(
              val.supplierName + "已订阅该对接方案，不允许删除",
              "提示",
              {
                confirmButtonText: "确定",
              }
            );
          }
        })
        .catch((e) => {
          this.bizUnitSummary.visibleSupplierIsvList.splice(index, 0, val);
          console.log(e);
        });
    },
    removeTag(val) {
      console.log(val);
      const findSupplier = (item) => item.supplierId == val.supplierId;
      const index = this.tempVisibleSupplierIsvList.findIndex(findSupplier);
      console.log(index);
      if (index !== -1) {
        //默认返回数据不能直接删除，需要校验对接方案和开发商是否存在订阅关系
        this.checkSupplierOrder(index, val);
      }
    },
    //获取方案类型
    fetchSolutionType() {
      request({
        url: "/lcpDict/getDicts",
        method: "get",
        params: { type: "solutionType" },
      })
        .then((rsp) => {
          if (rsp.code === 20000) {
            this.typeoptions = rsp.data;
          }
        })
        .catch((e) => {
          callback();
        });
    },
    //获取所属分类字典
    fetchBusinessTypes(value) {
      request({
        url: "/businesstype/findBySolutionType",
        method: "get",
        params: { solutionType: value },
      })
        .then((rsp) => {
          if (rsp.code === 20000) {
            this.businesstypesoptions = rsp.data;
          }
        })
        .catch((e) => {
          callback();
        });
    },
    /**
     * 选中对接方案类型
     */
    changeCheckType(value) {
      this.bizUnitSummary.businessTypeCode = "";
      request({
        url: "/businesstype/findBySolutionType",
        method: "get",
        params: { solutionType: value },
      })
        .then((rsp) => {
          if (rsp.code === 20000) {
            this.businesstypesoptions = rsp.data;
          }
        })
        .catch((e) => {
          callback();
        });
    },
    // 根据对接方案编码校验其是否已存在
    async isCodeExist(code) {
      const params = { code };
      return await lcp.bizunit.isCodeExist(params).catch((error) => {
        throw new Error(`isCodeExist, ${error}`);
      });
    },

    async handleIsCodeExist(query) {
      const { data = false } = await this.isCodeExist(query).catch((error) => {
        throw new Error(`handleIsCodeExist, ${error}`);
      });
      return data || false;
    },
  },
  created() {
    this.oldbizUnitSummary.id = this.$route.params.id;
    this.fetchSolutionType();
    this.fetchBizUnitSummary();

    this.unitId = this.$route.params.id;
    this.fetchBizUnitAccess();
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        let overviewWidth = this.$refs.overview.offsetWidth; //获取元素宽度
        this.$refs.editfooter.style.setProperty(
          "width",
          `${overviewWidth + 40}px`
        );
      }, 500);
    });
    const that = this;
    window.onresize = function temp() {
      let overviewWidth = that.$refs.overview.offsetWidth; //获取元素宽度
      that.$refs.editfooter.style.setProperty(
        "width",
        `${overviewWidth + 40}px`
      );
    };
  },
};
</script>

<style lang="scss" scoped>
.sub-title {
  font-family: PingFangSC-Medium;
  margin-bottom: 20px;
  font-size: 16px;
  color: #333333;
}
.timeline-wrapper {
  margin-left: 24px;
  margin-top: 26px;
  .step-content {
    display: inline-block;
    margin-left: 22px;
  }
}
.el-row {
  margin-bottom: 0px;
}
.remote-style {
  width: 380px;
}

.el-tag.el-tag--info {
  height: 26px;
  background-color: #ecf5ff;
  border-color: #e9e9eb;
  color: #409eff;
}

.el-select .el-tag__close.el-icon-close {
  background-color: #ecf5ff;
  color: #409eff;
}

.el-select .el-tag__close.el-icon-close:hover {
  background-color: #409eff;
  color: white;
}

.j-v-center {
  display: flex;
  align-items: center;
}

.inputUsers__input__autocomplete--info {
  margin-left: 10px;
  line-height: 1.5;
}

.inputUsers__input__autocomplete--info span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.inputUsers__input__autocomplete--info span:last-child {
  font-size: 12px;
  color: #8f9399;
  display: inline-block;
}
.select-drop {
  &.el-select-dropdown__item {
    height: 50px;
  }
}
.el-select-dropdown {
  z-index: 2050 !important;
}

.flow-circle {
  white-space: nowrap;
  outline: none;
  display: inline-block;
  line-height: 1;
  position: relative;
  vertical-align: middle;
}

.flow-circle-inner {
  border: 1px solid #d9d9d9;
  border-radius: 100%;
  width: 14px;
  height: 14px;
  background-color: #fff;
  position: relative;
  display: inline-block;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.flow-title {
  font-size: 14px;
  padding-left: 10px;
}

.flow-lable {
  width: 100px;
  text-align: right;
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: #666;
  line-height: 28px;
  padding: 0 12px 0 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  position: relative;
  font-weight: 700;
}

.is-required-flow:before {
  content: "*";
  color: #e1251b;
  margin-right: 4px;
}

.flow-item {
  margin-left: 100px;
  line-height: 28px;
  position: relative;
  font-size: 14px;
}

.flow-badge >>> .el-badge__content {
  height: 20px;
}

.flow-item >>> .el-input {
  width: 80%;
}

.flow-title >>> .el-input__inner {
  height: 28px;
}

.flow-del-btn {
  position: absolute;
  top: 0;
  right: 10px;
  -webkit-transform: translateY(-50%) translateX(100%);
  transform: translateY(-50%) translateX(100%);
  color: #e1251b;
}
.bizunit-steps {
  width: 600px;
}
.el-button:active {
  /* color: #3663d8; */
  /* border-color: #3663d8; */
  /* outline: 0; */
}

.el-button:focus,
.el-button:hover {
  /* color: #3c6ef0; */
  /* border-color: #c5d4fb; */
  /* background-color: #ecf1fe; */
}
.text {
  color: #999999;
}
.step-button {
  margin-left: 414px;
  margin-top: -48px;
}
.over-view {
  position: relative;
  .el-icon-help-solid {
    color: #3c6ef0;
    font-size: 18px;
  }
  .edit-footer {
    width: 100px;
    display: flex;
    justify-content: flex-end;
    border-top: 2px solid #f5f5f5;
    background-color: #ffffff;
    position: fixed;
    bottom: 0px;
    right: 20px;
    z-index: 1;
    .edit-button {
      margin: 10px 20px 10px 0;
    }
  }
}
</style>
