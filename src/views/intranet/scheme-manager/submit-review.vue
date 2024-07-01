<template>
  <div class="app-container">
    <div class="submitReview">
      <div class="header">
        <el-button icon="el-icon-arrow-left" @click="goback">返回</el-button>
        <Steps :active="steps.active" :tiptitle="steps.tiptitleList" />
      </div>

      <div class="main">
        <!-- 检查修改记录 -->

        <div v-if="!isFirstPublishFlag && steps.active === 0">
          <el-row class="filter-container" type="flex" justify="space-between">
            <el-form
              style="height: 32px"
              :inline="true"
              :model="listQuery"
              @submit.native.prevent
              class="search-form"
            >
              <el-form-item label="最后一次修改人">
                <el-select
                  v-model="listQuery.updateUser"
                  clearable
                  style="width: 100%"
                  placeholder="请选择修改人erp"
                >
                  <el-option
                    v-for="item in updateUserList"
                    :key="item.updateUser"
                    :label="item.updateUser"
                    :value="item.updateUser"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="修改时间" prop="timeRange">
                <el-date-picker
                  style="width: 100%"
                  v-model="listQuery.updateTime"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['00:00:00', '23:59:59']"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  @click="search(listQuery.updateUser, listQuery.updateTime)"
                  >查询</el-button
                >
              </el-form-item>
            </el-form>
          </el-row>

          <el-table :data="modifyRecords" v-loading="tableLoading">
            <el-table-column
              label="变更类型"
              prop="type"
              width="140px"
              :formatter="formatType"
            />
            <el-table-column label="接口" prop="metaDataMark" />
            <el-table-column label="配置项" prop="key" />
            <el-table-column label="上次方案发布内容" prop="oldValue">
              <template slot-scope="scope">
                <div v-html="scope.row.oldValue"></div>
              </template>
            </el-table-column>
            <el-table-column label="新内容">
              <template slot-scope="scope">
                <div v-html="scope.row.newValue"></div>
              </template>
            </el-table-column>
            <el-table-column
              label="最后一次修改人"
              prop="updateUser"
              width="140px"
            />
            <el-table-column label="修改时间" prop="updateTime" width="160px" />
          </el-table>
        </div>

        <el-table
          v-else-if="
            (!isFirstPublishFlag && steps.active < 3) ||
            (isFirstPublishFlag && steps.active < 2)
          "
          :data="table.tableData"
          :max-height="computeTableMaxHeight"
          :hide-empty-img="true"
          ref="table"
        >
          <el-table-column
            label="序号"
            type="index"
            align="center"
          ></el-table-column>
          <el-table-column
            v-for="(item, index) in table.columnList"
            :key="index"
            :label="item.label"
            :prop="item.prop"
            :fixed="item.fixed"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-form
                v-if="item.prop === 'tps' || item.prop === 'dailyCall'"
                :model="row"
                :rules="table.ruleTable"
                ref="ruleForm"
              >
                <el-form-item v-if="item.prop === 'tps'" prop="tps">
                  <el-input
                    v-model.number="row.tps"
                    placeholder="请输入预估峰值"
                  ></el-input>
                </el-form-item>
                <el-form-item v-else prop="dailyCall">
                  <el-input
                    v-model.number="row.dailyCall"
                    placeholder="请输入预估总量"
                  ></el-input>
                </el-form-item>
              </el-form>
              <span v-else>{{ formatText(item.prop, row[item.prop]) }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div v-else class="submitSuccess">
          <i class="el-icon-success"></i>
          <p class="title">提交成功</p>
          <div class="mainContain">
            <p class="msgForfix">
              您可以前往京me—流程中心(PC端为<a
                href="http://oa.jd.com/"
                target="_blank"
                >oa.jd.com</a
              >)—我的申请，查看对接方案审批进度。
            </p>
            <p class="msgForfix" style="text-align: center">
              注：审核通过后，需要手动点击【发布】按钮，才会将对接方案更新至前台。
            </p>
          </div>
        </div>
      </div>

      <div class="footer" v-loading="loading">
        <template v-if="isFirstPublishFlag">
          <el-button v-if="steps.active === 1" @click="previousStep"
            >上一步</el-button
          >
          <el-button
            v-if="steps.active === 0"
            type="primary"
            @click="nextStep('ruleForm')"
            >下一步</el-button
          >
          <el-button
            v-else-if="steps.active === 1"
            type="primary"
            :loading="submitReviewButtonLoading"
            @click="onClickSubmitReviewButton"
            >提交审核</el-button
          >
          <el-button
            v-else-if="steps.active === 2"
            type="primary"
            @click="goToOpenBiz"
            >继续管理</el-button
          >
        </template>
        <template v-else>
          <el-button v-if="steps.active === 1" @click="steps.active = 0"
            >上一步</el-button
          >
          <el-button v-if="steps.active === 2" @click="previousStep"
            >上一步</el-button
          >
          <el-button
            v-if="steps.active === 0"
            type="primary"
            @click="steps.active = 1"
            >下一步</el-button
          >
          <el-button
            v-if="steps.active === 1"
            type="primary"
            @click="nextStep('ruleForm')"
            >下一步</el-button
          >
          <el-button
            v-else-if="steps.active === 2"
            type="primary"
            :loading="submitReviewButtonLoading"
            @click="onClickSubmitReviewButton"
            >提交审核</el-button
          >
          <el-button
            v-else-if="steps.active === 3"
            type="primary"
            @click="goToOpenBiz"
            >继续管理</el-button
          >
        </template>
        <div class="el-loading-mask" style="display: none"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Steps from "@/components/steps/index.vue";
import { parseTime } from "@/utils/index.js";
import { Message } from "@lui/lui-ui";
import request from "@/utils/request.js";
import bizunit from "@/api/intranet/lcp/bizunit.js";
export default {
  name: "SubmitReview",
  components: { Steps },
  data() {
    let checkNumber = (rule, value, callback) => {
      if (value <= 0) {
        callback(new Error("数值必须大于0"));
      } else if (value > 100000000) {
        callback(new Error("数值必须小于100000000"));
      } else {
        callback();
      }
    };
    return {
      loading: true,
      unitId: 0,
      status: 0,
      steps: {
        active: 0,
        tiptitleList: [],
      },
      table: {
        tableData: [],
        columnList: [],
        columnList1: [
          { label: "接口", prop: "apiCode" },
          { label: "中文名称", prop: "apiName" },
          { label: "URL", prop: "apiUrl" },
          { label: "每秒调用峰值预估", prop: "tps", fixed: "right" },
          { label: "每日调用总量预估", prop: "dailyCall", fixed: "right" },
        ],
        columnList2: [
          { label: "SDK名称", prop: "name" },
          { label: "语言", prop: "language" },
          { label: "版本", prop: "version" },
          { label: "描述", prop: "remark" },
          { label: "SDK文件", prop: "fileName" },
          { label: "创建时间", prop: "uploadTime" },
        ],
        ruleTable: {
          tps: [
            { required: true, message: "请输入预估峰值" },
            {
              type: "number",
              message: "数值必须为数字类型",
            },
            { validator: checkNumber },
          ],
          dailyCall: [
            { required: true, message: "请输入预估总量" },
            {
              type: "number",
              message: "数值必须为数字类型",
            },
            { validator: checkNumber },
          ],
        },
        formatTable: {
          language: ["", "JAVA", ".NET", "PHP"],
        },
      },
      submitReviewDebounceTimer: null,
      submitReviewButtonLoading: false,
      isFirstPublishFlag: true,
      modifyRecords: [],
      modifyRecordsAll: [],
      updateUserList: [],
      listQuery: {
        updateUser: "",
        updateTime: "",
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近三天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近七天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三十天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      types: {
        BASE: "概要",
        INNER_CALL_OUTER: "内调外接口",
        OUTER_CALL_INNER: "外调内接口",
        MSG: "消息",
      },
      tableLoading: false,
    };
  },
  computed: {
    computeTableMaxHeight() {
      return document.body.offsetHeight - 300;
    },
  },
  methods: {
    formatType(row, column, cellValue, index) {
      return this.types[cellValue];
    },
    formatText(prop, value) {
      if (value) {
        if (prop === "language") {
          return this.table.formatTable.language[value];
        } else if (prop.endsWith("Time")) {
          return parseTime(value, "{y}-{m}-{d} {h}:{i}");
        } else {
          return value;
        }
      } else {
        return "-";
      }
    },
    switchTable(stepDiff, tableData, columnList) {
      this.steps.active = this.steps.active + stepDiff;
      this.table.tableData = tableData;
      this.table.columnList = columnList;
      this.loading = false;
    },
    onClickSubmitReviewButton() {
      clearTimeout(this.submitReviewDebounceTimer);
      this.submitReviewDebounceTimer = setTimeout(() => {
        this.submitReviewButtonLoading = true;
        request({
          url: "/bizunit/publishBizPreUnit",
          method: "get",
          params: { id: this.unitId },
        })
          .then((rsp) => {
            if (rsp.code === 20000) {
              Message.success("操作成功");
              this.steps.active += 1;
            }
            this.submitReviewButtonLoading = false;
          })
          .catch((e) => {
            this.submitReviewButtonLoading = false;
            console.log("onClickSubmitReviewButton 请求错误", e);
          });
      }, 300);
    },
    previousStep() {
      this.postInterfaceListData(-1);
    },
    nextStep(formName) {
      if (this.table.tableData && this.table.tableData.length > 0) {
        let errorNumber = 0;
        this.$refs[formName].forEach((item) => {
          item.validate((valid) => {
            if (!valid) {
              errorNumber += 1;
              console.log(`${errorNumber} errors submit!!`);
              return false;
            }
          });
        });
        if (!errorNumber) {
          this.postSaveCallInfoData();
        }
      } else {
        this.postSdkListData();
      }
    },
    // 查看这个对接方案有哪些sdk
    postSdkListData() {
      request({
        url: "/sdk/getSdkVOList",
        method: "post",
        data: this.unitId,
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((resolve) => {
          // console.log("postSdkListData 请求返回内容", resolve);
          this.switchTable(1, resolve.data, this.table.columnList2);
        })
        .catch((error) => {
          console.log("postSdkListData 请求错误", error);
        });
    },
    // 保存tps和日调用量的接口
    postSaveCallInfoData() {
      let infoList = this.table.tableData.map((item) => {
        let { id, tps, dailyCall } = item;
        return { id, tps, dailyCall };
      });
      const unitId = this.unitId;
      request({
        url: "/bizapinterface/saveCallInfo",
        method: "post",
        data: { infoList, unitId },
      })
        .then((resolve) => {
          // console.log("postSaveCallInfoData 请求返回内容", resolve);
          this.postSdkListData();
        })
        .catch((error) => {
          console.log("postSaveCallInfoData 请求错误", error);
        });
    },
    postInterfaceListData(stepDiff = 0) {
      this.loading = true;
      request({
        url: "/bizapinterface/queryInterfaceList",
        method: "get",
        params: {
          pageSize: 9999,
          pageNumb: 1,
          orderBy: "update_time",
          orderType: "desc",
          unitId: this.unitId,
        },
      })
        .then((resolve) => {
          this.switchTable(stepDiff, resolve.data.list, this.table.columnList1);
        })
        .catch((error) => {
          console.log("postInterfaceListData 请求错误", error);
        });
    },
    goToOpenBiz() {
      this.$router.push({
        name: "OpenBizOpenBizDetail",
        params: { id: this.unitId },
      });
    },
    goback() {
      this.$router.back();
    },

    // 判断是否已发布过对接方案
    async isFirstPublish() {
      try {
        const { data } = await bizunit.isFirstPublish(this.unitId);
        this.isFirstPublishFlag = data;
        if (this.isFirstPublishFlag) {
          this.steps.tiptitleList = ["确认接口信息", "确认SDK信息", "完成"];
        } else {
          this.steps.tiptitleList = [
            "检查修改记录",
            "确认接口信息",
            "确认SDK信息",
            "完成",
          ];
          await this.getModifyRecords();
        }
      } catch (error) {
        throw new Error("isFirstPublish: " + error);
      }
    },

    // 获取对接方案修改记录
    async getModifyRecords() {
      try {
        this.tableLoading = true;
        const { data } = await bizunit.getModifyRecords(this.unitId);
        if (this.updateUserList.length === 0) {
          const updateUserSet = new Set();
          this.updateUserList = data.reduce((cur, next) => {
            if (!updateUserSet.has(next.updateUser)) {
              updateUserSet.add(next.updateUser);
              cur.push(next);
            }
            return cur;
          }, []);
        }
        this.modifyRecords = data;
        this.modifyRecordsAll = data;

        this.tableLoading = false;
      } catch (error) {
        this.tableLoading = false;
        throw new Error("getModifyRecords: " + error);
      }
    },

    search(user, time) {
      this.modifyRecords =
        user || time
          ? this.modifyRecordsAll.filter((item) => {
              const date = new Date(item.updateTime);
              const uTime = date.getTime();
              return (
                (!user || user === item.updateUser) &&
                (!time || (uTime >= time[0] && uTime <= time[1]))
              );
            })
          : this.modifyRecordsAll;
    },
  },
  created() {
    this.loading = true;
    this.unitId = this.$route.params.id;
    this.status = this.$route.query.status;
    const url = "/bizunit/canPublish";
    const method = "get";
    let params = { id: this.unitId };
    this.isFirstPublish();
    request({
      url,
      method,
      params,
    })
      .then((response) => {
        if (response.code === 20000) {
          this.postInterfaceListData();
        }
      })
      .catch((error) => {});
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  .submitReview {
    ::v-deep .el-form-item {
      margin-top: 22px;
    }

    ::v-deep .search-form .el-form-item {
      margin-top: 0;
    }

    .submitSuccess {
      display: flex;
      align-items: center;
      flex-direction: column;
      .title {
        font-size: large;
        font-weight: bold;
      }
      .mainContain {
        font-size: 1rem;
        .msgForfix {
          padding-top: 1rem;
        }
      }
      ::v-deep .el-icon-success {
        font-size: 48px;
        color: #26a872;
      }
    }
    .footer {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
  }
}
</style>
