<template>
  <div meta="x:259.0,y:143.0,width:600.0,height:395.0">
    <!--    <span v-if="monitor==='pending'" key="1"/>-->
    <span v-if="monitor === 'online'" key="1">
      <div class="filter-container">
        <el-row>
          <el-col :span="24">
            <label style="margin: 5px; font-weight: normal">别名: </label>
            <el-radio-group v-model="radio" @change="onQueryByAlias()">
              <el-radio-button label="全部" id="all"></el-radio-button>
              <el-radio-button
                v-for="item in aliasList"
                :key="item.key"
                :label="item.label"
              ></el-radio-button>
            </el-radio-group>
          </el-col>
        </el-row>
      </div>
    </span>
    <span v-if="monitor === 'online' || monitor === 'pending'" key="2">
      <el-table
        v-loading="loading"
        element-loading-text="存活实例检测中..."
        element-loading-spinner="el-icon-loading"
        :data="currentTableDatas"
        :default-sort="{ prop: 'host', order: 'descending' }"
        :row-class-name="rowClassName"
        class="my-table mb2"
      >
        <el-table-column
          label="序号"
          prop="number"
          align="center"
          min-width="7.36%"
        />
        <el-table-column
          prop="ip"
          label="主机"
          align="center"
          min-width="18.23%"
        ></el-table-column>
        <el-table-column
          prop="port"
          label="端口"
          align="center"
          min-width="15.22%"
        ></el-table-column>
        <el-table-column
          prop="alias"
          label="别名"
          align="center"
          min-width="29.60%"
        ></el-table-column>
        <el-table-column
          prop="pid"
          label="PID"
          align="center"
          min-width="16.05%"
        ></el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          align="center"
          min-width="13.38%"
        >
          <template slot-scope="scope">
            <span
              type="text"
              class="unknownColor"
              v-if="scope.row.status == 0 && scope.row.optType == 1"
              >无心跳
            </span>
            <span
              type="text"
              class="normalColor"
              v-if="scope.row.status == 1 && scope.row.optType == 1"
              >正常
            </span>
            <span
              type="text"
              class="deadColor"
              v-if="scope.row.status == 0 && scope.row.optType == 0"
              >死亡
            </span>
            <span
              type="text"
              class="deadColor"
              v-if="scope.row.status == 1 && scope.row.optType == 0"
              >下线
            </span>
            <span type="text" class="deadColor" v-if="scope.row.status == 2"
              >死亡
            </span>
            <span type="text" class="deadColor" v-if="scope.row.status == 3"
              >死亡下线
            </span>
            <span type="text" v-if="scope.row.status == 4">反注册 </span>
            <span type="text" v-if="scope.row.status == 5">扫描 </span>
          </template>
        </el-table-column>
      </el-table>
    </span>
    <span v-if="monitor === 'online'" key="3">
      <el-row>
        <el-col :span="24">
          <pagination
            v-show="listQuery.total"
            :total="listQuery.total"
            :pageSizes.sync="listQuery.pageSizes"
            :page.sync="listQuery.pageNumb"
            :limit.sync="listQuery.pageSize"
            v-on:pagination="paginationChange"
            style="margin: 0px; float: right"
          />
        </el-col>
      </el-row>
    </span>
    <span v-else-if="monitor === 'offline'" key="4">
      <div style="margin-top: 15%; text-align: center">
        <img
          src="@/assets/img/warning.svg"
          style="width: 80px; height: 80px; margin-bottom: 20px"
        />
        <el-row>
          <el-col :span="24">
            <div style="margin-top: 0px; text-align: center">
              没有检测到存活实例，请检查是否已按照<a
                :href="this.apiPublishPath"
                style="color: #3c6ef0"
                target="_blank"
                >《API部署手册》</a
              >成功部署服务，并在别名列表中维护JSF别名
            </div>
          </el-col>
        </el-row>
      </div>
    </span>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination/index.vue";
import request from "@/utils/request.js";
import gwApiRequest from "@/utils/gwApiRequest.js";

export default {
  components: { Pagination },
  data() {
    return {
      tableDatas: [],
      monitor: "pending",
      radio: "全部",
      listQuery: {
        total: 1,
        pageNumb: 1,
        pageSize: 10,
        pageSizes: [10, 20, 40, 60],
      },
      aliasList: [],
      currentTableDatas: [],
      loading: true,
      apiPublishPath: "",
      alias: "",
    };
  },
  methods: {
    async findApiBaseInfo() {
      const url = "/ApiManagerService/findApiBaseInfo";
      const { id } = this.$route.params;
      const data = [{ id }];
      return await gwApiRequest.post(url, JSON.stringify(data));
    },

    fetchAlias() {
      gwApiRequest({
        url: "/ApiManagerService/queryAlias",
        method: "post",
        data: JSON.stringify([{
          "pageSize": 50,
          "pageNumb": 1
        }, {
          id: this.$route.params.id
        }])
      })
        .then((resp) => {
          this.aliasList = [];
          const aliases = resp.data.list;
          if (aliases) {
            for (let i = 0; i < aliases.length; i++) {
              const aliasObject = {};
              aliasObject["key"] = aliases[i].alias;
              aliasObject["label"] = aliases[i].alias;
              this.aliasList.push(aliasObject);
            }
            this.allButtonFocus = true;
          }
          this.loading = false;
        })
        .catch((e) => {
          console.log(e);
          this.loading = false;
        });
    },

    async fetchApiInstance() {
      const { data } = await this.findApiBaseInfo().catch(() => {
        this.loading = false;
        throw new Error("fetchApiInstance findApiBaseInfo");
      });
      this.qualifiedName = data.qualifiedName;
      this.queryApiMonitor();
    },

    queryApiMonitor() {
      //--for test qualifiedName:com.jd.usf.service.UsfService
      //this.qualifiedName='com.jd.usf.service.UsfService'
      let url = "/apiInstance/apiMonitor";
      request({
        url: url,
        method: "get",
        params: {
          qualifiedName: this.qualifiedName,
          pageSize: this.listQuery.pageSize,
          pageNumb: this.listQuery.pageNumb,
          alias: this.alias,
        },
      })
        .then((rsp) => {
          this.monitor = "online";
          this.listQuery.total = rsp.data.total;
          this.tableDatas = rsp.data.list;
          this.currentTableDatas = this.tableDatas;
          this.fetchAlias();
        })
        .catch((e) => {
          this.monitor = "offline";
          console.log(e);
          this.loading = false;
        });
    },

    paginationChange(p) {
      this.listQuery.pageNumb = p.page;
      this.listQuery.pageSize = p.limit;
      this.queryApiMonitor();
    },

    onQueryByAlias() {
      if (this.radio === "全部") {
        this.alias = "";
        this.queryApiMonitor();
        this.currentTableDatas = this.tableDatas;
      } else {
        this.alias = this.radio;
        this.queryApiMonitor();
      }
    },

    rowClassName({ row, rowIndex }) {
      row.number = rowIndex + 1;
    },
  },
  mounted() {
    this.apiPublishPath =
      window.location.protocol +
      "//" +
      `${window.location.host}/#` +
      `${window.env.docApiPublish}`;
    this.fetchApiInstance();
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-radio-button__inner {
  font-weight: normal;
}
</style>
