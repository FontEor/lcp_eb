<template>
  <article
    v-loading="loading"
    :class="{
      'sandbox-debugging': true,
      'app-container': true,
      authenticated: authenticated,
      unauthenticated: !authenticated,
    }"
  >
    <template v-if="authenticated">
      <Alert>
        <template #title>
          <span
            >业务联调工具是协助开发者进行接口开发及主要功能联调的模拟工具，你可直观看到自身系统与物流系统的调用结果。在完成联调后，请务必在【开发管理】中创建生产环境应用，并进行完整的功能验收测试。</span
          >
          <Link href="//cloud.jdl.com/#/devSupport/54046" target="_blank"
            >查看功能介绍</Link
          >
        </template>
      </Alert>
      <el-table
        class="sandbox-debugging__table"
        :data="sandboxDebuggingTableData"
      >
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column
          v-for="{ label, prop, width, minWidth } in tableColumnList"
          :key="prop"
          :label="label"
          :prop="prop"
          :width="width"
          :min-width="minWidth"
        />
        <el-table-column label="操作" width="160">
          <template v-slot="{ row: { scene, activeName, href } }">
            <el-button
              type="text"
              :clstag="clstag('', 'sandboxDebugging_1654829332256|1')"
              @click="
                $router.push({
                  name: 'SandboxDebuggingOverview',
                  params: { scene, activeName },
                })
              "
              >进入联调</el-button
            >
            <Link
              class="cell__link"
              target="_blank"
              :href="href"
              :clstag="clstag('', 'sandboxDebugging_1654829332256|2')"
              >查看文档</Link
            >
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template v-else>
      <div class="sandbox-debugging__empty-image"></div>
      <p class="sandbox-debugging__tip">
        完成团队资质认证后，即可进行业务联调
      </p>
      <el-row type="flex" justify="center">
        <el-button
          type="primary"
          @click="$router.push({ name: 'Qualification' })"
          >前往资质认证</el-button
        >
      </el-row>
    </template>
  </article>
</template>

<script>
import Alert from "@/components/Alert.vue";
import Link from "@/components/Link.vue";
import buriedPoint from "@/mixins/buriedPoint.js";
import { mapState } from "vuex";
import lcp from "@/api/extranet/lcp/index.js";

export default {
  name: "SandboxDebugging",
  components: { Alert, Link },
  mixins: [buriedPoint],
  data() {
    return {
      loading: true,
      authenticated: false,
      tableColumnList: [
        { label: "联调场景", prop: "sceneName", width: "200" },
        { label: "场景说明", prop: "explanation", minWidth: "160" },
      ],
    };
  },
  computed: {
    ...mapState("sandboxDebugging", ["sandboxDebuggingTableData"]),
  },
  methods: {
    // 获取账号资质认证状态
    async getQualificationStatus() {
      return await lcp.supplierIsv.getQualificationStatus().catch((error) => {
        throw new Error(`getQualificationStatus, ${error}`);
      });
    },

    async handleGetQualificationStatus() {
      this.loading = true;
      const { data = [] } = await this.getQualificationStatus().catch(
        (error) => {
          throw new Error(`handleGetQualificationStatus, ${error}`);
        }
      );
      this.authenticated =
        data instanceof Array && data.some(({ status }) => status === 3);
      this.loading = false;
    },
  },
  async created() {
    await this.handleGetQualificationStatus().catch((error) => {
      throw new Error(`created, ${error}`);
    });
  },
};
</script>

<style lang="scss" scoped>
.sandbox-debugging {
  &.authenticated {
    .sandbox-debugging__table {
      margin-top: 16px;

      .cell__link {
        margin-left: 8px;
        font-weight: 500;
      }
    }
  }

  &.unauthenticated {
    .sandbox-debugging__empty-image {
      margin: 8px auto;
      width: 640px;
      height: 320px;
      background-image: url("~@/assets/images/empty.png");
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
    }

    .sandbox-debugging__tip {
      margin-bottom: 8px;
      text-align: center;
    }
  }
}
</style>