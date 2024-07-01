<template>
  <div style="padding:0px" meta="x:216.0,y:81.0,width:600.0,height:321.0">
    <span v-if="this.nodata==='no'" key="1">
    <el-table
      :data="tableDatas"
      meta="x:37.0,y:57.0,width:901.0,height:216.0"
      :row-class-name="rowClassName"
      class="my-table mb2"
    >
      <el-table-column label="开发商" prop="supplierName" align="center"/>
      <el-table-column label="APPKey" prop="appKey" align="center"
                       :show-tooltip-when-overflow="true"/>
      <el-table-column label="应用中文名称" prop="appName" align="center"
                       :show-tooltip-when-overflow="true"/>
      <el-table-column label="TPS" prop="tps" align="center"/>
      <el-table-column label="申请人" prop="applyUserName" align="center" />
      <el-table-column label="已分配别名" prop="id" align="center">
        <template slot-scope="scope">
<!--          <ServiceAliasList ref="serviceAliasList" :id="scope.row.id"></ServiceAliasList>-->
          <div style="text-align: center; margin: 0;">
            <el-tag :key="tag.serviceAliasId" v-for="tag in scope.row.applyInterfaceAliasList" size="mini" style="margin-left: 5px; float: left">{{tag.alias}}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="id" align="center">
         <template slot-scope="scope">
          <ChooseServiceAlias ref="chooseServiceAlias" content="请添加别名" :id="scope.row.id" ></ChooseServiceAlias>
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
      style="float:right"
      v-on:pagination="paginationChange"
    />
    </el-col>
    </el-row>
    </span>
    <span style="display:none"  id="displayapicall">
        <div style="margin-top: 0px;text-align: center"><img src="@/assets/img/noData.png" style="width:316px;height:200px"></div>
          <div class="noDataMessage">暂无调用方~
        </div>
    </span>
  </div>
</template>
<script>
  import Pagination from "@/components/Pagination/index.vue";
  // import ServiceAliasList from "@/views/devManager/api/manager/components/ServiceAliasList.vue";
  import ChooseServiceAlias from "@/views/devManager/api/manager/components/ChooseServiceAlias.vue";
  import gwApiRequest from "@/utils/gwApiRequest.js";

  export default {
    components: {Pagination,ChooseServiceAlias},
    data() {
      return {
        tableDatas: [],
        listQuery: {
          total: 1,
          pageNumb: 1,
          pageSize: 10,
          pageSizes: [10, 20, 40, 60]
        },
        nodata:'yes'
      }
    },
    created() {
      this.paginationChange()
    },
    methods: {
      queryApi() {
        gwApiRequest({
          url: "/ApiManagerService/queryApiApply",
          method: "post",
          data: JSON.stringify([{
            id: this.$route.params.id
          }, {
            pageSize:this.listQuery.pageSize,
            pageNumb:this.listQuery.pageNumb
          }])
        })
        .then(rsp=>{
          let total = rsp.data.total;
          if (total === 0) {
            document.getElementById("displayapicall").style.display = '';
            this.nodata = 'yes'
          } else {
            document.getElementById("displayapicall").style.display = 'none';
            this.nodata = 'no'
            this.listQuery.total = rsp.data.total
            this.tableDatas = rsp.data.list
          }
        }).catch(e=>{
          console.log(e)
        })
      },
      paginationChange() {
        this.queryApi()
        console.log("-------------->翻页:" + this.listQuery.pageNumb)
      },
      rowClassName({row, rowIndex}) {
        row.number = rowIndex + 1
      }
    }
  }
</script>

<style>
  .noDataMessage {
    width: 100%;
    margin: 0 auto;
    margin-top: 0px;
    text-align: center;
    vertical-align: middle
  }
</style>
