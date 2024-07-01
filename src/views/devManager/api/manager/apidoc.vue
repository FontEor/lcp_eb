<template>
  <div>
    <div class="app-doc">
      <el-tabs
        :tab-position="tabPosition"
        v-model="activeName"
        class="my-tabs2"
        :before-leave="beforeLeave"
        @tab-click="this.onMethodChangeClick"
      >
        <!--文档左边栏-->
        <el-tab-pane
          v-for="item in methodListData"
          :key="item.id"
          :label="item.name"
          :name="item.name"
        >
          <div slot="label">
            <el-tooltip :disabled="true" effect="dark" placement="top">
              <p class="my-doc-title">{{ item.cnName }}</p>
            </el-tooltip>
            <p class="my-doc-title">{{ item.name }}</p>
          </div>
        </el-tab-pane>
        <div class="relative" v-if="showContent">
          <!--文档按钮-->
          <div class="opr-row">
            <el-button v-if="!editer.status" @click="cancleData"
              >取 消</el-button
            >
            <el-button v-if="!editer.status" type="primary" @click="saveData"
              >保 存</el-button
            >
            <el-button v-if="editer.status" type="primary" @click="editorData"
              >编 辑</el-button
            >
          </div>
          <!--文档头部-->
          <h3 class="document-title">
            <el-form
              :model="documentTitleForm"
              ref="documentTitleFormRef"
              :rules="documentTitleFormRules"
            >
              <p class="mb0">
                <span v-if="!editer.status">
                  <!-- 这里的label=" "是为了显示表单项必填红色* -->
                  <span style="display: inline-block; margin-right: 8px">{{
                    methodObj.name
                  }}</span>
                  <el-form-item
                    prop="cnName"
                    label=" "
                    style="width: 50%; color: #333333; display: inline-block"
                  >
                    <el-input
                      v-model.trim="documentTitleForm.cnName"
                      minlength="3"
                      maxlength="20"
                      show-word-limit
                      class="input-title"
                      placeholder="接口名称"
                    ></el-input>
                  </el-form-item>
                </span>
                <span v-if="editer.status">{{ methodObj.name }}</span>
                <span v-if="editer.status"
                  >({{ documentTitleForm.cnName }})</span
                >
              </p>
              <p class="txtP">
                <el-form-item prop="remark" label=" " v-if="!editer.status">
                  <el-input
                    type="textarea"
                    v-model="documentTitleForm.remark"
                    maxlength="255"
                    resize="none"
                    :rows="4"
                    show-word-limit
                    placeholder="接口描述"
                    style="width: 98%"
                  ></el-input>
                </el-form-item>
                <span v-if="editer.status">{{ documentTitleForm.remark }}</span>
              </p>
            </el-form>
          </h3>
          <!--请求参数-->
          <h4 class="document-sub-title">请求参数</h4>
          <lcptables
            :tableData="
              methodObj.inParams == null ? new Array() : methodObj.inParams
            "
            :tableColumnInfo="columnsInParams"
            :editer="editer.status"
          >
          </lcptables>
          <!--返回参数-->
          <h4 class="document-sub-title">响应参数</h4>
          <lcptables
            :tableData="
              methodObj.outParams == null ? new Array() : methodObj.outParams
            "
            :tableColumnInfo="columnsOutParams"
            :editer="editer.status"
          >
          </lcptables>
          <!--错误码-->
          <h4 class="document-sub-title">错误码</h4>
          <el-form
            :model="errorCodeForm"
            ref="errorCodeFormRef"
            :rules="errorCodeFormRules"
          >
            <lcptables
              :tableData="errorCodeForm.tableData"
              :tableColumnInfo="columnsErrorCode"
              :editer="editer.status"
              :showOperation="true"
            >
              <template v-slot:customColumn>
                <el-table-column
                  prop="errorCode"
                  label="错误码"
                  min-width="35%"
                  :show-tooltip-when-overflow="editer.status"
                  style="margin: 0px; padding: 0px"
                >
                  <template slot-scope="scope">
                    <span v-if="editer.status">{{ scope.row.errorCode }}</span>
                    <el-form-item
                      v-else
                      :prop="'tableData.' + scope.$index + '.errorCode'"
                      :rules="errorCodeFormRules.errorCode"
                    >
                      <el-input
                        maxlength="200"
                        v-model.trim="scope.row.errorCode"
                        v-if="!editer.status"
                        placeholder="错误码"
                      ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="errorMsg"
                  label="错误消息"
                  min-width="60%"
                  :show-tooltip-when-overflow="editer.status"
                  style="margin: 0px; padding: 0px"
                >
                  <template slot-scope="scope">
                    <span v-if="editer.status">{{ scope.row.errorMsg }}</span>
                    <el-form-item
                      v-else
                      :prop="'tableData.' + scope.$index + '.errorMsg'"
                      :rules="errorCodeFormRules.errorMsg"
                    >
                      <el-input
                        maxlength="255"
                        type="text"
                        v-model.trim="scope.row.errorMsg"
                        v-if="!editer.status"
                        placeholder="错误消息，长度在 2 到 255 个字符"
                      ></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column min-width="6%" v-if="!editer.status">
                  <template slot-scope="scope">
                    <el-form-item>
                      <a
                        class="link2"
                        href="javascript:;"
                        @click="
                          deleteRow(scope.$index, errorCodeForm.tableData)
                        "
                        ><i class="el-icon-delete"></i
                      ></a>
                    </el-form-item>
                  </template>
                </el-table-column>
              </template>
            </lcptables>
          </el-form>
          <el-row v-if="!editer.status" class="add-row"
            ><a href="javascript:;" @click="insertRow()"
              ><i class="el-icon-plus"></i>
              <span style="color: #3c6ef0">添加</span></a
            ></el-row
          >
          <h4 class="document-sub-title" style="margin-top: 40px">API工具</h4>
          <div v-if="thisEnv === 'uat' || thisEnv === 'prod'">
            <div v-if="apiOwner">
              <el-button type="primary" @click="gotoApiTest">API测试</el-button>
              <span class="apiTest-online-alert"
                >该工具当前处理的是线上接口，请谨慎操作!</span
              >
            </div>
            <div v-else>
              <el-button type="primary" disabled>API测试</el-button>
              <el-alert
                style="margin-bottom: 20px; margin-top: 20px"
                title="生产环境或预发环境仅JSF接口负责人可用, 请移步测试环境（测试环境地址：http://test-lcp.jdl.com）"
                type="info"
                :closable="false"
              />
            </div>
          </div>
          <div v-else>
            <el-button type="primary" @click="gotoApiTest">API测试</el-button>
          </div>
        </div>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import lcptables from "./components/lcptables";
import request from "@/utils/request";
import gwApiRequest from "@/utils/gwApiRequest.js";

export default {
  name: "apiDoc",
  components: {
    lcptables,
  },
  data() {
    return {
      thisEnv: window.env.baseEnv,
      apiOwner: false,
      showContent: false, //显示内容
      methodListData: [], //方法列表数据
      editer: {
        status: true, //编辑状态,true:不是编辑状态，false:是编辑状态
      },
      methodObj: "", //方法对象
      oldMethodObj: "", //老的方法对象
      tabPosition: "left",
      activeName: "", //激活表单名称
      errorCodeForm: {
        //错误的form对象
        tableData: [],
        oldTableData: [],
      },
      errorCodeFormRules: {
        //错误的form提示
        errorCode: [
          { required: true, message: "请输入错误码", trigger: "blur" },
          {
            min: 1,
            max: 200,
            message: "长度在 1 到 200 个字符",
            trigger: "blur",
          },
        ],
        errorMsg: [
          { required: true, message: "请输入错误消息", trigger: "blur" },
          {
            min: 2,
            max: 255,
            message: "长度在 2 到 255 个字符",
            trigger: "blur",
          },
        ],
      },
      documentTitleForm: {
        //标题form字段
        cnName: "",
        remark: "",
      },
      documentTitleFormRules: {
        //标题错误form提示
        cnName: [
          { required: true, message: "接口名称不能为空", trigger: "blur" },
          {
            min: 2,
            max: 255,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
        remark: [
          { required: true, message: "接口描述不能为空", trigger: "blur" },
          {
            min: 2,
            max: 255,
            message: "长度在 2 到 255 个字符",
            trigger: "blur",
          },
        ],
      },
      columnsErrorCode: [
        //错误列
        {
          prop: "errorCode",
          label: "错误码",
          modify: true,
          min_width: "35%",
        },
        {
          prop: "errorMsg",
          label: "错误消息",
          modify: true,
          min_width: "60%",
        },
      ],
      columnsInParams: [
        //参数列
        {
          prop: "name",
          label: "名称",
          min_width: "30%",
        },
        {
          prop: "oldtype",
          label: "类型",
          min_width: "30%",
        },
        {
          prop: "required",
          label: "是否必填",
          min_width: "21%",
          modify: true,
          type: "select",
        },
        {
          prop: "exampleValue",
          label: "示例",
          min_width: "20%",
          modify: true,
          type: "input",
        },
        {
          prop: "remark",
          label: "描述",
          min_width: "25%",
          modify: true,
          type: "textarea",
        },
      ],
      columnsOutParams: [
        //参数列
        {
          prop: "name",
          label: "名称",
          min_width: "30%",
        },
        {
          prop: "oldtype",
          label: "类型",
          min_width: "30%",
        },
        {
          prop: "exampleValue",
          label: "示例",
          min_width: "20%",
          modify: true,
          type: "input",
        },
        {
          prop: "remark",
          label: "描述",
          min_width: "25%",
          modify: true,
          type: "textarea",
        },
      ],
    };
  },
  methods: {
    async findApiBaseInfo() {
      const url = "/ApiManagerService/findApiBaseInfo";
      const { id } = this.$route.params;
      const data = [{ id }];
      return await gwApiRequest.post(url, JSON.stringify(data));
    },

    checkInterfaceBelong2User(interfaceName) {
      gwApiRequest({
        url: "/ApiManagerService/checkInterface2User",
        method: "post",
        data: JSON.stringify([
          {
            qualifiedName: interfaceName,
          },
        ]),
      }).then((response) => {
        this.apiOwner = response.data === true;
      });
    },
    gotoApiTest() {
      if (this.editer.status) {
        window.open(
          window.location.origin +
            "#/apiTestMainPage?qualifiedName=" +
            this.methodObj.qualifiedName +
            "&methodName=" +
            this.methodObj.name +
            "&methodId=" +
            this.methodObj.id +
            "&from=manager",
          "_blank"
        );
      } else {
        this.$message.info("请先保存数据,才能进行测试!");
      }
    },

    /**
     * 删除行
     */
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    /**
     * 插入行
     */
    insertRow() {
      this.errorCodeForm.tableData.push({
        errorCode: "",
        errorMsg: "",
        objId: this.methodObj.id,
      });
    },
    /**
     * 编辑数据
     */
    editorData() {
      this.editer.status = false;
    },
    /**
     * 保存数据
     */
    saveData() {
      this.methodObj.errorCodeList = JSON.parse(
        JSON.stringify(this.errorCodeForm.tableData)
      );
      this.methodObj.cnName = this.documentTitleForm.cnName;
      this.methodObj.remark = this.documentTitleForm.remark;
      this.$refs["documentTitleFormRef"].validate((valid) => {
        if (valid) {
          this.$refs["errorCodeFormRef"].validate((valid) => {
            if (valid) {
              gwApiRequest({
                url: "/ApiManagerService/updateApiDoc",
                method: "post",
                data: JSON.stringify([{ ...this.methodObj, type: 1 }]),
              })
                .then((rsp) => {
                  this.editer.status = true;
                  if (rsp.data) {
                    let _this = this;
                    this.methodListData.forEach(function (item, index) {
                      if (item.name == _this.activeName) {
                        item.cnName = _this.methodObj.cnName;
                        return;
                      }
                    });
                    this.methodObj = rsp.data;
                    this.setTypeValueDeep(this.methodObj.inParams);
                    this.setTypeValueDeep(this.methodObj.outParams);
                    this.oldMethodObj = this.copyDeep(this.methodObj);
                    this.errorCodeForm.oldTableData = this.copyDeep(
                      this.errorCodeForm.tableData
                    );
                    this.initErrorCodeData();
                  } else {
                    console.error("获取方法数据为空");
                  }
                })
                .catch((e) => {
                  console.log(e);
                });
            } else {
              console.log("error submit!!");
              return false;
            }
          });
        } else {
          const cnName = this.documentTitleForm.cnName;
          const remark = this.documentTitleForm.remark;
          if (
            (typeof cnName === "undefined" ||
              cnName === null ||
              cnName.toString().trim() === "") &&
            (typeof remark === "undefined" ||
              remark === null ||
              remark.toString().trim() === "")
          ) {
            this.$message.error("【接口名称】、【接口描述】均不能为空");
            return;
          }
          if (
            typeof cnName === "undefined" ||
            cnName === null ||
            cnName.toString().trim() === ""
          ) {
            this.$message.error("【接口名称】不能为空");
            return;
          }
          if (
            typeof remark === "undefined" ||
            remark === null ||
            remark.toString().trim() === ""
          ) {
            this.$message.error("【接口描述】不能为空");
            return;
          }
        }
      });
    },
    /**
     * 取消
     */
    cancleData() {
      this.methodObj = this.oldMethodObj;
      this.errorCodeForm.tableData = this.errorCodeForm.oldTableData;
      this.oldMethodObj = this.copyDeep(this.methodObj);
      this.errorCodeForm.oldTableData = this.copyDeep(
        this.errorCodeForm.tableData
      );
      this.documentTitleForm.cnName = this.methodObj.cnName;
      this.documentTitleForm.remark = this.methodObj.remark;
      this.$refs["documentTitleFormRef"].clearValidate();
      this.$refs["errorCodeFormRef"].clearValidate();
      this.editer.status = true;
    },
    /**
     * 点击tab事件
     */
    onMethodChangeClick(object, event) {
      if (this.editer.status) {
        this.initMethodData(object.$vnode.key);
      }
    },
    /**
     * 切换标签之前
     */
    beforeLeave() {
      if (!this.editer.status) {
        this.$message.error("保存完文档数据才能切换!");
        return false;
      }
    },
    /**
     * 初始化方法数据
     */
    initMethodData(methodId) {
      gwApiRequest({
        url: "/ApiManagerService/findApiDoc",
        method: "post",
        data: JSON.stringify([{ methodId: methodId }]),
      })
        .then((rsp) => {
          this.oldMethodObj = "";
          if (rsp.data) {
            this.showContent = true;
            this.methodObj = rsp.data;
            if (this.methodObj.inParams) {
              this.setSelectVal(this.methodObj.inParams);
            }
            if (this.methodObj.outParams) {
              this.setSelectVal(this.methodObj.outParams);
            }
            this.oldMethodObj = this.copyDeep(this.methodObj);
            this.documentTitleForm.cnName = this.methodObj.cnName;
            this.documentTitleForm.remark = this.methodObj.remark;
            this.initErrorCodeData();
            if (this.thisEnv === "prod" || this.thisEnv === "uat") {
              this.checkInterfaceBelong2User(this.methodObj.qualifiedName);
            }
          } else {
            console.error("获取方法数据为空");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    /**
     * 初始化错误码数据
     */
    initErrorCodeData() {
      this.errorCodeForm.oldTableData = [];
      if (this.methodObj.errorCodeList) {
        this.errorCodeForm.tableData = this.methodObj.errorCodeList;
        this.errorCodeForm.oldTableData = this.copyDeep(
          this.errorCodeForm.tableData
        );
      } else {
        this.errorCodeForm.tableData = [];
      }
    },
    /**
     * 获取方法实例
     */
    async fetchApiInstance() {
      const { data } = await this.findApiBaseInfo().catch(() => {
        throw new Error("fetchApiInstance findApiBaseInfo");
      });
      this.fetchApiMethod(data.qualifiedName);
    },
    /**
     * 获取api方法
     */
    fetchApiMethod(qualifiedName) {
      gwApiRequest({
        url: "/ApiManagerService/queryApiMethodByCondition",
        method: "post",
        data: JSON.stringify([
          {
            qualifiedName: qualifiedName,
          },
        ]),
      })
        .then((rsp) => {
          if (rsp.data) {
            this.methodListData = rsp.data;
            const [first] = this.methodListData;
            this.activeName = first.name;
            this.initMethodData(first.id);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    /**
     * 深度拷贝
     */
    copyDeep(templateData) {
      return JSON.parse(JSON.stringify(templateData));
    },
    /**
     * 设置默认值
     */
    setSelectVal(params) {
      if (params) {
        for (let param in params) {
          let paramObj = params[param];
          if (paramObj.required == "") {
            paramObj.required = "1";
          }
          paramObj.oldtype = this.setTypeValue(paramObj.type);
          if (paramObj.children) {
            this.setSelectVal(paramObj.children);
          }
        }
      }
    },
    setTypeValueDeep(params) {
      if (params) {
        for (let param in params) {
          let paramObj = params[param];
          paramObj.oldtype = this.setTypeValue(paramObj.type);
          if (paramObj.children) {
            this.setSelectVal(paramObj.children);
          }
        }
      }
    },
    setTypeValue(typeVal) {
      if (!typeVal) {
        return "";
      } else {
        if (typeVal == "") {
          return "";
        }
        let aryTypeVal = typeVal.split(".");
        let ret = "";
        for (let i = 0; i < aryTypeVal.length; i++) {
          if (i == aryTypeVal.length - 1) {
            ret = ret + aryTypeVal[i];
            break;
          }
          if (aryTypeVal[i].indexOf("<") != -1) {
            ret =
              ret + aryTypeVal[i].substring(0, aryTypeVal[i].indexOf("<") + 1);
          }
          if (aryTypeVal[i].indexOf(",") != -1) {
            ret =
              ret + aryTypeVal[i].substring(0, aryTypeVal[i].indexOf(",") + 1);
          }
          if (aryTypeVal[i].indexOf(">") != -1) {
            ret = ret + aryTypeVal[i];
          }
        }
        return ret;
      }
    },
  },
  mounted() {
    this.fetchApiInstance();
    console.log("env = " + this.thisEnv);
  },
};
</script>

<style lang="scss">
.my-doc-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.apiTest-online-alert {
  font-size: 12px;
  font-weight: bold;
  color: red;
}

.app-doc {
  padding: 0px !important;
  border-left: 1px solid #eaeaea;
}

.my-tabs2 {
  .el-tabs__header.is-left {
    margin-right: 0;
    width: 250px;
  }

  .el-tabs__nav-wrap.is-left::after {
    width: 0;
  }

  .el-tabs__active-bar.is-left {
    right: auto;
    left: 0;
    width: 4px;
    height: 64px !important;
  }

  .el-tabs__item {
    height: 64px;
    padding: 8px 15px;
    line-height: 24px;
    text-align: left;
    color: #666;

    .doc-title {
      color: #333;
      overflow: hidden; //超出的文本隐藏
      text-overflow: ellipsis; //溢出用省略号显示
      white-space: nowrap; //溢出不换行
    }

    &:hover {
      color: #666;

      .doc-title {
        color: #3c6ef0;
      }
    }
  }

  .el-tabs__item.is-left {
    text-align: left;
  }

  .el-tabs__item.is-active {
    background: rgba(60, 110, 240, 0.1);
    color: #3c6ef0;

    .doc-title {
      color: #3c6ef0;
    }
  }

  .el-tabs__content {
    min-height: 540px;
    padding: 0 20px 20px;
    border-left: 1px solid #eaeaea;
  }
  .el-table__empty-img {
    margin-top: 0px;
    background-size: 0% 0%;
    width: 0px;
    height: 0px;
    background: 0%;
  }
  .el-table__empty-text {
    line-height: 60px;
    width: 50%;
    padding-bottom: 0px;
    color: #999;
  }
}

/*
 * Api-document-edit
 */
.relative {
  position: relative;
}

.opr-row {
  position: absolute;
  top: 0;
  right: 0;
}

.input-title {
  display: inline-block;
  width: auto;

  .el-input__inner {
    width: 360px;
    font-size: 20px;
    color: #333333;
    line-height: 32px;
  }
}

.document-title {
  .txtP {
    font-size: 14px;
    color: #666666;
    line-height: 32px;
  }
}

.add-row {
  a {
    display: block;
    height: 32px;
    padding: 0;
    background: #f5f5f5;
    border: 1px dashed #d9d9d9;
    border-radius: 4px;
    font-size: 14px;
    color: #666;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
  }

  &:hover a {
    color: #3c6ef0;
  }
}

.link2 {
  color: #666;

  &:hover {
    color: #3c6ef0;
  }
}

.document-title {
  margin-bottom: 20px;
  font-size: 20px;
  color: #333333;
  line-height: 30px;
}

.document-sub-title {
  position: relative;
  margin-bottom: 20px;
  padding-left: 12px;
  font-size: 16px;
  color: #333333;
  line-height: 20px;

  &:before {
    position: absolute;
    top: 8px;
    left: 0;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #3c6ef0;
    content: "";
    overflow: hidden;
  }
}

.el-tabs--left .el-tabs__nav.is-left,
.el-tabs--left .el-tabs__nav.is-right,
.el-tabs--right .el-tabs__nav.is-left,
.el-tabs--right .el-tabs__nav.is-right {
  height: 450px;
  overflow-y: scroll;
}

::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 10px;
}

::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
  background: #cccccc;
}

::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ffffff;
}
</style>
