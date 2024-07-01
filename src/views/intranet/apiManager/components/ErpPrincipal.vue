<template>
  <div class="erp-principal">
    <el-popover
      v-model="principalVisible"
      placement="top-start"
      width="280"
      popper-class="erp-info-popover"
    >
      <div class="content-wrapper">
        <i class="el-icon-info" />
        <p class="text">
          【{{
            formDataPrincipal
          }}】不在您的团队下，为了不影响接口审批，建议去【个人中心】将该用户拉入您的团队。
        </p>
      </div>
      <div class="button-wrapper">
        <el-button type="primary" size="mini" @click="principalVisible = false"
          >我知道了</el-button
        >
      </div>
      <span slot="reference"></span>
    </el-popover>
    <el-select
      v-model="dataPrincipal"
      :loading="principalLoading"
      :filterable="true"
      :remote="true"
      :remote-method="remotePrincipal"
      :placeholder="placeholder"
      :disabled="disabled"
      value-key="userName"
      popper-class="erp-info-dropdown__list"
      style="width: 100%"
      @change="changePrincipal"
    >
      <el-option
        v-for="item in principalOptionList"
        :key="item.userName"
        :label="item.userName"
        :value="item.userName"
      >
        <div class="photo-wrapper">
          <img :src="item.headImg" style="width: 32px; height: 32px" />
        </div>
        <div class="info-wrapper">
          <p class="name">{{ item.userName }}（{{ item.realName }}）</p>
          <p class="organization">
            {{ item.organizationFullName }}
          </p>
        </div>
      </el-option>
    </el-select>
  </div>
</template>

<script>
import basicInfo from "@/api/intranet/apiManager/httpDetail/basicInfo.js";

export default {
  name: "ErpPrincipal",
  props: {
    showPopover: {
      type: Boolean,
      default: false,
    },
    formDataPrincipal: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: "请输入负责人的ERP账号",
    },
    disabled: { type: Boolean, default: false },
  },
  data() {
    return {
      dataPrincipal: "",
      principalVisible: false,
      principalLoading: false,
      principalOptionList: [],
    };
  },
  watch: {
    formDataPrincipal: {
      handler(value) {
        this.dataPrincipal = value;
      },
      immediate: true,
    },
  },
  methods: {
    async findUser(erp) {
      const params = { erp };
      return await basicInfo.findUser(params).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error(message);
      });
    },
    async findSupplierUserByErp(erp) {
      const params = { erp };
      return await basicInfo.findSupplierUserByErp(params).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error(error);
      });
    },

    // 负责人改变时
    async changePrincipal(value) {
      this.$emit("update:formDataPrincipal", value);
      if (this.showPopover) {
        const response = await this.findSupplierUserByErp(value);
        const { data } = response.data;
        if (!data) {
          this.principalVisible = true;
        } else {
          this.principalVisible = false;
        }
      }
    },
    // 负责人模糊搜索
    async remotePrincipal(query) {
      if (query !== "") {
        this.principalLoading = true;
        const response = await this.findUser(query);
        const { data } = response.data;
        this.principalOptionList = data;
        this.principalLoading = false;
      } else {
        this.principalOptionList = [];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.erp-principal {
}

// 渲染在body下的元素
.erp-info-dropdown__list {
  .el-select-dropdown__item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: auto;
    .photo-wrapper {
      margin: 8px;
      border-radius: 50%;
      overflow: hidden;
    }
    .info-wrapper {
      margin-left: 8px;
      line-height: 1.5;
      .organization {
        color: #666;
        font-size: 12px;
      }
    }
  }
}
.erp-info-popover {
  .content-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-icon-info {
      margin: 8px;
      color: red;
      font-size: 16px;
    }
  }
  .button-wrapper {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>