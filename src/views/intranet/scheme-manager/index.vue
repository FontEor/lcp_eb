<template type="ElementUI">
  <div class="app-container">
    <el-row class="filter-container" type="flex" justify="space-between">
      <el-form
        style="height: 32px"
        :inline="true"
        :model="listQuery"
        @submit.native.prevent
      >
        <el-form-item>
          <el-select
            v-model="listQuery.soulutionType"
            clearable
            style="width: 100%"
            placeholder="请输入方案类型"
            @change="search"
          >
            <el-option
              v-for="item in solutionTypes"
              :key="item.dictName"
              :label="item.dictValue"
              :value="item.dictName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            placeholder="请输入对接方案名称/编码"
            v-model="listQuery.searchKeyWord"
            style="width: 200px"
            :clstag="clstag('openBiz_1618992782961|1', '')"
            v-on:keyup.enter.native="search"
            v-on:input="onSearchChange"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search"
            >查询</el-button
          >
        </el-form-item>
      </el-form>

      <el-button
        type="primary"
        icon="el-icon-plus"
        :clstag="clstag('openBiz_1618992782961|2', '')"
        v-on:click="newBizUnit"
        >新建对接方案
      </el-button>
    </el-row>

    <span v-if="this.nodata === 'no'">
      <el-table
        :data="tableDatas"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        meta="x:37.0,y:57.0,width:901.0,height:216.0"
        :row-class-name="rowClassName"
        class="my-table mb2"
      >
        <template slot="empty">
          <div>经查询，无符合搜索条件的结果</div>
        </template>
        <el-table-column
          label="序号"
          prop="number"
          align="center"
          min-width="10%"
        />
        <el-table-column
          label="名称"
          prop="name"
          align="center"
          min-width="20%"
          :show-tooltip-when-overflow="true"
        />
        <el-table-column
          label="编码"
          prop="code"
          align="center"
          min-width="10%"
          :show-tooltip-when-overflow="true"
        />
        <el-table-column
          label="方案类别"
          prop="solutionType"
          align="center"
          min-width="20%"
          :show-tooltip-when-overflow="true"
        >
          <template slot-scope="scope">
            <span>{{ parseSolutionTypefilter(scope.row.solutionType) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="所属分类"
          prop="businessTypeCode"
          min-width="10%"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ parseCategoryfilter(scope.row.businessTypeCode) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="发布范围"
          prop="publishRange"
          min-width="10%"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.publishRange | parseRangefilter() }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="最近发布时间"
          prop="publishTime"
          min-width="12%"
          align="center"
          :formatter="formatTime"
        >
        </el-table-column>
        <el-table-column
          label="创建人"
          prop="createUser"
          align="center"
          min-width="10%"
        />
        <el-table-column
          label="创建时间"
          prop="createTime"
          align="center"
          min-width="12%"
          :formatter="formatTime"
        >
        </el-table-column>
        <el-table-column label="操作" prop="id" min-width="10%" align="left">
          <template slot-scope="scope">
            <el-button type="text" v-on:click="detailInfo(scope.row.id)"
              >管理</el-button
            >
            <el-button type="text" v-if="scope.row.publishStatus === 1" @click="deleteBizunit(scope.row.id)" style="color: rgb(225, 37, 27);"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="24">
          <pagination
            v-show="listQuery.total"
            :total="listQuery.total"
            :pageSizes.sync="listQuery.pageSizes"
            :page.sync="listQuery.pageNumb"
            :limit.sync="listQuery.pageSize"
            style="margin: 0px; float: right"
            v-on:pagination="paginationChange"
          />
        </el-col>
      </el-row>
    </span>
    <span v-if="this.nodata === 'yes'">
      <div style="margin-top: 0px; text-align: center">
        <img src="@/assets/img/noData.png" />
      </div>
      <div class="noDataMessage">抱歉，没有查询到结果～</div>
    </span>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination/index.vue";
import parseTime from "@/utils/parseTime.js";
import pageClick from "@/utils/pageClick.js";
import request from "@/utils/request.js";

export default {
  components: { Pagination },
  data() {
    return {
      tableDatas: [],
      listQuery: {
        searchKeyWord: "",
        total: 1,
        pageNumb: 1,
        pageSize: 10,
        pageSizes: [10, 20, 40, 60],
        soulutionType: "",
      },
      businessTypes: [],
      loading: true,
      nodata: "yes",
      solutionTypes: [],
    };
  },
  filters: {
    parseRangefilter(obj) {
      if (obj === 1) {
        return "私有";
      } else if (obj === 2) {
        return "公有";
      } else {
        return "-";
      }
    },
  },
  methods: {
    // 点击事件埋点
    clstag(intranetId, extranetId) {
      return pageClick(intranetId, extranetId);
    },
    formatTime(row, column) {
      return parseTime.timeInTable(row[column.property]) || "-";
    },
    parseCategoryfilter(obj) {
      if (obj) {
        let cate = this.businessTypes.find((item) => {
          return item.code === obj;
        });
        if (cate) {
          return cate.name;
        } else {
          return `-`;
        }
      } else {
        return "-";
      }
    },
    parseSolutionTypefilter(solutionType) {
      if (solutionType) {
        let cate = this.solutionTypes.find((item) => {
          return item.dictName == solutionType;
        });
        if (cate) {
          return cate.dictValue;
        } else {
          return `-`;
        }
      } else {
        return "-";
      }
    },
    /**
     * 查询分类字典
     */
    fetchBusinessTypes() {
      let url = "/businesstype/getBusinessTypes";
      request({
        url: url,
        method: "get",
      })
        .then((rsp) => {
          this.businessTypes = rsp.data;
        })
        .catch((e) => {
          console.log(e);
          this.loading = false;
        });
    },
    /**
     * 获取方案类型
     **/
    fetchSolutionType() {
      request({
        url: "/lcpDict/getDicts",
        method: "get",
        params: { type: "solutionType" },
      })
        .then((rsp) => {
          if (rsp.code === 20000) {
            this.solutionTypes = rsp.data;
            console.log("====", this.solutionTypes);
          }
        })
        .catch((e) => {
          callback();
        });
    },
    /**
     * 查询对接方案前置信息
     */
    queryBizUnit() {
      let _this = this;
      let url = "/bizunit/findBizUnitPreList";
      _this.loading = true;
      request({
        url: url,
        method: "get",
        params: {
          pageSize: _this.listQuery.pageSize,
          pageNumb: _this.listQuery.pageNumb,
          queryLike: _this.listQuery.searchKeyWord,
          solutionType: _this.listQuery.soulutionType,
        },
      })
        .then((rsp) => {
          if (rsp.data) {
            _this.tableDatas = rsp.data.list;
            _this.listQuery.total = rsp.data.total;
            this.loading = false;
            if (_this.tableDatas.length == 0 && this.nodata === "yes") {
              this.nodata = "yes";
            } else {
              this.nodata = "no";
            }
          }
        })
        .catch((e) => {
          console.log(e);
          this.loading = false;
          this.nodata = "yes";
        });
    },
    search() {
      this.queryBizUnit();
    },
    onSearchChange() {
      if (this.listQuery.searchKeyWord.trim().length === 0) this.queryBizUnit();
    },
    onEnterUp() {
      this.queryBizUnit();
    },
    // 为每一行加一个class 可以用来加样式
    rowClassName({ row, rowIndex }) {
      row.number = rowIndex + 1;
    },
    paginationChange(p) {
      this.listQuery.pageNumb = p.page;
      this.listQuery.pageSize = p.limit;
      this.queryBizUnit();
    },
    detailInfo(id) {
      this.$router.push({
        // path: "/openBiz/openBizDetail",
        name: "OpenBizOpenBizDetail",
        params: { id: id },
        query: { tag: "overview" },
      });
    },
    newBizUnit() {
      this.$router.push({ path: "/openBiz/createBizUnit" });
    },

    // 删除方案
    async deleteBizunit(id){
      this.$confirm("方案删除后将无法恢复，请确认是否删除此对接方案？", "删除提醒", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
          request({
            url: "/bizunit/delete",
            method: "delete",
            params: { unitId: id, },
          }).then(res => {
              if (res.code === 20000) {
                this.queryBizUnit();
                this.$message({
                  message: "操作成功",
                  type: "success",
                });
              } else {
                this.$message.error(res.message);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((e) => {
          console.log("错误", e);
        });
    }
    
    
  },
  created() {
    this.listQuery.searchKeyWord = this.$route.query.searchKeyWord;
    this.fetchBusinessTypes();
    this.fetchSolutionType();
    this.queryBizUnit();
  },
};
</script>

<style scoped>
.noDataMessage {
  width: 100%;
  margin: 0 auto;
  margin-top: 0px;
  text-align: center;
  vertical-align: middle;
}
</style>
