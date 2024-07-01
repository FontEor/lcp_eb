<template>
  <div>
    <el-row>
      <el-col :offset="2" :span="20">
        开通之后，若客户端不存在该软件系统或租户则会先进行创建，然后再将资源下发至软件系统；若客户端已存在该租户和软件系统，则仅将本次变更的资源下发至所选的环境。
      </el-col>
    </el-row>
    <br />
    <el-row>
      <el-col :offset="2" :span="6">
        <span style="font-weight: bold">请选择开通环境:</span>
      </el-col>
    </el-row>
    <br />
    <div v-for="item in environment" :key="item.id">
      <el-row>
        <el-col :offset="3" :span="16">
          <el-checkbox-group v-model="checkList">
            <div>
              <el-tooltip
                v-if="isDisabled(item.id)"
                class="item"
                effect="dark"
                content="当前版本已开通或正在开通该环境"
                placement="bottom-start"
              >
                <el-checkbox :label="item.id" disabled
                  >{{ item.name }}
                </el-checkbox>
              </el-tooltip>
              <el-checkbox :label="item.id" v-else
                >{{ item.name }}
              </el-checkbox>
            </div>
          </el-checkbox-group>
          <div>
            <span style="color: #999">({{ item.description }})</span>
          </div>
        </el-col>
      </el-row>
      <br />
    </div>
    <div class="select-env-btn">
      <span class="dialog-footer" slot="footer">
        <el-button v-on:click="back" type="default">上一步</el-button>
        <el-button type="primary" v-on:click="next">开通</el-button>
      </span>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";

export default {
  props: {
    systemMessage: Object,
    tenementInfo: Object,
    subscribeVersionForm: Object,
  },
  data() {
    return {
      //选择环境的id列表
      checkList: [],
      //环境列表
      environment: [],
      //需要置灰的候选列表id
      disabledEnvId: [],
    };
  },
  methods: {
    onCancel() {
      this.$emit("onCancel");
    },
    next() {
      console.log("environment", this.environment);
      console.log("checkList", this.checkList);
      if (this.checkList.length < 1) {
        this.$message.error("请选择要开通的环境");
        return;
      }
      for (let index = 0; index < this.checkList.length; index++) {
        console.log(index, "次");
        this.openVersion(this.checkList[index]);
      }
      this.$emit("next");
    },
    back() {
      this.$emit("back");
    },
    /**
     * 获得环境的列表
     */
    getEnvironment() {
      let url = "/product/env/get";
      request({
        url: url,
        method: "get",
        params: {
          productId: this.systemMessage.id,
          type: "USF",
        },
      })
        .then((rsp) => {
          console.log("从后端获得环境", rsp);
          for (let index = 0; index < rsp.data.length; index++) {
            this.environment.push({
              id: rsp.data[index].id,
              name: rsp.data[index].name,
              description: rsp.data[index].description,
            });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    /**
     * 获得禁止开通的环境，用于置灰选项
     */
    getProhibitedEnvironment() {
      let url = "/saas/system/tenement/version/activate/activatedEnvs";
      request({
        url: url,
        method: "get",
        params: {
          productId: this.systemMessage.id,
          tenementId: this.tenementInfo.id,
        },
      })
        .then((rsp) => {
          //下面就是需要置灰
          console.log("查询正在开通和已经开通的环境", rsp);
          for (let index = 0; index < rsp.data.length; index++) {
            this.disabledEnvId.push(rsp.data[index].id);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    /**
     * 是否置灰选框
     */
    isDisabled(id) {
      for (let index = 0; index < this.disabledEnvId.length; index++) {
        if (this.disabledEnvId[index] === id) {
          return true;
        }
      }
      return false;
    },
    /**
     * 开通
     */
    openVersion(envId) {
      let url = "/saas/system/tenement/version/activate/open";
      request({
        url: url,
        method: "post",
        data: {
          productId: this.systemMessage.id,
          tenementId: this.tenementInfo.id,
          versionId: this.subscribeVersionForm.versionId,
          envId: envId,
          remark: this.subscribeVersionForm.remark,
        },
      })
        .then((rsp) => {})
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted() {
    this.getProhibitedEnvironment();
    this.getEnvironment();
    console.log("subscribeVersionForm", this.subscribeVersionForm);
  },
};
</script>
<style lang="scss" scoped>
.select-env-btn {
  display: flex;
  justify-content: flex-end;
}
</style>