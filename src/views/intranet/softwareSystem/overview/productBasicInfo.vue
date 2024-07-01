<template>
  <div class="product-basic-info">
    <div v-loading="loading" class="mod-overview">
      <el-form
        :model="prodSummaryForm"
        :rules="rules"
        :disabled="!editable"
        label-width="140px"
        ref="prodSummaryForm"
        element-loading-text="加载中"
        class="overview-prodSummaryForm"
      >
        <el-form-item label="系统名称" prop="name">
          <el-input
            v-if="editable"
            v-model.trim="prodSummaryForm.name"
            placeholder="系统中文名称"
          ></el-input>
          <span v-if="!editable">{{
            prodSummaryForm.name === "" ? "未填写" : prodSummaryForm.name
          }}</span>
        </el-form-item>
        <el-form-item label="系统编码" prop="code">
          <span class="copy-text">{{ prodSummaryForm.code }}</span>
          <a
            v-clipboard:copy="prodSummaryForm.code"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
            ><i class="el-icon-document-copy"
          /></a>
        </el-form-item>
        <el-form-item label="产品分类" prop="classify">
          <el-select
            v-if="editable"
            v-model="prodSummaryForm.classify"
            placeholder="请选择产品分类"
          >
            <el-option
              v-for="type in classifyEnum"
              :key="type.id"
              :label="type.name"
              :value="type.id"
            ></el-option>
          </el-select>
          <template v-if="!editable">
            <span v-if="prodSummaryForm.classify === 'oms'">订单</span>
            <span v-else-if="prodSummaryForm.classify === 'wms'">仓储</span>
            <span v-else-if="prodSummaryForm.classify === 'tms'">配运</span>
            <span v-else-if="prodSummaryForm.classify === 'data_algorithm'"
              >数据算法</span
            >
            <span v-else-if="prodSummaryForm.classify === 'tech'"
              >基础技术</span
            >
            <span v-else>未填写</span>
          </template>
        </el-form-item>
        <el-form-item label="发布范围" prop="scope">
          <!--        <el-select v-if="editable" v-model="prodSummaryForm.scope" placeholder="请选择发布范围">-->
          <!--          <el-option v-for="type in scopeEnum" :key="type.id" :label="type.name" :value="type.id"></el-option>-->
          <!--        </el-select>-->
          <span v-if="prodSummaryForm.scope === 1">外网</span>
          <span v-else-if="prodSummaryForm.scope === 2">内网</span>
        </el-form-item>

        <el-form-item label="产品负责人" prop="productOwner">
          <el-select
            v-if="editable"
            style="width: 100%"
            v-model="addProdPinData.value"
            filterable
            remote
            reserve-keyword
            :placeholder="this.mainProdPlaceHolder"
            :remote-method="searchProdPin"
            v-on:change="prodPinSelectChange"
            :loading="addProdPinData.loading"
            popper-class="erp-info-select"
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
                        ') 0% 0% / 30px 30px no-repeat scroll content-box border-box transparent',
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
          <span v-if="!editable">{{
            addProdPinData.value === "" ? "未填写" : addProdPinData.value
          }}</span>
        </el-form-item>
        <el-form-item label="研发负责人" prop="developOwner">
          <el-select
            v-if="editable"
            style="width: 100%"
            v-model="addDevPinData.value"
            filterable
            remote
            reserve-keyword
            :placeholder="this.mainDevPlaceHolder"
            :remote-method="searchDevPin"
            v-on:change="devPinSelectChange"
            :loading="addDevPinData.loading"
            popper-class="erp-info-select"
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
                        ') 0% 0% / 30px 30px no-repeat scroll content-box border-box transparent',
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
          <span v-if="!editable">{{
            addDevPinData.value === "" ? "未填写" : addDevPinData.value
          }}</span>
        </el-form-item>
        <el-form-item label="系统描述" prop="description">
          <el-input
            v-if="editable"
            type="textarea"
            v-model.trim="prodSummaryForm.description"
            :placeholder="this.descriptionPlaceHolder"
          ></el-input>
          <span v-if="!editable">{{
            prodSummaryForm.description === ""
              ? "未填写"
              : prodSummaryForm.description
          }}</span>
        </el-form-item>
        <!-- 测试环境域名显示 -->
        <template
          v-if="env === 'local' || env === 'devtest' || env === 'publictest'"
        >
          <el-form-item label="测试环境域名" prop="domainName">
            <template v-if="editable">
              <!-- 没有环境域名可以填写一次，有则不可填写 -->
              <el-input
                v-if="domainNameEditable"
                v-model.trim="prodSummaryForm.domainName"
              ></el-input>
              <span v-else>
                <span class="copy-text">{{ prodSummaryForm.domainName }}</span>
                <a
                  v-clipboard:copy="prodSummaryForm.domainName"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                  ><i class="el-icon-document-copy"
                /></a>
              </span>
            </template>
            <span v-else>
              <span class="copy-text">{{
                !prodSummaryForm.domainName
                  ? "未填写"
                  : prodSummaryForm.domainName
              }}</span>
              <a
                v-clipboard:copy="prodSummaryForm.domainName"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
                ><i class="el-icon-document-copy"
              /></a>
            </span>
          </el-form-item>
        </template>
        <!-- 预发、生产环境域名显示 -->
        <template v-else-if="env === 'uat' || env === 'prod'">
          <el-form-item label="预发环境域名" prop="uatDomainName">
            <template v-if="editable">
              <!-- 没有环境域名可以填写一次，有则不可填写 -->
              <el-input
                v-if="uatDomainNameEditable"
                v-model.trim="prodSummaryForm.uatDomainName"
              ></el-input>
              <span v-else>
                <span class="copy-text">{{
                  prodSummaryForm.uatDomainName
                }}</span>
                <a
                  v-clipboard:copy="prodSummaryForm.uatDomainName"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                  ><i class="el-icon-document-copy"
                /></a>
              </span>
            </template>
            <span v-else>
              <span class="copy-text">{{
                !prodSummaryForm.uatDomainName
                  ? "未填写"
                  : prodSummaryForm.uatDomainName
              }}</span>
              <a
                v-clipboard:copy="prodSummaryForm.uatDomainName"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
                ><i class="el-icon-document-copy"
              /></a>
            </span>
          </el-form-item>
          <el-form-item label="生产环境域名" prop="domainName">
            <template v-if="editable">
              <!-- 没有环境域名可以填写一次，有则不可填写 -->
              <el-input
                v-if="domainNameEditable"
                v-model.trim="prodSummaryForm.domainName"
              ></el-input>
              <span v-else>
                <span class="copy-text">{{ prodSummaryForm.domainName }}</span>
                <a
                  v-clipboard:copy="prodSummaryForm.domainName"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                  ><i class="el-icon-document-copy"
                /></a>
              </span>
            </template>
            <span v-else>
              <span class="copy-text">{{
                !prodSummaryForm.domainName
                  ? "未填写"
                  : prodSummaryForm.domainName
              }}</span>
              <a
                v-clipboard:copy="prodSummaryForm.domainName"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
                ><i class="el-icon-document-copy"
              /></a>
            </span>
          </el-form-item>
        </template>
        <el-form-item label="是否支持二次开发" prop="secondaryDevelopment">
          <el-radio-group
            v-if="editable"
            v-model="prodSummaryForm.secondaryDevelopment"
          >
            <el-radio label="1">支持</el-radio>
            <el-radio label="0">不支持</el-radio>
          </el-radio-group>
          <span v-if="!editable">{{ computeSecondaryDevelopmentText }}</span>
        </el-form-item>
      </el-form>

      <StickyWrapper>
        <el-button
          v-if="!editable"
          type="primary"
          @click="editForm('prodSummaryForm')"
          >编辑</el-button
        >
        <div v-else class="button-wrapper">
          <el-button @click="resetForm('prodSummaryForm')">取消</el-button>
          <el-button type="primary" @click="submitForm('prodSummaryForm')"
            >保存</el-button
          >
        </div>
      </StickyWrapper>
    </div>
  </div>
</template>

<script>
import StickyWrapper from "@/components/StickyWrapper.vue";
import request from "@/utils/request";
import { hrFindUser } from "@/api/user";

export default {
  name: "ProductBasicInfo",
  components: { StickyWrapper },
  props: {
    editable: {
      type: Boolean,
      required: true,
    },
    secondaryDevelopment: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      env: window.env.buildEnv,
      loading: true,
      uatDomainNameEditable: false,
      domainNameEditable: false,
      addProdPinData: {
        zhanghaos: [],
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
        zhanghaos: [],
        loading: false,
        value: "",
        realName: "",
        mobile: "",
        email: "",
        realNameEdit: true,
        mobileEdit: true,
        emailEdit: true,
      },

      oldProdSummaryForm: {
        id: "",
        oldName: "",
        code: "",
        oldScope: "",
        oldDescription: "",
        oldDevelopOwner: "",
        oldProductOwner: "",
        classify: "",
      },

      prodSummaryForm: {
        id: "",
        name: "",
        scope: "",
        code: "",
        status: "",
        description: "",
        developOwner: "",
        productOwner: "",
        classify: "",
      },

      scopeEnum: [
        {
          id: 1,
          name: "外网",
        },
        {
          id: 2,
          name: "内网",
        },
      ],
      classifyEnum: [
        {
          id: "oms",
          name: "订单",
        },
        {
          id: "wms",
          name: "仓储",
        },
        {
          id: "tms",
          name: "配运",
        },
        {
          id: "data_algorithm",
          name: "数据算法",
        },
        {
          id: "tech",
          name: "基础技术",
        },
      ],

      rules: {
        productOwner: [
          {
            required: true,
            message: "请输入产品负责人京东账号",
            trigger: ["blur", "change"],
          },
        ],
        developOwner: [
          {
            required: true,
            message: "请输入研发负责人京东账号",
            trigger: ["blur", "change"],
          },
        ],
        name: [
          {
            required: true,
            message: "请输入系统名称",
            trigger: ["blur", "change"],
          },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: ["blur", "change"],
          },
        ],
        classify: [
          {
            required: true,
            message: "请选择产品分类",
            trigger: ["blur", "change"],
          },
        ],
        prodPin: [
          { required: true, message: "请输入产品负责人", trigger: "blur" },
        ],
        devPin: [
          { required: true, message: "请输入研发负责人", trigger: "blur" },
        ],
        description: [
          {
            required: true,
            message: "请输入系统描述",
            trigger: ["blur", "change"],
          },
          {
            min: 2,
            max: 255,
            message: "长度在 2 到 255 个字符",
            trigger: ["blur", "change"],
          },
        ],
        uatDomainName: [
          { required: true, message: "请输入环境域名" },
          {
            pattern: /^[\w-]+(\.[\w-]+)+([\w.-]*[\w-])?$/,
            message:
              "只允许输入英文字母、数字、“-”和“.”，且“-”和“.”不能出现在开头或者结尾",
            trigger: "blur",
          },
          {
            min: 3,
            max: 45,
            message: "长度在 3 到 45 个字符",
          },
        ],
        domainName: [
          { required: true, message: "请输入环境域名" },
          {
            pattern: /^[\w-]+(\.[\w-]+)+([\w.-]*[\w-])?$/,
            message:
              "只允许输入英文字母、数字、“-”和“.”，且“-”和“.”不能出现在开头或者结尾",
            trigger: "blur",
          },
          {
            min: 3,
            max: 45,
            message: "长度在 3 到 45 个字符",
          },
        ],
        secondaryDevelopment: [
          {
            required: true,
            message: "请选择是否支持二次开发",
          },
        ],
      },
    };
  },
  computed: {
    mainProdPlaceHolder() {
      return "请输入产品负责人京东账号";
    },
    mainDevPlaceHolder() {
      return "请输入研发负责人京东账号";
    },
    descriptionPlaceHolder() {
      return "描述系统功能,2-255个字符";
    },
    computeSecondaryDevelopmentText() {
      const { secondaryDevelopment } = this.prodSummaryForm;
      if (secondaryDevelopment) {
        const hashMap = { 0: "不支持", 1: "支持" };
        return hashMap[secondaryDevelopment];
      } else {
        return "未选择";
      }
    },
  },
  watch: {
    "prodSummaryForm.domainName": {
      handler(newValue) {
        // 非预发、生产环境补全域名字段信息
        if (this.env !== "uat" && this.env !== "prod") {
          this.prodSummaryForm.uatDomainName = newValue;
        }
      },
    },
  },
  methods: {
    //--抽取产品信息
    fetchProdSummary() {
      let url = "/product";
      request({
        url: url,
        method: "get",
        params: { id: this.$route.params.id },
      })
        .then((rsp) => {
          this.$emit(
            "update:secondaryDevelopment",
            rsp.data.secondaryDevelopment || ""
          );
          this.prodSummaryForm = rsp.data;
          // 若环境域名存在则不可对其进行编辑
          const { uatDomainName, domainName } = rsp.data;
          this.uatDomainNameEditable = uatDomainName ? false : true;
          this.domainNameEditable = domainName ? false : true;

          this.$emit("updateTitle", this.prodSummaryForm);
          delete this.prodSummaryForm.createTime;
          delete this.prodSummaryForm.updateTime;
          delete this.prodSummaryForm.ts;

          this.oldProdSummaryForm.oldName = this.prodSummaryForm.name;
          this.oldProdSummaryForm.oldScope = this.prodSummaryForm.scope;
          this.oldProdSummaryForm.oldStatus = this.prodSummaryForm.status;
          this.oldProdSummaryForm.code = this.prodSummaryForm.code;
          this.oldProdSummaryForm.oldDescription =
            this.prodSummaryForm.description;
          this.oldProdSummaryForm.classify = this.prodSummaryForm.classify;
          this.oldProdSummaryForm.uatDomainName =
            this.prodSummaryForm.uatDomainName;
          this.oldProdSummaryForm.domainName = this.prodSummaryForm.domainName;
          this.oldProdSummaryForm.secondaryDevelopment =
            this.prodSummaryForm.secondaryDevelopment || "";

          if (this.prodSummaryForm.productOwner) {
            this.addProdPinData.value =
              this.prodSummaryForm.productOwner.split(":")[0];
            this.addProdPinData.realName =
              this.prodSummaryForm.productOwner.split(":")[1];
            this.oldProdSummaryForm.oldProductOwner = this.addProdPinData.value;
          }
          if (this.prodSummaryForm.developOwner) {
            this.addDevPinData.value =
              this.prodSummaryForm.developOwner.split(":")[0];
            this.addDevPinData.realName =
              this.prodSummaryForm.developOwner.split(":")[1];
            this.oldProdSummaryForm.oldDevelopOwner = this.addDevPinData.value;
          }
          this.loading = false;
        })
        .catch((e) => {
          this.loading = false;
          console.log(e);
        });
    },

    //--提交修改信息
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const { prodSummaryForm } = this;
          const params = JSON.parse(JSON.stringify(prodSummaryForm));
          const { uatDomainNameEditable, domainNameEditable } = this;
          // 若环境域名处于非编辑态则不更新
          (!uatDomainNameEditable || !domainNameEditable) &&
            delete params.uatDomainName &&
            delete params.domainName;

          request({
            url: "/product/edit",
            method: "post",
            params,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          })
            .then((rsp) => {
              this.$message.success("软件系统信息修改成功");
              this.$emit("update:editable", false);
              this.fetchProdSummary();
            })
            .catch((e) => {
              this.$message.error("产品信息修改失败" + e);
              console.log(e);
            });
        } else {
          return false;
        }
      });
    },

    //--编辑动作
    editForm(formName) {
      this.$emit("update:editable", true);
    },

    //--重置动作
    resetForm(formName) {
      //--编辑态状态置换
      this.$emit("update:editable", false);
      //--清除校验
      this.$refs[formName].clearValidate();
      this.prodSummaryForm.name = this.oldProdSummaryForm.oldName;
      this.prodSummaryForm.scope = this.oldProdSummaryForm.oldScope;
      this.prodSummaryForm.description = this.oldProdSummaryForm.oldDescription;
      this.prodSummaryForm.classify = this.oldProdSummaryForm.classify;
      this.prodSummaryForm.uatDomainName =
        this.oldProdSummaryForm.uatDomainName;
      this.prodSummaryForm.domainName = this.oldProdSummaryForm.domainName;
      this.prodSummaryForm.secondaryDevelopment =
        this.oldProdSummaryForm.secondaryDevelopment || "";

      if (this.oldProdSummaryForm.oldProductOwner !== "") {
        this.prodSummaryForm.productOwner =
          this.oldProdSummaryForm.oldProductOwner +
          ":" +
          this.addProdPinData.realName;
      } else {
        this.prodSummaryForm.productOwner = "";
      }
      if (this.oldProdSummaryForm.oldDevelopOwner !== "") {
        this.prodSummaryForm.developOwner =
          this.oldProdSummaryForm.oldDevelopOwner +
          ":" +
          this.addDevPinData.realName;
      } else {
        this.prodSummaryForm.developOwner = "";
      }
      this.addProdPinData.value = this.oldProdSummaryForm.oldProductOwner;
      this.addDevPinData.value = this.oldProdSummaryForm.oldDevelopOwner;
    },

    //--搜索开发负责人
    searchProdPin(key) {
      if (key !== "") {
        this.addProdPinData.loading = true;
        setTimeout(() => {
          hrFindUser(key)
            .then((rsp) => {
              this.addProdPinData.loading = false;
              this.addProdPinData.zhanghaos = rsp.data;
            })
            .catch((e) => {});
        }, 200);
      } else {
        this.addProdPinData.zhanghaos = [];
      }
    },

    //--搜索pin码信息
    searchDevPin(key) {
      if (key !== "") {
        this.addDevPinData.loading = true;
        setTimeout(() => {
          hrFindUser(key)
            .then((rsp) => {
              this.addDevPinData.loading = false;
              this.addDevPinData.zhanghaos = rsp.data;
            })
            .catch((e) => {});
        }, 200);
      } else {
        this.addDevPinData.zhanghaos = [];
      }
    },

    //--产品负责人变化
    prodPinSelectChange(value) {
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
          this.prodSummaryForm.productOwner = val.userName + ":" + val.realName;
          this.addProdPinData.realName = val.realName;
        }
      });
    },

    //--开发负责人变化
    devPinSelectChange(value) {
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
          this.prodSummaryForm.developOwner = val.userName + ":" + val.realName;
          this.addDevPinData.realName = val.realName;
        }
      });
    },
    onCopy(e) {
      this.$message.success("复制成功");
    },
    onError(e) {
      this.$message.error("复制失败");
    },
  },
  created() {
    this.fetchProdSummary();
  },
};
</script>

<style lang="scss" scoped>
.product-basic-info {
  padding: 16px 0;
}

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
.overview-prodSummaryForm {
  width: 50%;
  .copy-text {
    margin-right: 4px;
  }
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
</style>
