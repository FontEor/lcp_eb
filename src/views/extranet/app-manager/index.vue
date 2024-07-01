<template type="ElementUI">
  <div class="app-container" meta="x:133.0,y:57.0,width:840.0,height:403.0">
    <div style="display: none" id="displayapp">
      <div style="text-align: center">
        <img src="@/assets/createapp.png" />
      </div>
      <div
        style="
          text-align: center;
          margin-bottom: 30px;
          font-size: 20px;
          color: #939393;
        "
      ></div>
      <div style="text-align: center">
        <el-button type="primary" v-on:click="createApp">{{
          $t("app.app.5ix5rl4zz2o0")
        }}</el-button>
      </div>
    </div>
    <div
      v-if="FromSearchOrNot === 'true' || (tableDatas && tableDatas.length > 0)"
    >
      <el-row class="filter-container">
        <el-col :span="18">
          <el-form
            style="height: 45px"
            :inline="true"
            :model="appForm"
            @submit.native.prevent
          >
            <el-form-item>
              <el-row>
                <el-col :span="18">
                  <el-input
                    :placeholder="$t('app.app.5ix5rl4zzo40')"
                    v-model="appForm.queryName"
                    v-on:input="onSearchChange"
                    style="width: 350px"
                    :clstag="clstag('appManager_1618992895182|1', '')"
                    v-on:keyup.enter.native="searchApps"
                  ></el-input>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item :span="6">
              <el-button
                type="primary"
                icon="el-icon-search"
                v-on:click="searchApps"
                >{{ $t("app.app.5ix5rl4zzt80") }}</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6">
          <el-button
            type="primary"
            icon="el-icon-plus"
            style="margin: 0px; float: right"
            :clstag="clstag('appManager_1618992895182|2', '')"
            v-on:click="createApp"
            >{{ $t("app.app.5ix5rl4zzx80") }}</el-button
          >
        </el-col>
      </el-row>
      <el-table
        :data="tableDatas"
        :row-class-name="rowClassName"
        class="my-table mb2"
      >
        <template slot="empty">
          <div>{{ $t("app.app.5ix5rl5000s0") }}</div>
        </template>
        <el-table-column
          :label="$t('app.app.5ix5rl500500')"
          prop="number"
          min-width="10%"
        />
        <el-table-column
          :label="$t('app.app.5ix5rl5008s0')"
          prop="name"
          min-width="24%"
          :show-tooltip-when-overflow="true"
        />
        <!--        <el-table-column label="AppKey" prop="code" align="center" min-width="19.69%" :show-tooltip-when-overflow="true"/>-->
        <el-table-column
          :label="$t('app.app.5ix5rl500ig0')"
          prop="typeName"
          min-width="15%"
          :show-tooltip-when-overflow="true"
        >
          <!-- <template scope="{row}">
            <span>{{ formatAppTypeText(row) }}</span>
          </template> -->
        </el-table-column>
        <el-table-column
          :label="$t('app.app.5ix5rl500n40')"
          prop="status"
          min-width="10%"
          :show-tooltip-when-overflow="true"
        >
          <template slot-scope="{ row }">
            <span
              :class="{
                normalColor: row.status === 1,
                initColor: row.status === 2,
                updateColor: row.status === 3,
              }"
              >{{ formatAppStatusText(row) }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('app.app.5ix5rl500qs0')"
          prop="createUser"
          min-width="10%"
          :show-tooltip-when-overflow="true"
        />
        <el-table-column
          :label="$t('app.app.5ix5rl500uc0')"
          prop="createTime"
          min-width="20%"
          :show-tooltip-when-overflow="true"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.createTime | parseTimefilter("{y}-{m}-{d} {h}:{i}")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('app.app.5ix5rl500y80')"
          prop="id"
          min-width="10%"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button type="text" v-on:click="appManager(scope.row)">{{
              $t("app.app.5ix5rl501180")
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <pagination
          v-show="listQuery.total"
          :total="listQuery.total"
          :pageSizes.sync="listQuery.pageSizes"
          :page.sync="listQuery.pageNumb"
          :limit.sync="listQuery.pageSize"
          v-on:pagination="paginationChange"
          style="margin: 0px; float: right"
        />
      </el-row>
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination/index.vue";
import request from "@/utils/request";
import { parseTime } from "@/utils";
import pageClick from "@/utils/pageClick.js";

export default {
  components: { Pagination },
  data() {
    return {
      FromSearchOrNot: "false",
      tableDatas: [],
      appForm: {
        queryName: "",
      },
      listQuery: {
        total: 1,
        pageNumb: 1,
        pageSize: 10,
        pageSizes: [10, 20, 40, 60],
      },
    };
  },
  filters: {
    parseTimefilter(obj, fomart) {
      return parseTime(obj, fomart);
    },
  },
  methods: {
    // 点击事件埋点
    clstag(intranetId, extranetId) {
      return pageClick(intranetId, extranetId);
    },
    formatAppTypeText(row) {
      const { type } = row;
      const { dictionary } = this.$store.state.tools;
      try {
        return dictionary.appType[type].value;
      } catch (error) {
        return "";
      }
    },
    formatAppStatusText(row) {
      const { status } = row;
      const { dictionary } = this.$store.state.tools;
      try {
        return dictionary.appStatus[status].value;
      } catch (error) {
        return "";
      }
    },
    queryApps() {
      let url = "/app/findAppInfoList";
      request({
        url: url,
        method: "get",
        params: {
          pageSize: this.listQuery.pageSize,
          pageNumb: this.listQuery.pageNumb,
          queryLikeCodeOrName: this.appForm.queryName,
        },
      })
        .then((rsp) => {
          this.listQuery.total = rsp.data.total;
          this.tableDatas = rsp.data.list || [];
          if (
            this.tableDatas &&
            this.tableDatas.length === 0 &&
            this.FromSearchOrNot === "false"
          ) {
            document.getElementById("displayapp").style.display = "";
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },

    searchApps() {
      let url = "/app/findAppInfoList";
      request({
        url: url,
        method: "get",
        params: {
          pageSize: this.listQuery.pageSize,
          pageNumb: this.listQuery.pageNumb,
          queryLikeCodeOrName: this.appForm.queryName,
        },
      })
        .then((rsp) => {
          this.listQuery.total = rsp.data.total;
          this.tableDatas = rsp.data.list || [];
        })
        .catch((e) => {
          console.log(e);
        });
    },

    onSearchChange() {
      this.FromSearchOrNot = "true";
      if (this.appForm.queryName.trim().length === 0) this.queryApps();
      else this.searchApps();
    },

    paginationChange(p) {
      this.listQuery.pageNumb = p.page;
      this.listQuery.pageSize = p.limit;
      if (this.appForm.queryName.trim().length === 0) this.queryApps();
      else this.searchApps();
    },

    rowClassName({ row, rowIndex }) {
      row.number = rowIndex + 1;
    },

    createApp() {
      const name = "AppManagerCreateApp";
      this.$router.push({ name });
    },

    appManager(row) {
      const { id } = row;
      this.$router.push({
        name: "AppManagerAppTabs",
        params: { id },
        query: { tabName: "302" },
      });
    },
  },
  created() {
    this.queryApps(1, this.listQuery.limit);
  },
};
</script>
