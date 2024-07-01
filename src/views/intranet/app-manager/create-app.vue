<template>
  <div class="new-app">
    <steps v-bind="stepsObj" class="new-app__steps" />
    <div class="new-app__main">
      <p class="main__tip">
        若您想申请使用API或发布API，可创建【京东内网应用】类型的应用；
      </p>
      <p class="main__tip">
        若您想对软件系统的标准功能进行定制化开发，实现或增加个性化逻辑，可创建对应软件系统类型的应用。
      </p>
      <el-table
        v-loading="loading"
        :data="table.data"
        :hide-empty-img="true"
        :stripe="true"
        style="width: 100%"
      >
        <el-table-column
          v-for="(item, index) in table.columnList"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          :show-overflow-tooltip="true"
          align="center"
        >
          <template slot-scope="{ row }">
            <span
              :class="{
                normalColor:
                  item.prop === 'status' && row.status === '认证通过',
                unknownColor: item.prop === 'status' && row.status === '未认证',
              }"
              >{{ row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="{ row }">
            <span v-if="row.status === '认证通过'">
              <el-button type="text" :disabled="row.hadApp" @click="addApp(row)"
                >创建应用</el-button
              >
            </span>
            <span v-else-if="row.status === '未认证'">
              <el-button type="text" @click="gotoAuth(row.authType)"
                >去认证</el-button
              >
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import steps from "@/components/steps/index.vue";
import appManager from "@/api/intranet/appManager/index.js";

export default {
  name: "NewApp",
  components: {
    steps,
  },
  data() {
    return {
      stepsObj: {
        active: 0,
        title: "创建应用",
        tiptitle: ["选择应用类型", "填写信息", "完成"],
      },
      loading: true,
      table: {
        data: [],
        columnList: [
          { label: "应用类型", prop: "authType" },
          { label: "描述", prop: "desc" },
          { label: "状态", prop: "status" },
        ],
        authTypeTable: [
          "",
          "京东内网应用",
          "京东外网应用",
          "ISV应用",
          "商家自研应用",
          "合作伙伴应用",
        ],
        descTable: [
          "",
          "运行在京东内网环境下的应用，例如京东物流开放平台，仅能由京东内部开发者创建",
          "运行在京东外网环境下的应用，例如京东快递小程序，仅能由京东内部开发者创建",
          "开发软件，为商家提供软件服务，如订单、财务等",
          "拥有研发能力的商家，自行研发软件，管理商品、订单、库存等信息",
          "平台的合作企业可创建此应用，用于订购合作伙伴对接方案",
        ],
        statusTable: ["未认证", "认证通过"],
      },
    };
  },
  methods: {
    // 创建应用查询应用类型列表
    async getAuth() {
      return appManager.getAuth().catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("getAuth");
      });
    },
    // 查询软件系统二次开发类型应用
    async findSecondDevProductList() {
      return appManager.findSecondDevProductList().catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("findSecondDevProductList");
      });
    },

    // 查询应用类型列表
    async getAuthData() {
      this.loading = true;
      const response = await this.getAuth().catch(() => {
        throw new Error("getAuthData");
      });
      const { data } = response.data;
      this.table.data = data.map((item) => {
        const authType = this.table.authTypeTable[item.authType];
        const desc = this.table.descTable[item.authType];
        const status = item.status
          ? this.table.statusTable[1]
          : this.table.statusTable[0];
        return { authType, desc, status };
      });
      this.loading = false;
    },
    // 查询应用类型列表
    async getSecondDevProductListData() {
      this.loading = true;
      const response = await this.findSecondDevProductList().catch(() => {
        throw new Error("getSecondDevProductListData");
      });
      const { data } = response.data;
      this.table.data = this.table.data.concat(
        data.map((item) => {
          const { id, productCode, name, description, hadApp } = item;
          const authType = name;
          const desc = description;
          const status = "认证通过";
          return { id, productCode, authType, desc, status, hadApp };
        })
      );
      this.loading = false;
    },

    addApp(row) {
      const { id, productCode, authType } = row;
      // 目前表格数据中只有支持二次开发的应用包含productCode
      if (productCode) {
        this.$router.push({
          name: "AppManagerCreateSecondaryDevelopmentApp",
          params: { productCode, id },
        });
      } else {
        const type = this.table.authTypeTable.indexOf(authType);
        const query = { type };
        const name = "AppManagerCreateAppFillInIno";
        this.$router.push({
          name,
          query,
        });
      }
    },
    gotoAuth(authType) {
      const routerTable = [
        "",
        "",
        "",
        "IsvManager",
        "SupplierManager",
        "PartnerManager",
      ];
      const type = this.table.authTypeTable.indexOf(authType);
      this.$router.push(routerTable[type]);
    },
  },
  async created() {
    await this.getAuthData();
    await this.getSecondDevProductListData();
  },
};
</script>

<style lang="scss" scoped>
.new-app {
  margin: 0 20px;
  padding: 20px;
  background: #fff;
  min-height: calc(100vh - 120px);
  .new-app__steps {
    ::v-deep .my-step-bar {
      margin-bottom: 16px;
    }
  }
  .new-app__main {
    width: 90%;
    margin: 0 auto;

    .main__tip {
      margin: 8px;
      text-align: center;
    }
  }
}
</style>
