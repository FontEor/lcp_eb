<template>
  <article class="development-info">
    <div class="development-info__container">
      <Title text="应用信息" />
      <el-row class="container__row" tag="section">
        <el-col :span="12" tag="p">
          <span class="row__label">appKey：</span>
          <span>{{ appKey }}</span>
          <el-button
            v-clipboard="appKey"
            v-clipboard:success="($event) => onCopySuccess($event, 'appKey')"
            type="text"
            icon="el-icon-document-copy"
          />
        </el-col>
        <el-col :span="12" tag="p">
          <span>appSecret：</span>
          <span>{{ appSecret | formatAppSecretText(appSecretVisible) }}</span>
          <el-button
            v-if="appSecretVisible"
            v-clipboard="appSecret"
            v-clipboard:success="($event) => onCopySuccess($event, 'appSecret')"
            type="text"
            icon="el-icon-document-copy"
          />
          <el-button
            type="text"
            :icon="appSecretVisible | formatAppSecretIconText"
            @click="appSecretVisible = !appSecretVisible"
          />
        </el-col>
      </el-row>
    </div>
    <div class="development-info__container">
      <Title text="调用信息" />
      <el-row class="container__row" tag="section">
        <el-col :span="12" tag="p">
          <span class="row__label">沙箱环境调用地址：</span>
          <span>{{ sandboxAddress }}</span>
        </el-col>
        <el-col :span="12" tag="p">
          <span>
            access token
            <el-tooltip :content="accessTokenToolTip" placement="top">
              <i class="el-icon-help" />
            </el-tooltip>
            ：
          </span>
          <span>{{ accessToken }}</span>
          <el-button
            v-clipboard="accessToken"
            v-clipboard:success="
              ($event) => onCopySuccess($event, 'access token')
            "
            type="text"
            icon="el-icon-document-copy"
          />
        </el-col>
      </el-row>
      <el-row class="container__row" tag="section">
        <el-col :span="12" tag="p">
          <span class="row__label">
            对接方案编码
            <el-tooltip :content="lopDnToolTip" placement="top">
              <i class="el-icon-help" />
            </el-tooltip>
            ：
          </span>
          <span>{{ lopDn }}</span>
          <el-button
            v-clipboard="lopDn"
            v-clipboard:success="
              ($event) => onCopySuccess($event, '对接方案编码')
            "
            type="text"
            icon="el-icon-document-copy"
          />
        </el-col>
        <el-col :span="12" tag="p">
          <span> refresh token： </span>
          <span>{{ refreshToken }}</span>
          <el-button
            v-clipboard="refreshToken"
            v-clipboard:success="
              ($event) => onCopySuccess($event, 'refresh token')
            "
            type="text"
            icon="el-icon-document-copy"
          />
        </el-col>
      </el-row>
      <el-row class="container__row" tag="section">
        <el-col :span="12" tag="p">
          <span class="row__label">
            customerCode
            <el-tooltip :content="customerCodeToolTip" placement="top">
              <i class="el-icon-help" />
            </el-tooltip>
            ：
          </span>
          <span>{{ customerCode }}</span>
          <el-button
            v-clipboard="customerCode"
            v-clipboard:success="
              ($event) => onCopySuccess($event, 'customerCode')
            "
            type="text"
            icon="el-icon-document-copy"
          />
        </el-col>
      </el-row>
    </div>
  </article>
</template>

<script>
import Title from "@/components/Title.vue";

export default {
  name: "DevelopmentInfo",
  components: { Title },
  data() {
    return {
      appKey: "19a6a2043fbb47aab02f486bef654ab7",
      appSecret: "bafbc6db027d496da35dcb7b5d8ade59",
      appSecretVisible: false,
      sandboxAddress: "https://test-api.jdl.cn",
      accessTokenToolTip:
        "access_token是京东物流签约商家授权后平台颁发给应用所有者的标识商家身份的令牌，在API调用时需要将access_token放在url参数里传递给物流开放平台。（2123-05-17 15:26:18 到期）",
      accessToken: "96c416d624ec435696412e008c897470",
      refreshToken: "0da1e57164ee4cedbcbf4159d706670b",
      customerCodeToolTip:
        "商家编码/青龙业主号/配送编码/月结编码，与京东物流签约后生成。",
      customerCode: "27K1234912",
      lopDnToolTip: "订阅的对接方案编码，在使用非SDK调用API时需要填写。",
      lopDn: "express",
    };
  },
  filters: {
    formatAppSecretText(appSecret, appSecretVisible) {
      return appSecretVisible
        ? appSecret
        : Array(appSecret.length).fill("*").join("");
    },
    formatAppSecretIconText(appSecretVisible) {
      return appSecretVisible ? "el-icon-view-close" : "el-icon-view";
    },
  },
  methods: {
    onCopySuccess(_, field) {
      this.$message.success(`${field || "字段内容"}已复制`);
    },
  },
};
</script>

<style lang="scss" scoped>
.development-info {
  .development-info__container {
    margin-bottom: 16px;
    padding: 16px;
    background: #f9f9f9;

    .title {
      margin-bottom: 12px;
    }

    .container__row {
      .row__label {
        margin-left: 12px;
      }

      .el-button {
        margin-left: 8px;
      }

      .el-icon-help {
        color: #3c6ef0;
      }
    }
  }
}
</style>