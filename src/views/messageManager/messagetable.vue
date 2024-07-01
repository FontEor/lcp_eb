<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-form
          :inline="true"
          :model="messageSearchForm"
          @submit.native.prevent
        >
          <el-form-item>
            <el-input
              :placeholder="$t('messageManager.messagetable.5ix0noe2a000')"
              v-model="messageSearchForm.queryName"
              style="width: 350px"
              v-on:input="onSearchChange"
              v-on:keyup.enter.native="search"
            />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="search">{{
              $t("messageManager.messagetable.5ix0noe2bys0")
            }}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div>
      <el-table :data="messgeTableData" :row-class-name="rowClassName">
        <el-table-column
          :label="$t('messageManager.messagetable.5ix0noe2c8w0')"
          prop="number"
          align="center"
        />
        <el-table-column
          :label="$t('messageManager.messagetable.5ix0noe2cf00')"
          prop="title"
        />
        <el-table-column
          :label="$t('messageManager.messagetable.5ix0noe2cm80')"
          prop="createTime"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.createTime | parseTimefilter("{y}-{m}-{d} {h}:{i}")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('messageManager.messagetable.5ix0noe2ct00')"
          prop="isRead"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.isRead == 0" style="color: red">{{
              $t("messageManager.messagetable.5ix0noe2cyc0")
            }}</span>
            <span v-if="scope.row.isRead == 1" style="color: #37b328">{{
              $t("messageManager.messagetable.5ix0noe2d4c0")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('messageManager.messagetable.5ix0noe2dis0')"
          prop="id"
        >
          <template slot-scope="scope">
            <el-button type="text" v-on:click="viewInfo(scope.row)">{{
              $t("messageManager.messagetable.5ix0noe2e0s0")
            }}</el-button>
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
            v-on:pagination="paginationChange"
            style="margin: 0px; float: right"
          />
        </el-col>
      </el-row>
    </div>
    <el-dialog
      v-if="centerDialogVisible"
      :title="showTitle"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
    >
      <div style="height: 300px; overflow-y: scroll">
        <MarkdownPreview
          v-if="showContent"
          v-model="showContent"
          class="markdown-preview"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false"
          >{{ $t("messageManager.messagetable.5ix0noe2e840") }}
          {{ $t("messageManager.messagetable.5ix0noe2grk0") }}</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination/index.vue";
import request from "@/utils/request";
import { parseTime } from "@/utils";
import { mapGetters } from "vuex";
import MarkdownPreview from "@/components/MarkdownPreview/index.vue";
export default {
  props: {
    msgType: "",
  },
  components: { Pagination, MarkdownPreview },
  data() {
    return {
      centerDialogVisible: false,
      showTitle: "",
      showContent: "",
      messgeTableData: [],
      messageSearchForm: {
        queryName: "",
      },
      listQuery: {
        searchKeyWord: "",
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
  created() {
    this.paginationChange();
  },
  computed: {
    ...mapGetters(["msgCount"]),
  },
  methods: {
    /**
     * 查询
     */
    search() {
      this.paginationChange();
    },
    /**
     * 分页修改查询
     */
    paginationChange() {
      let url = "/message/getMsgSignList";
      let reqparams = {};
      reqparams.pageSize = this.listQuery.pageSize;
      reqparams.pageNumb = this.listQuery.pageNumb;
      reqparams.msgType = this.msgType;
      reqparams.title = this.messageSearchForm.queryName;
      request({
        url: url,
        method: "get",
        params: reqparams,
      })
        .then((rsp) => {
          if (rsp.code === 20000) {
            this.listQuery.total = rsp.data.total;
            this.messgeTableData = rsp.data.list;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    /**
     * 查看信息
     */
    viewInfo(row) {
      this.showTitle = row.title;
      let isRead = row.isRead;
      let url = "/message/modifyMsgSignRead";
      request({
        headers: {
          "Content-Type": "application/json",
        },
        url: url,
        method: "post",
        data: {
          messageId: row.messageId,
          id: row.id,
        },
      })
        .then((rsp) => {
          if (rsp.code === 20000) {
            this.centerDialogVisible = true;
            if (isRead == 0) {
              this.$store.dispatch("user/setMsgCount", this.msgCount - 1);
            }
            this.showContent = rsp.data;
          }
          this.paginationChange();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    /**
     * 行号
     */
    rowClassName({ row, rowIndex }) {
      row.number = rowIndex + 1;
    },
    /**
     * 判断是否为空
     */
    onSearchChange() {
      if (this.messageSearchForm.queryName.trim().length === 0) {
        this.search();
      }
    },
  },
};
</script>
<style scoped>
</style>
