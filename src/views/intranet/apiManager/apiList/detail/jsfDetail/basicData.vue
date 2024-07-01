<template>
  <div class="mod-overview">
    <el-form
      v-loading="loading"
      element-loading-text="加载中"
      element-loading-spinner="el-icon-loading"
      :model="apiSummaryForm"
      :rules="rules"
      ref="apiSummaryForm"
      label-width="100px"
      class="overview-apiSummaryForm"
      :disabled="editer.status"
    >
      <el-form-item label="中文名称" prop="cnName">
        <el-input
          v-if="!editer.status"
          v-model="apiSummaryForm.cnName"
        ></el-input>
        <span v-if="editer.status">{{
          apiSummaryForm.cnName === "" ? "未填写" : apiSummaryForm.cnName
        }}</span>
      </el-form-item>
      <el-form-item label="所属分类" prop="businessCategoryId">
        <el-select
          v-if="!editer.status"
          v-model="apiSummaryForm.businessCategoryId"
          :filterable="true"
          :filter-method="this.categoryFilter"
          placeholder="请选择所属分类"
        >
          <el-option
            v-for="category in categoryList"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          ></el-option>
        </el-select>
        <span v-if="editer.status">{{
          apiSummaryForm.businessCategoryName === ""
            ? "未填写"
            : apiSummaryForm.businessCategoryName
        }}</span>
      </el-form-item>
      <el-form-item label="所属应用" prop="appName">
        <span>{{ apiSummaryForm.appName }}</span>
        <span>{{ apiSummaryForm.appCode === "" ? "" : "(" }}</span>
        <span>{{
          apiSummaryForm.appCode === "" ? "" : apiSummaryForm.appCode
        }}</span>
        <span>{{ apiSummaryForm.appCode === "" ? "" : ")" }}</span>
      </el-form-item>

      <el-popover placement="bottom-end" width="260" v-model="popoverVisible">
        <div>
          <div>
            <i
              style="color: red; font-size: 18px; position: absolute; top: 40px"
              class="el-icon-warning"
            ></i>
          </div>
          <p style="margin-left: 24px; margin-top: 10px">
            【{{
              addProdPinData.realName
            }}】不在您的团队下，为了不影响接口审批，建议去【个人中心】将该用户拉入您的团队
          </p>
        </div>
        <div style="text-align: right; margin: 10px 0 0">
          <el-button size="mini" type="primary" @click="popoverVisible = false"
            >我知道了</el-button
          >
        </div>
        <el-form-item
          v-if="!editer.status"
          slot="reference"
          label="产品负责人"
          prop="mainProd"
        >
          <el-select
            style="width: 100%"
            v-model="addProdPinData.value"
            :filterable="true"
            :remote="true"
            :reserve-keyword="true"
            :placeholder="this.mainProdPlaceHolder"
            :remote-method="searchProdPin"
            :loading="addProdPinData.loading"
            :disabled="status !== 1"
            popper-class="erp-info-select"
            v-on:change="prodPinSelectChange"
          >
            <el-option
              v-for="user in addProdPinData.zhanghaos"
              :key="user.userName"
              :label="user.userName"
              :value="user.userName"
            >
              <div class="cbox ptb5">
                <div class="avatar__wrapper">
                  <div
                    :style="{
                      display: 'inlineFlex',
                      margin: '2px',
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background:
                        'url(' +
                        user.headImg +
                        ') 0% 0% / 30px 30px no-repeat scroll content-box border-box transparent'
                    }"
                  />
                </div>
                <div class="inputUsers__input__autocomplete--info vhbox">
                  <span>{{ user.userName }} ({{ user.realName }})</span>
                  <span>{{ user.organizationFullName }}</span>
                </div>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
      </el-popover>
      <!-- 非编辑态产品负责人 -->
      <el-form-item v-if="editer.status" label="产品负责人" prop="mainProd">
        <span>{{
          addProdPinData.value === "" ? "未填写" : addProdPinData.value
        }}</span>
      </el-form-item>

      <el-popover
        placement="bottom-end"
        width="260"
        v-model="popoverDevVisible"
      >
        <div>
          <div>
            <i
              style="color: red; font-size: 18px; position: absolute; top: 40px"
              class="el-icon-warning"
            ></i>
          </div>
          <p style="margin-left: 24px; margin-top: 10px">
            【{{
              addDevPinData.realName
            }}】不在您的团队下，为了不影响接口审批，建议去【个人中心】将该用户拉入您的团队
          </p>
        </div>
        <div style="text-align: right; margin: 10px 0 0">
          <el-button
            size="mini"
            type="primary"
            @click="popoverDevVisible = false"
            >我知道了</el-button
          >
        </div>
        <el-form-item
          v-if="!editer.status"
          slot="reference"
          label="研发负责人"
          prop="mainDev"
        >
          <el-select
            style="width: 100%"
            v-model="addDevPinData.value"
            :filterable="true"
            :remote="true"
            :reserve-keyword="true"
            :placeholder="this.mainDevPlaceHolder"
            :remote-method="searchDevPin"
            :loading="addDevPinData.loading"
            :disabled="status !== 1"
            popper-class="erp-info-select"
            v-on:change="devPinSelectChange"
          >
            <el-option
              v-for="user in addDevPinData.zhanghaos"
              :key="user.userName"
              :label="user.userName"
              :value="user.userName"
            >
              <div class="cbox ptb5">
                <div class="avatar__wrapper">
                  <div
                    :style="{
                      display: 'inlineFlex',
                      margin: '2px',
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background:
                        'url(' +
                        user.headImg +
                        ') 0% 0% / 30px 30px no-repeat scroll content-box border-box transparent'
                    }"
                  />
                </div>
                <div class="inputUsers__input__autocomplete--info vhbox">
                  <span>{{ user.userName }} ({{ user.realName }})</span>
                  <span>{{ user.organizationFullName }}</span>
                </div>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
      </el-popover>
      <!-- 非编辑态研发负责人 -->
      <el-form-item v-if="editer.status" label="研发负责人" prop="mainDev">
        <span>{{
          addDevPinData.value === "" ? "未填写" : addDevPinData.value
        }}</span>
      </el-form-item>

      <el-form-item label="功能描述" prop="remark">
        <el-input
          v-if="!editer.status"
          type="textarea"
          v-model="apiSummaryForm.remark"
          :placeholder="this.remarkPlaceHolder"
        ></el-input>
        <span class="remark-content" v-if="editer.status">{{
          apiSummaryForm.remark === "" ? "未填写" : apiSummaryForm.remark
        }}</span>
      </el-form-item>
      <el-form-item label="Maven坐标" prop="mvn">
        <el-input
          v-if="!editer.status"
          type="textarea"
          :rows="5"
          :autosize="true"
          v-model="apiSummaryForm.mvn"
          :placeholder="this.MvnPlaceHolder"
        ></el-input>
        <span v-if="editer.status" class="mvn">{{
          apiSummaryForm.mvn === null || apiSummaryForm.mvn === ""
            ? "未填写"
            : apiSummaryForm.mvn
        }}</span>
      </el-form-item>
      <el-form-item v-if="!editer.status">
        <el-button v-on:click="resetForm('apiSummaryForm')">取消 </el-button>
        <el-button type="primary" v-on:click="submitForm('apiSummaryForm')"
          >保存
        </el-button>
      </el-form-item>
    </el-form>
    <el-button
      type="primary"
      v-on:click="editerForm('apiSummaryForm')"
      style="margin-left: 6.5%"
      v-if="editer.status && jsfBasicEditBtnStatus.visible"
      :disabled="jsfBasicEditBtnStatus.disabled"
      >编辑
    </el-button>
  </div>
</template>

<script>
import { Message } from "@lui/lui-ui";
import { hrFindUser } from "@/api/user";
import { findBusinessCategoryList } from "@/api/apiStore/api";
import api from "@/api/index.js";
import gwApiRequest from "@/utils/gwApiRequest.js";

export default {
  props: {
    status: { type: Number, required: true },
    jsfBasicEditBtnStatus: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      popoverVisible: false,
      popoverDevVisible: false,
      editer: {
        status: true
      },

      addProdPinData: {
        zhanghaos: [],
        loading: false,
        value: "",
        realName: "",
        mobile: "",
        email: "",
        realNameEdit: true,
        mobileEdit: true,
        emailEdit: true
      },
      addDevPinData: {
        zhanghaos: [],
        loading: false,
        value: "",
        realName: "",
        mobile: "",
        email: "",
        realNameEdit: true,
        mobileEdit: true,
        emailEdit: true
      },

      oldApiSummaryForm: {
        id: "",
        oldCnName: "",
        oldServiceType: "",
        oldStatus: "",
        oldMainProd: "",
        oldMainDev: "",
        oldRemark: "",
        oldMvn: "",
        oldBusinessCategoryId: ""
      },

      apiSummaryForm: {
        cnName: "",
        status: "",
        remark: "",
        mvn: "",
        stakeholderList: [],
        mainProd: "",
        mainDev: "",
        id: "",
        businessCategoryId: "",
        businessCategoryName: "",
        appName: "",
        appCode: "",
      },
      categoryList: [],
      copyCategoryList: [],

      rules: {
        mainProd: [
          {
            required: true,
            message: "请输入产品负责人京东账号",
            trigger: "blur"
          }
        ],
        mainDev: [
          {
            required: true,
            message: "请输入研发负责人京东账号",
            trigger: "blur"
          }
        ],
        cnName: [
          { required: true, message: "请输入API名称", trigger: "blur" },
          {
            min: 2,
            max: 255,
            message: "长度在 2 到 255 个字符",
            trigger: "blur"
          }
        ],
        prodPin: [
          { required: true, message: "请输入产品负责人", trigger: "blur" }
        ],
        devPin: [
          { required: true, message: "请输入研发负责人", trigger: "blur" }
        ],
        remark: [
          { required: true, message: "请输入功能描述", trigger: "blur" },
          {
            min: 10,
            max: 255,
            message: "长度在10 到 255 个字符",
            trigger: "blur"
          }
        ],
        mvn: [{ required: true, message: "请输入Maven坐标", trigger: "blur" }],
        businessCategoryId: [
          { required: true, message: "请选择所属分类", trigger: "change" }
        ],
      },
      loading: true,
    };
  },
  computed: {
    mainProdPlaceHolder() {
      return "请输入产品负责人京东账号";
    },
    mainDevPlaceHolder() {
      return "请输入研发负责人京东账号";
    },
    remarkPlaceHolder() {
      return "描述API的主要作用,10-255个字符";
    },
    MvnPlaceHolder() {
      return (
        "<dependency>\n" +
        "            <groupId>com.xxx.xxx</groupId>\n" +
        "            <artifactId>xxxxx</artifactId>\n" +
        "            <version>x.x.x</version>\n" +
        "     </dependency>"
      );
    }
  },
  methods: {
    async findApiBaseInfo() {
      const { id } = this.$route.params;
      const data = [{ id }];
      return await gwApiRequest.post(
        "/ApiManagerService/findApiBaseInfo",
        JSON.stringify(data)
      );
    },
    async saveApiBaseInfo() {
      const { apiSummaryForm } = this;
      const data = [{ ...apiSummaryForm }];
      return await gwApiRequest.post(
        "/ApiManagerService/saveApiBaseInfo",
        JSON.stringify(data)
      );
    },

    categoryFilter(val) {
      console.log(val);
      if (val) {
        this.categoryList = this.copyCategoryList.filter(item => {
          if (item.name.indexOf(val) !== -1) return true;
        });
      } else {
        this.categoryList = this.copyCategoryList;
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          await this.saveApiBaseInfo().catch(() => {
            throw new Error("submitForm saveApiBaseInfo");
          });
          Message.success("API信息修改成功");
          for (let x of this.categoryList) {
            if (
              Number(this.apiSummaryForm.businessCategoryId === Number(x.id))
            ) {
              this.apiSummaryForm.businessCategoryName = x.name;
            }
          }
          this.editer.status = true;
          this.fetchApiSummary();
          this.$emit("updateStatus");
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.editer.status = true;
      this.$refs[formName].clearValidate();
      this.apiSummaryForm.cnName = this.oldApiSummaryForm.oldCnName;
      this.apiSummaryForm.businessCategoryId = this.oldApiSummaryForm.oldBusinessCategoryId;
      this.apiSummaryForm.status = this.oldApiSummaryForm.oldStatus;
      this.apiSummaryForm.remark = this.oldApiSummaryForm.oldRemark;
      this.apiSummaryForm.mvn = this.oldApiSummaryForm.oldMvn;
      if (this.oldApiSummaryForm.oldMainProd !== "") {
        this.apiSummaryForm.mainProd =
          this.oldApiSummaryForm.oldMainProd +
          ":" +
          this.addProdPinData.realName;
      } else {
        this.apiSummaryForm.mainProd = "";
      }
      if (this.oldApiSummaryForm.oldMainDev !== "") {
        this.apiSummaryForm.mainDev =
          this.oldApiSummaryForm.oldMainDev + ":" + this.addDevPinData.realName;
      } else {
        this.apiSummaryForm.mainDev = "";
      }
      this.addProdPinData.value = this.oldApiSummaryForm.oldMainProd;
      this.addDevPinData.value = this.oldApiSummaryForm.oldMainDev;
    },

    editerForm(formName) {
      this.editer.status = false;
    },

    async fetchApiSummary() {
      const { data } = await this.findApiBaseInfo().catch(() => {
        this.loading = false;
        throw new Error("fetchApiSummary findApiBaseInfo");
      });
      this.apiSummaryForm = data;
      delete this.apiSummaryForm.createTime;
      delete this.apiSummaryForm.updateTime;
      delete this.apiSummaryForm.ts;
      delete this.apiSummaryForm.serviceType;
      if (this.apiSummaryForm.mainProd) {
        this.addProdPinData.value = this.apiSummaryForm.mainProd.split(":")[0];
        this.addProdPinData.realName = this.apiSummaryForm.mainProd.split(
          ":"
        )[1];
        this.oldApiSummaryForm.oldMainProd = this.addProdPinData.value;
      }
      if (this.apiSummaryForm.mainDev) {
        this.addDevPinData.value = this.apiSummaryForm.mainDev.split(":")[0];
        this.addDevPinData.realName = this.apiSummaryForm.mainDev.split(":")[1];
        this.oldApiSummaryForm.oldMainDev = this.addDevPinData.value;
      }
      if (this.apiSummaryForm.businessCategoryId === 0) {
        this.apiSummaryForm.businessCategoryId = "";
        this.apiSummaryForm.businessCategoryName = "";
      }
      this.oldApiSummaryForm.oldBusinessCategoryId = this.apiSummaryForm.businessCategoryId;
      this.oldApiSummaryForm.oldCnName = this.apiSummaryForm.cnName;
      this.oldApiSummaryForm.oldStatus = this.apiSummaryForm.status;
      this.oldApiSummaryForm.oldRemark = this.apiSummaryForm.remark;
      this.oldApiSummaryForm.oldMvn = this.apiSummaryForm.mvn;
      this.queryCategoryList(1, 10000);
    },

    queryCategoryList() {
      findBusinessCategoryList([
        {
          pageSize: 10000,
          pageNumb: 1
        }
      ])
        .then(rsp => {
          this.categoryList = rsp.data;
          for (let x of this.categoryList) {
            if (
              Number(this.apiSummaryForm.businessCategoryId === Number(x.id))
            ) {
              this.apiSummaryForm.businessCategoryName = x.name;
            }
          }
          this.loading = false;
          this.copyCategoryList = Object.assign(this.categoryList);
        })
        .catch(e => {
          console.log(e);
          this.loading = false;
        });
    },

    searchProdPin(key) {
      if (key !== "") {
        this.addProdPinData.loading = true;
        setTimeout(() => {
          hrFindUser(key)
            .then(rsp => {
              this.addProdPinData.loading = false;
              this.addProdPinData.zhanghaos = rsp.data;
            })
            .catch(e => {});
        }, 200);
      } else {
        this.addProdPinData.zhanghaos = [];
      }
    },

    searchDevPin(key) {
      if (key !== "") {
        this.addDevPinData.loading = true;
        setTimeout(() => {
          hrFindUser(key)
            .then(rsp => {
              this.addDevPinData.loading = false;
              this.addDevPinData.zhanghaos = rsp.data;
            })
            .catch(e => {});
        }, 200);
      } else {
        this.addDevPinData.zhanghaos = [];
      }
    },

    prodPinSelectChange(value) {
      const params = { erp: value };
      api.apiManager
        .findSupplierUserByErp(params)
        .then(res => {
          if (res.data) {
            //当前erp存在当前团队
            this.popoverVisible = false;
          } else {
            //弹窗提示，当前erp不在当前团队
            this.popoverVisible = true;
          }
        })
        .catch(error => {
          console.log(error);
        });
      this.addProdPinData.realName = "";
      this.addProdPinData.mobile = "";
      this.addProdPinData.email = "";
      this.addProdPinData.zhanghaos.forEach((val, index) => {
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
          this.apiSummaryForm.mainProd = val.userName + ":" + val.realName;
          this.addProdPinData.realName = val.realName;
        }
      });
    },
    devPinSelectChange(value) {
      const params = { erp: value };
      api.apiManager
        .findSupplierUserByErp(params)
        .then(res => {
          if (res.data) {
            //当前erp存在当前团队
            this.popoverDevVisible = false;
          } else {
            //弹窗提示，当前erp不在当前团队
            this.popoverDevVisible = true;
          }
        })
        .catch(error => {
          console.log(error);
        });
      this.addDevPinData.realName = "";
      this.addDevPinData.mobile = "";
      this.addDevPinData.email = "";
      this.addDevPinData.zhanghaos.forEach((val, index) => {
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
          this.apiSummaryForm.mainDev = val.userName + ":" + val.realName;
          this.addDevPinData.realName = val.realName;
        }
      });
    },

  },
  created() {
    this.fetchApiSummary();
  }
};
</script>

<style lang="scss" scoped>
::v-deep .mod-overview {
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
}

.ptb5 {
  padding: 5px 0;
}

.overview-apiSummaryForm {
  width: 50%;
}

.j-v-center {
  display: flex;
  align-items: center;
}

.inputUsers__input__autocomplete--info {
  margin-left: 10px;
}

.inputUsers__input__autocomplete--info span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  line-height: 22px;
}

.inputUsers__input__autocomplete--info span:last-child {
  font-size: 12px;
  color: #8f9399;
  display: inline-block;
}

.el-select-dropdown {
  z-index: 2050 !important;
}

.mvn {
  word-break: normal;
  width: auto;
  display: block;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow: hidden;
}
.remark-content {
  white-space: pre-wrap;
  word-break: break-all
}
</style>
