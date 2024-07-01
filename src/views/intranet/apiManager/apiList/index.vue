<template>
  <div class="api-list">
    <el-row class="filter-container">
      <el-col :span="18">
        <el-form
          style="height: 45px"
          :inline="true"
          :model="listQuery"
          @submit.native.prevent
        >
          <el-form-item>
            <el-input
              :placeholder="searchInputPlaceholder"
              v-model="listQuery.searchKeyWord"
              v-on:input="onSearchChange"
              style="width: 350px"
              :clstag="clstag('apiManager_1618992937884|2', '')"
              @keyup.enter.native="search"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="search" icon="el-icon-search"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6">
        <el-button
          type="primary"
          icon="el-icon-plus"
          v-on:click="registerApi"
          style="margin-bottom: 5px; float: right"
          :clstag="clstag('apiManager_1618997499692|1', '')"
          >注册API</el-button
        >
      </el-col>
    </el-row>
    <div v-if="tableDatas.length === 0 && type === 1" class="noData">
      <img src="@/assets/img/noData.png" />
      <p>抱歉，没有查询到结果～</p>
    </div>
    <el-table
      v-loading="loading"
      v-show="tableDatas.length > 0 && type === 1"
      :data="tableDatas"
      :row-class-name="rowClassName"
      class="my-table mb2"
    >
      <template slot="empty">
        <div>经查询，无符合搜索条件的结果</div>
      </template>
      <el-table-column
        label="序号"
        prop="number"
        width="48px"
      />
      <el-table-column
        label="JSF接口名"
        prop="qualifiedName"
        align="left"
        min-width="40%"
        :show-tooltip-when-overflow="true"
      />
      <el-table-column
        label="API名称"
        prop="cnName"
        align="left"
        min-width="30%"
        :show-tooltip-when-overflow="true"
      />
      <!-- <el-table-column
        label="所属应用"
        prop="appName"
        align="left"
        min-width="20.40%"
        :show-tooltip-when-overflow="true"
      /> -->
      <!-- <el-table-column
        label="发布范围"
        prop="scope"
        min-width="17%"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.scope == 1 ? "内网" : "" }}</span>
          <span>{{ scope.row.scope == 2 ? "外网" : "" }}</span>
          <span>{{ scope.row.scope == 3 ? "ISV应用" : "" }}</span>
          <span>{{ scope.row.scope == 4 ? "商家自研应用" : "" }}</span>
        </template>
      </el-table-column> -->

      <el-table-column
        label="状态"
        prop="status"
        min-width="13%"
      >
        <template slot-scope="scope">
          <span
            class="status_init status"
            v-if="+scope.row.isOnline === 0 && +scope.row.status === 1"
          >
            初始化
          </span>
          <span
            class="status_edit status"
            v-if="+scope.row.isOnline === 1 && +scope.row.status === 1"
          >
            编辑中
          </span>
          <span
            class="status_approve status"
            v-if="
              +scope.row.status === 3 ||
                +scope.row.status === 9 ||
                +scope.row.status === 7
            "
          >
            审批中
          </span>
          <span class="status_released status" v-if="+scope.row.status === 4">
            已发布
          </span>
          <span class="status_offline status" v-if="+scope.row.status === 6">
            已下线
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="更新人"
        prop="createUser"
        align="left"
        min-width="17.11%"
        :show-tooltip-when-overflow="true"
      />
      <el-table-column
        label="更新时间"
        prop="createTime"
        min-width="24.11%"
      >
        <template slot-scope="{ row }">
          <span>{{ serializationTime(row.createTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" prop="id" min-width="10%">
        <template slot-scope="scope">
          <el-link
            type="primary"
            :underline="false"
            @click="
              $router.push({
                name: 'ApiManagerDetail',
                params: { id: scope.row.id, type: 'jsf' }
              })
            "
             v-if="jsfBtnStatus(scope.row).edit.visible"
            :disabled="jsfBtnStatus(scope.row).edit.disabled"
            >管理</el-link
          >
          <!-- <el-button
            type="text"
            v-if="jsfBtnStatus(scope.row).offline.visible"
            :disabled="jsfBtnStatus(scope.row).offline.disabled"
            class="tap-out-http"
            @click="handleTapOutJsf(scope.row)"
            >下线</el-button
          > -->
        </template>
      </el-table-column>
      
    </el-table>

    <!-- HTTP表格 -->

    <div v-if="httpTableDatas.length === 0 && type === 2" class="noData">
      <img src="@/assets/img/noData.png" />
      <p>抱歉，没有查询到结果～</p>
    </div>
    <el-table
      v-loading="loading"
      v-show="httpTableDatas.length > 0 && type === 2"
      :data="httpTableDatas"
      :row-class-name="rowClassName"
      class="my-table mb2"
    >
      <template slot="empty">
        <div>经查询，无符合搜索条件的结果</div>
      </template>
      <el-table-column
        label="序号"
        prop="number"
        width="48px"
      />
      <el-table-column
        label="API中文名称"
        prop="name"
        align="left"
        min-width="40%"
        :show-tooltip-when-overflow="true"
      />
      <el-table-column
        label="URI"
        prop="url"
        align="left"
        min-width="30%"
        :show-tooltip-when-overflow="true"
      />
      <el-table-column
        label="所属分组"
        prop="domainName"
        align="left"
        min-width="20.40%"
        :show-tooltip-when-overflow="true"
      />
      <el-table-column
        label="状态"
        prop="status"
        min-width="13%"
      >
        <template slot-scope="scope">
          <span
            class="status_init status"
            v-if="+scope.row.isOnline === 0 && +scope.row.status === 1"
          >
            初始化
          </span>
          <span
            class="status_edit status"
            v-if="+scope.row.isOnline === 1 && +scope.row.status === 1"
          >
            编辑中
          </span>
          <span
            class="status_approve status"
            v-if="
              +scope.row.status === 3 ||
                +scope.row.status === 9 ||
                +scope.row.status === 7
            "
          >
            审批中
          </span>
          <span class="status_released status" v-if="+scope.row.status === 4">
            已发布
          </span>
          <span class="status_offline status" v-if="+scope.row.status === 6">
            已下线
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="更新人"
        prop="updateUser"
        align="left"
        min-width="17.11%"
        :show-tooltip-when-overflow="true"
      />
      <el-table-column
        label="更新时间"
        prop="updateTime"
        min-width="24.11%"
      >
        <template slot-scope="{ row }">
          <span>{{ serializationTime(row.updateTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" prop="id" min-width="17%">
        <template slot-scope="scope">
          <el-link
            type="primary"
            :underline="false"
            @click="
              $router.push({
                name: 'ApiManagerDetail',
                params: { id: scope.row.id, type: 'http' }
              })
            "
            >管理</el-link
          >
          <el-link
            type="primary"
            v-if="tapOutBtnStatus(scope.row).visible"
            :disabled="tapOutBtnStatus(scope.row).disabled"
            :underline="false"
            class="tap-out-http"
            @click="handleTapOutHttp(scope.row)"
            >下线</el-link
          >
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col :span="24">
        <!-- jsf -->
        <pagination
          v-show="listQuery.total && type === 1"
          :total="listQuery.total"
          :pageSizes.sync="listQuery.pageSizes"
          :page.sync="listQuery.pageNumb"
          :limit.sync="listQuery.pageSize"
          v-on:pagination="paginationChange"
          style="margin: 0px; float: right"
        />
        <!-- http -->
        <pagination
          v-show="httpListQuery.total && type === 2"
          :total="httpListQuery.total"
          :pageSizes.sync="httpListQuery.pageSizes"
          :page.sync="httpListQuery.pageNumb"
          :limit.sync="httpListQuery.pageSize"
          v-on:pagination="paginationHttpChange"
          style="margin: 0px; float: right"
        />
      </el-col>
    </el-row>
    <TapOutJsfDialog
      :tapOutJsfDiaInfo.sync="tapOutJsfDiaInfo"
      @queryApi="queryApi"
    ></TapOutJsfDialog>
    <el-dialog
      width="530px"
      type="text"
      title="API下线申请"
      custom-class="tap-out-http-dia"
      :visible.sync="tapOutHttpDiaInfo.show"
    >
      <div class="dia-content" v-if="tapOutHttpDiaInfo.curStep === 'step1'">
        <p>
          <i class="el-icon-warning"></i>
          <span class="step1-title step-title">确认要下线此API吗？</span>
        </p>
        <p class="step1-des">此API在7天内有调用量，如果下线将会影响调用方</p>
      </div>
      <div
        class="dia-content"
        v-else-if="tapOutHttpDiaInfo.curStep === 'step2'"
      >
        <p class="step-title">请填写审批人ERP账号</p>
        <p class="">审批人不能是本人，审批通过后，API下线生效</p>
        <div class="step2-form_content">
          <el-form
            :model="tapOutHttpDiaInfo.applyerFormValue"
            ref="tapOutHttpApplyerErp"
            :rules="tapOutHttpDiaInfo.tapOutHttpApplyerErpFormRule"
          >
            <el-form-item
              prop="applyerErp"
              class="step2-form-item_wrap"
              label="审批人ERP账号"
            >
              <ErpPrincipal
                :formDataPrincipal.sync="
                  tapOutHttpDiaInfo.applyerFormValue.applyerErp
                "
                placeholder="审批人可在京ME流程中心审批"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div
        class="dia-content dia-content_success"
        v-else-if="tapOutHttpDiaInfo.curStep === 'step3'"
      >
        <i class="el-icon-success"></i>
        <p class="step3-title">提交成功</p>
        <p class="step3-des">提醒审批人尽快审批吧，审批通过后API下线生效</p>
      </div>
      <div slot="footer">
        <template v-if="tapOutHttpDiaInfo.curStep === 'step1'">
          <el-button @click="handleDiaCancel">取消</el-button>
          <el-button type="primary" @click="handleDiaConfirm('step1')"
            >下线</el-button
          >
        </template>
        <template v-if="tapOutHttpDiaInfo.curStep === 'step2'">
          <el-button @click="handleDiaCancel">取消</el-button>
          <el-button type="primary" @click="handleDiaConfirm('step2')"
            >提交</el-button
          >
        </template>
        <template v-if="tapOutHttpDiaInfo.curStep === 'step3'">
          <el-button type="primary" @click="handleDiaConfirm('step3')"
            >确定</el-button
          >
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination/index.vue";
import request from "@/utils/request";
import { parseTime } from "@/utils";
import { mapGetters } from "vuex";
import { findHttpApiList } from "@/api/apiStore/api";
import parseTimeNew from "@/utils/parseTime.js";
import pageClick from "@/utils/pageClick.js";
import gwApiRequest from "@/utils/gwApiRequest.js";
import TapOutJsfDialog from "./components/TapOutJsfDialog.vue";
import store from "@/store/national/index.js";
import gateway from "@/api/intranet/gateway/index.js";
import ErpPrincipal from "@/views/intranet/apiManager/components/ErpPrincipal.vue";

export default {
  components: { Pagination, ErpPrincipal, TapOutJsfDialog },
  data() {
    const applayerErpValidatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入审批人ERP账号"));
        return;
      }
      if (value === store.getters.user_pin) {
        callback(new Error("审批人不能为当前操作人本人"));
        return;
      }
      callback();
    };
    return {
      env: "",
      tableDatas: [],
      httpTableDatas: [],
      type: 1,
      listQuery: {
        searchKeyWord: "",
        total: 0,
        pageNumb: 1,
        pageSize: 10,
        pageSizes: [10, 20, 40, 60]
      },
      httpListQuery: {
        total: 0,
        pageNumb: 1,
        pageSize: 10,
        pageSizes: [10, 20, 40, 60]
      },
      loading: true,
      loadingInstance: "",
      tapOutJsfDiaInfo: {
        show: false,
        rowInfo: null
      },
      tapOutHttpDiaInfo: {
        show: false,
        curStep: "step1",
        rowInfo: null,
        applyerFormValue: {
          applyerErp: ""
        },
        tapOutHttpApplyerErpFormRule: {
          applyerErp: [
            {
              validator: applayerErpValidatePass,
              trigger: ["change", "blure"]
            },
            {
              required: true,
              trigger: ["change", "blure"]
            }
          ]
        }
      }
    };
  },
  computed: {
    ...mapGetters(["user_pin"]),
    tapOutBtnStatus() {
      return row => {
        // 初始化：isOnline==0 and status==1
        // 编辑中：isOnline==1 and status==1
        // 审批中：status==3 or status == 9 or status==7
        // 已发布：status==4
        // 已下线：status==6
        const { isOnline, status } = row;
        let visible =
          (+isOnline == 1 && +status == 1) ||
          +status == 3 ||
          +status == 9 ||
          +status == 7 ||
          +status == 4;
        let disabled = +status == 3 || +status == 9 || +status == 7;
        return {
          disabled,
          visible
        };
      };
    },
    jsfBtnStatus() {
      // 下线按钮
      return row => {
        // 初始化：isOnline==0 and status==1
        // 编辑中：isOnline==1 and status==1
        // 审批中：status==3 or status == 9 or status==7
        // 已发布：status==4
        // 已下线：status==6
        let offline = {
          visible: true,
          disabled: false
        };
        let edit = {
          visible: true,
          disabled: false
        };
        const { isOnline, status } = row;
        if (+isOnline === 0 && +status === 1) {
          offline.visible = false;
          // 初始化
        } else if (+isOnline === 1 && +status === 1) {
          // 编辑中
        } else if (+status === 3 || +status === 9 || +status === 7) {
          // 审批中
          offline.visible = true;
          offline.disabled = true;
        } else if (+status === 4) {
          // 已发布
        } else if (+status === 6) {
          // 已下线
          offline.visible = false;
        }

        return {
          offline,
          edit
        };
      };
    },
    searchInputPlaceholder() {
      if (+this.type === 1) { // jsf
        return '请输入API名称、JSF接口名'
      }
      if(+this.type === 2) { // http
        return '请输入API名称、URI'
      }
    }
  },
  filters: {
    parseTimefilter(obj, fomart) {
      return parseTime(obj, fomart);
    }
  },
  methods: {
    async queryApiByCondition() {
      const url = "/ApiManagerService/queryApiByCondition";
      const { pageSize, pageNumb } = this.listQuery;
      let { searchKeyWord } = this.listQuery;
      searchKeyWord = searchKeyWord.trim();
      const data = [{ pageSize, pageNumb }, { searchKeyWord, sceneType: 1 }];
      return await gwApiRequest.post(url, JSON.stringify(data));
    },

    // 点击事件埋点
    clstag(intranetId, extranetId) {
      return pageClick(intranetId, extranetId);
    },
    serializationTime(time) {
      return parseTimeNew.timeInTable(time);
    },
    search() {
      if (this.type === 1) {
        //JSF协议
        this.queryApi();
      } else if (this.type === 2) {
        //http协议
        this.queryHttpApi();
      }
    },
    queryHttpApi() {
      const page = this.httpListQuery.pageNumb;
      const pageSize = this.httpListQuery.pageSize;
      const queryLike = this.listQuery.searchKeyWord.trim();
      const sidx = "updateTime";
      const sord = "desc";
      const gwParams = [{ page, pageSize, sord, sidx }, { queryLike, sceneType:1 }];
      findHttpApiList(gwParams)
        .then(res => {
          this.httpListQuery.total = res.data.total;
          this.httpTableDatas = res.data.rows;
        })
        .catch(error => {
          console.log(error);
        });
    },
    async queryApi() {
      this.loading = true;
      const response = await this.queryApiByCondition().catch(() => {
        this.loading = false;
        throw new Error("queryApi queryApiByCondition");
      });
      const { data } = response;
      const { total, list } = data;
      this.listQuery.total = total;
      this.tableDatas = list || [];
      this.loading = false;
    },
    paginationChange(p) {
      this.listQuery.pageNumb = p.page;
      this.listQuery.pageSize = p.limit;
      //JSF协议
      this.queryApi();
    },
    paginationHttpChange(p) {
      this.httpListQuery.pageNumb = p.page;
      this.httpListQuery.pageSize = p.limit;
      this.queryHttpApi();
    },
    rowClassName({ row, rowIndex }) {
      row.number = rowIndex + 1;
    },

    registerApi() {
      const query = this.$route.query;
      this.$router.push({ path: "/apiManager/registerApi", query });
    },

    // apiManager(id) {
    //   this.$router.push({
    //     name: "ApiManagerApiTabs",
    //     params: { id },
    //     query: { tabName: "basic-data" },
    //   });
    // },
    onSearchChange() {
      if (this.listQuery.searchKeyWord.trim().length === 0) {
        if (this.type === 1) {
          //JSF协议
          this.queryApi();
        } else if (this.type === 2) {
          //http协议
          this.queryHttpApi();
        }
      }
    },
    handleTapOutJsf(row) {
      this.tapOutJsfDiaInfo = {
        show: true,
        rowInfo: row
      };
    },
    handleTapOutHttp(row) {
      const param = [{ bizCode: `${row.domainCode}${row.url}` }];
      gateway.HttpApiService.queryIsCloudApiHaveCallCountByBizCode(
        JSON.stringify(param)
      )
        .then(response => {
          const { code, data } = response || {};
          if (+code === 20000) {
            this.tapOutHttpDiaInfo.show = true;
            this.tapOutHttpDiaInfo.rowInfo = row;
            if (data) {
              this.tapOutHttpDiaInfo.curStep = "step1";
            } else {
              this.tapOutHttpDiaInfo.curStep = "step2";
            }
          }
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    handleDiaCancel() {
      this.tapOutHttpDiaInfo.show = false;
    },
    handleDiaConfirm(step) {
      switch (step) {
        case "step1":
          this.tapOutHttpDiaInfo.curStep = "step2";
          break;
        case "step2":
          this.$refs["tapOutHttpApplyerErp"].validate(async valid => {
            if (valid) {
              const applaySuccess = await this.offlineCloudApi();
              if (applaySuccess) {
                this.tapOutHttpDiaInfo.curStep = "step3";
                this.queryHttpApi();
              }
            } else {
              return false;
            }
          });
          break;
        case "step3":
          this.handleDiaCancel();
          this.tapOutHttpDiaInfo.applyerFormValue.applyerErp = "";
          break;
      }
    },
    async offlineCloudApi() {
      return new Promise(res => {
        const param = [
          this.tapOutHttpDiaInfo.rowInfo.id,
          this.tapOutHttpDiaInfo.applyerFormValue.applyerErp
        ];
        let data = false;
        gateway.HttpApiService.offlineCloudApi(JSON.stringify(param))
          .then(({ code }) => {
            data = +code === 20000;
            res(data);
          })
          .catch(() => {
            res(data);
          });
      });
    }
  },
  created() {
    this.env = window.env.baseEnv;
  },
  watch: {
    '$route': {
      handler(newRoute) {
        const {query} = newRoute || {};
        if (query.type === 'http') {
          this.type = 2;
          this.queryHttpApi()
        } else {
          this.type = 1;
          this.queryApi()
        }
      },
      immediate: true,
    }
  }
};
</script>

<style lang="scss" scoped>
.noData {
  text-align: center;
}
.tap-out-http {
  margin-left: 16px;
}
.tap-out-http-dia {
  .dia-content {
    padding: 28px 14px;
  }
  .el-icon-warning {
    font-size: 20px;
    color: #fa7b55;
  }
  .step1-title {
    margin-left: 8px;
  }
  .step1-des {
    margin-left: 28px;
  }
  .step-title {
    color: #333333;
    font-weight: 600;
    margin-bottom: 8px;
  }
  .step2-form_content {
    display: flex;
    align-items: center;
    padding-top: 24px;
  }
  .step2-form-item_wrap {
    display: flex;
    .el-form-item__label {
      font-weight: 600;
    }
  }
  .dia-content_success {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .el-icon-success {
    font-size: 46px;
    color: #26a872;
  }
  .step3-title {
    font-size: 16px;
    color: rgb(0, 0, 0);
    padding: 16px 0 4px 0;
  }
  .step3-des {
    color: rgb(153, 153, 153);
  }
}
.status {
  &::before {
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 4px;
  }
  &_init {
    color: #3c6ef0;
    &::before {
      background: #3c6ef0;
    }
  }
  &_edit,
  &_approve {
    color: #ea730b;
    &::before {
      background: #ea730b;
    }
  }
  &_released {
    color: #26a872;
    &::before {
      background: #26a872;
    }
  }
  &_offline {
    color: #666666;
    &::before {
      background: #666666;
    }
  }
}
</style>