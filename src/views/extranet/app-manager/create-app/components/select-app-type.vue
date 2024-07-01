<template>
  <div class="select-app-type">
    <el-table
      v-loading="loading"
      :data="table"
      :header-cell-style="{ 'text-align': 'left' }"
    >
      <el-table-column :label="$t('createApp.selectAppType.5ix5uebrh4c0')" min-width="2" prop="type" align="left">
      </el-table-column>
      <el-table-column :label="$t('createApp.selectAppType.5ix5uebrhqs0')" min-width="4" prop="desc" align="left">
        <template slot-scope="{ row }">
            <span v-if="row.authType===3">{{$t('createApp.selectAppType.5ix5uebrhw00')}}<el-button type="text" @click="goQualificationManagement">{{$t('createApp.selectAppType.5ix5uebrisc1')}}</el-button>】{{$t('createApp.selectAppType.5ix5uebrisc2')}}</span>
             <span v-if="row.authType===4">{{$t('createApp.selectAppType.5ix5uebrhw00')}}<el-button type="text" @click="goQualificationManagement">{{$t('createApp.selectAppType.5ix5uebrhz80')}}</el-button>】{{$t('createApp.selectAppType.5ix5uebrisc2')}}</span>
             <span v-if="row.authType===5">{{$t('createApp.selectAppType.5ix5uebrhw00')}}<el-button type="text" @click="goQualificationManagement">{{$t('createApp.selectAppType.5ix5uebri2g0')}}</el-button>】{{$t('createApp.selectAppType.5ix5uebrisc2')}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('createApp.selectAppType.5ix5uebri740')" min-width="2" align="left">
        <template slot-scope="{ row }">
          <span>
            <el-button
              type="text"
              :disabled="isDisabled(row.status)"
              @click="fillAppMessage(row.authType)"
              >{{$t('createApp.selectAppType.5ix5uebriaw0')}}</el-button
            >
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "SelectAppType",
  data() {
    return {
      table: [
        {
          authType: 3,
          type: this.$t('createApp.selectAppType.5ix5uebrisc3'),
          desc: this.$t('createApp.selectAppType.5ix5uebrifk0'),
          status: false,
        },
        {
          authType: 4,
          type: this.$t('createApp.selectAppType.5ix5uebrij40'),
          desc: this.$t('createApp.selectAppType.5ix5uebrim00'),
          status: false,
        },
        {
          authType: 5,
          type: this.$t('createApp.selectAppType.5ix5uebrip00'),
          desc: this.$t('createApp.selectAppType.5ix5uebrisc0'),
          status: false,
        },
      ],
      loading: false,
    };
  },
  methods: {
    /**
     * 获得当前用户可创建哪些应用
     */
    async getAuthData() {
      const url = "/user/getAuth";
      const method = "get";
      const response = await request({ url, method }).catch((error) => {
        throw error;
      });
      if (response.code === 20000) {
        for (let index1 = 0; index1 < response.data.length; index1++) {
          for (let index2 = 0; index2 < this.table.length; index2++) {
            if (
              response.data[index1].authType === this.table[index2].authType
            ) {
              this.table[index2].status = response.data[index1].status;
              break;
            }
          }
        }
      }
      this.loading = false;
    },
    /**
     * 创建应用按钮是否置灰
     */
    isDisabled(status) {
      if (status) {
        return false;
      }
      return true;
    },
    /**
     * 前往第二步，填写app的信息
     */
    fillAppMessage(authType){
    this.$emit("transferAuthType",authType)
    this.$emit("next")
  },
  goQualificationManagement(){
    this.$router.push({path:"/qualificationManagement"})
  }
  },
  mounted() {
    this.getAuthData();
  },

};
</script>

<style lang="scss" scoped>
.select-app-type {
  width: 72%;
  margin: 0 auto;
}
</style>
