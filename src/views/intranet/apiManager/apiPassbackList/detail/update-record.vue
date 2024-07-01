<template>
  <div class="update-record">
    <el-timeline>
      <el-timeline-item
        v-for="(
          { createTime, updateUser, approveUser, pluginConfig }, index
        ) in recordList"
        :key="index"
        :timestamp="createTime"
        placement="top"
      >
        <el-card style="width: 90%">
          <p>
            <span>更新人：</span>
            <span>{{ updateUser }}</span>
          </p>
          <p>
            <span>审批人：</span>
            <span>{{ approveUser }}</span>
          </p>
          <template v-if="pluginConfig">
            <p>安全配置：</p>
            <p style="margin-left: 2em">传输加密——平台通用加密：</p>
            <p style="margin-left: 4em">
              <span>加解密内容</span>
              <span style="margin-left: 2em">请求报文加密：</span>
              <span>{{
                pluginConfig.ciphertext.isReqEncrypt ? "开" : "关"
              }}</span>

              <span style="margin-left: 4em">响应报文加密：</span>
              <span>{{
                pluginConfig.ciphertext.isRespDecrypt ? "开" : "关"
              }}</span>
            </p>

            <p style="margin-left: 4em">
              <span>加密算法</span>
              <span style="margin-left: 3em">算法名称：</span>
              <span>{{ pluginConfig.cipher.algorithm.name }}</span>

              <span style="margin-left: 5em">加密模式：</span>
              <span>{{ pluginConfig.cipher.algorithm.mode }}</span>
            </p>
            <p style="margin-left: 8em">
              <span style="margin-left: 3em">加密块位数：</span>
              <span>{{ pluginConfig.cipher.algorithm.blockSize }}</span>

              <span style="margin-left: 4em">密钥位数：</span>
              <span>{{ pluginConfig.cipher.algorithm.keySize }}</span>
            </p>
            <p style="margin-left: 8em">
              <span style="margin-left: 3em">填充模式：</span>
              <span>{{ pluginConfig.cipher.algorithm.paddingMode }}</span>
            </p>

            <p style="margin-left: 4em">
              <span>密码来源</span>
              <span style="margin-left: 3em">密文来源：</span>
              <span>{{
                pluginConfig.cipher.source.type === 1
                  ? "HTTP请求头"
                  : pluginConfig.cipher.source.type === 2
                  ? "URL参数  "
                  : ""
              }}</span>

              <span style="margin-left: 1em">密文字段名：</span>
              <span>{{ pluginConfig.cipher.source.name }}</span>
            </p>
          </template>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import gateway from "@/api/intranet/gateway/index.js";

export default {
  name: "UpdateRecord",
  data() {
    return {
      apiId: parseInt(this.$route.params.id),
      recordList: [],
    };
  },
  methods: {
    // 查询回传API更新记录列表接口
    async findChangeRecordList() {
      const { apiId } = this;
      const outerDomainApiRecordCondition = { apiId };
      const data = [outerDomainApiRecordCondition];
      return gateway.OuterDomainApiService.findChangeRecordList(data);
    },

    // 查询回传API更新记录列表接口调用
    async handleFindChangeRecordList() {
      const {
        data: { rows },
      } = await this.findChangeRecordList().catch((error) => {
        console.error("handleFindChangeRecordList");
        throw error;
      });
      this.recordList = Array.isArray(rows)
        ? rows.map((item) => {
            let { createTime, pluginConfig } = item;
            createTime = this.$dayjs(createTime).format("YYYY-MM-DD HH:mm:ss");
            try {
              const [config] = JSON.parse(pluginConfig);
              pluginConfig = JSON.parse(config.pluginConfig);
            } catch (error) {
              pluginConfig = null;
            }
            return { ...item, createTime, pluginConfig };
          })
        : [];
    },
  },
  async created() {
    await this.handleFindChangeRecordList().catch((error) => {
      console.error("created");
      throw error;
    });
  },
};
</script>

<style lang="scss" scoped>
// .update-record {
// }
</style>
