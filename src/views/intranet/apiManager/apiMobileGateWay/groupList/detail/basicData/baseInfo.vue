<template>
  <div class="basic-info">
    <!-- 非编辑态基本信息 -->
    <el-form v-show="!editable" label-position="left" :model="{}">
      <!-- 描述信息 -->
      <Title text="描述信息" />
      <el-row class="row--offset">
        <el-col :span="8">
          <el-form-item label="中文名称：">
            <span>{{ basicInfoData.cnName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="描述：">
            <span>{{ basicInfoData.intr }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 分组内API的类型 -->
      <Title text="分组内API的类型" />
      <el-row class="row--offset">
        <el-col :span="8">
          <el-form-item label="API的发布范围：">
            <span v-if="basicInfoData.serviceType === 1"> 发布到内网 </span>
            <span v-if="basicInfoData.serviceType === 2"> 发布到公网 </span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="API的服务类型：">
            <span v-if="basicInfoData.type === 1"> JSF服务 </span>
            <span v-if="basicInfoData.type === 2"> HTTP服务 </span>
            <span v-if="basicInfoData.type === 3"> HTTP流 </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        v-if="basicInfoData.type === 2 || basicInfoData.type === 3"
        class="row--offset"
      >
        <!-- 根据环境展示集群表单项 -->
        <!-- 测试环境 -->
        <template
          v-if="env === 'local' || env === 'devtest' || env === 'publictest'"
        >
          <el-col :span="8">
            <el-form-item label="测试环境-集群：">
              <span>{{ basicInfoData.testCluster.name }}</span>
            </el-form-item>
          </el-col>
        </template>
        <!-- 预发、生产环境 -->
        <template v-else-if="env === 'uat' || env === 'prod'">
          <el-col :span="8">
            <el-form-item label="预发环境-集群：">
              <span>{{ basicInfoData.uatCluster.name }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生产环境-集群：">
              <span>{{ basicInfoData.prodCluster.name }}</span>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
      <!-- 负责人信息 -->
      <Title text="负责人信息" />
      <el-row class="row--offset">
        <el-col :span="8">
          <el-form-item label="产品负责人：">
            <span>{{ basicInfoData.productOwner }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="研发负责人：">
            <span>{{ basicInfoData.developOwner }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="运营负责人：">
            <span>{{ basicInfoData.operateOwner }}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 编辑态基本信息 -->
    <el-form
      v-show="editable"
      class="basic-info__editable-form"
      ref="basicInfoData"
      label-width="120px"
      :model="basicInfoData"
      :rules="basicInfoRules"
    >
      <!-- 描述信息 -->
      <Title text="描述信息" />
      <el-row class="row--offset">
        <el-col :span="8">
          <el-form-item label="中文名称" prop="cnName">
            <el-input
              v-model="basicInfoData.cnName"
              placeholder="请输入中文名称"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="描述" prop="intr">
            <el-input
              v-model="basicInfoData.intr"
              placeholder="请输入描述"
              type="textarea"
              :rows="1"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 分组内API的类型 -->
      <Title text="分组内API的类型" />
      <el-row class="row--offset">
        <el-col :span="8">
          <el-form-item
            v-if="!basicInfoData.isOnline"
            label="API的发布范围"
            prop="serviceType"
          >
            <el-radio-group v-model="basicInfoData.serviceType">
              <el-radio :label="1">发布到内网</el-radio>
              <el-radio :label="2">发布到公网</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-else label="API的发布范围">
            <span v-if="basicInfoData.serviceType === 1"> 发布到内网 </span>
            <span v-if="basicInfoData.serviceType === 2"> 发布到外网 </span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            v-if="!basicInfoData.isOnline"
            label="API的服务类型"
            prop="type"
          >
            <el-select
              v-model="basicInfoData.type"
              placeholder="HTTP服务"
              style="width: 100%"
            >
              <el-option
                v-for="item in typeOptionList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-else label="API的服务类型">
            <span v-if="basicInfoData.type === 1"> JSF服务 </span>
            <span v-if="basicInfoData.type === 2"> HTTP服务 </span>
            <span v-if="basicInfoData.type === 3"> HTTP流 </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        v-if="basicInfoData.type === 2 || basicInfoData.type === 3"
        class="row--offset"
      >
        <!-- 根据环境展示集群表单项 -->
        <!-- 测试环境 -->
        <template
          v-if="env === 'local' || env === 'devtest' || env === 'publictest'"
        >
          <el-col :span="8">
            <el-form-item label="测试环境-集群" prop="testCluster">
              <el-select
                v-model="basicInfoData.testCluster"
                :loading="testClusterLoading"
                :filterable="true"
                :remote="true"
                :remote-method="remoteTestCluster"
                value-key="id"
                placeholder="请输入集群的中文名称"
                style="width: 100%"
              >
                <el-option
                  v-for="item in testClusterOptionList"
                  :key="item.id"
                  :label="item.name"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button
              type="text"
              style="margin-left: 8px"
              @click="createClusterDialogVisible = true"
              >+创建集群</el-button
            >
          </el-col>
        </template>
        <!-- 预发、生产环境 -->
        <template v-else-if="env === 'uat' || env === 'prod'">
          <el-col :span="8">
            <el-form-item label="预发环境-集群" prop="uatCluster">
              <el-select
                v-model="basicInfoData.uatCluster"
                :loading="uatClusterLoading"
                :filterable="true"
                :remote="true"
                :remote-method="remoteUatCluster"
                value-key="id"
                placeholder="请输入集群的中文名称"
                style="width: 100%"
              >
                <el-option
                  v-for="item in uatClusterOptionList"
                  :key="item.id"
                  :label="item.name"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生产环境-集群" prop="prodCluster">
              <el-select
                v-model="basicInfoData.prodCluster"
                :loading="prodClusterLoading"
                :filterable="true"
                :remote="true"
                :remote-method="remoteProdCluster"
                value-key="id"
                placeholder="请输入集群的中文名称"
                style="width: 100%"
              >
                <el-option
                  v-for="item in prodClusterOptionList"
                  :key="item.id"
                  :label="item.name"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button
              type="text"
              style="margin-left: 8px"
              @click="createClusterDialogVisible = true"
              >+创建集群</el-button
            >
          </el-col>
        </template>
      </el-row>
      <!-- 负责人信息 -->
      <Title text="负责人信息" />
      <el-row class="row--offset">
        <el-col :span="8">
          <el-form-item label="产品负责人" prop="productOwner">
            <ErpPrincipal
              :showPopover="true"
              :formDataPrincipal.sync="basicInfoData.productOwner"
              :disabled="showStatus !== 1"
              placeholder="请输入产品负责人的ERP账号"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="研发负责人" prop="developOwner">
            <ErpPrincipal
              :showPopover="true"
              :formDataPrincipal.sync="basicInfoData.developOwner"
              :disabled="showStatus !== 1"
              placeholder="请输入研发负责人的ERP账号"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="运营负责人" prop="operateOwner">
            <ErpPrincipal
              :showPopover="true"
              :formDataPrincipal.sync="basicInfoData.operateOwner"
              :disabled="showStatus !== 1"
              placeholder="请输入运营负责人的ERP账号"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div>
      <el-row class="row--offset">
        <el-col :offset="11" :span="4">
          <el-button
            v-if="!editable"
            type="primary"
            @click="handleEdit"
            :disabled="editDisabled"
            >编辑</el-button
          >
          <div v-else class="button-wrapper">
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="handleSave">保存</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <CreateClusterDialog
      :createClusterDialogVisible.sync="createClusterDialogVisible"
    />
  </div>
</template>

<script>
import Title from "@/components/Title.vue";
import ErpPrincipal from "@/views/intranet/apiManager/components/ErpPrincipal.vue";
import basicInfo from "@/api/intranet/apiManager/httpDetail/basicInfo.js";
import CreateClusterDialog from "./createClusterDialog.vue";
import gwApiRequest from "@/utils/gwApiRequest";
export default {
  name: "BasicInfo",
  components: {
    Title,
    ErpPrincipal,
    CreateClusterDialog,
  },
  props: {
    baseInfo: Object,
    editDisabled: Boolean,
    showStatus: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      env: window.env.buildEnv,
      editable: false,
      basicInfoData: {
        id: 0,
        code: "",
        cnName: "",
        intr: "",
        type: 1,
        serviceType: 1,
        isOnline: 0,
        testCluster: {
          id: 0,
          name: "",
        },
        uatCluster: {
          id: 0,
          name: "",
        },
        prodCluster: {
          id: 0,
          name: "",
        },
        productOwner: "",
        developOwner: "",
        operateOwner: "",
      },
      typeOptionList: [
        { label: "HTTP服务", value: 2 },
        { label: "JSF服务", value: 1 },
        { label: "HTTP流", value: 3 },
      ],
      testClusterOptionList: [],
      testClusterLoading: false,
      uatClusterOptionList: [],
      uatClusterLoading: false,
      prodClusterOptionList: [],
      prodClusterLoading: false,
      //创建集群的弹框的控制
      createClusterDialogVisible: false,
      basicInfoRules: {
        cnName: [
          { required: true, message: "请输入中文名称" },
          {
            pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]*$/,
            message: "请输入中文、英文字母或数字",
          },
          {
            min: 2,
            max: 20,
            message: "请输入2到20个字符",
          },
        ],
        intr: [{ required: true, message: "请输入描述" }],
        type: [{ required: true, message: "请选择API的服务类型" }],
        serviceType: [{ required: true, message: "请选择API的发布范围" }],
        productOwner: [
          { required: true, message: "请输入产品负责人的ERP账号" },
        ],
        developOwner: [
          { required: true, message: "请输入研发负责人的ERP账号" },
        ],
        operateOwner: [
          { required: true, message: "请输入运营负责人的ERP账号" },
        ],
      },
    };
  },
  computed: {
    computeInitItemDisabled() {
      if (this.editable) {
        return this.showStatus === 1 ? false : true;
      } else {
        return true;
      }
    },
  },
  methods: {
    //一是为了校验生效，而是为了取消编辑时初始化用
    initBasicInfoData() {
      this.basicInfoData.id = this.baseInfo.id;
      this.basicInfoData.code = this.baseInfo.code;
      this.basicInfoData.cnName = this.baseInfo.cnName;
      this.basicInfoData.intr = this.baseInfo.intr;
      this.basicInfoData.type = this.baseInfo.type;
      this.basicInfoData.isOnline = this.baseInfo.isOnline;
      this.basicInfoData.serviceType = this.baseInfo.serviceType;
      this.basicInfoData.testCluster = this.baseInfo.testCluster;
      this.basicInfoData.uatCluster = this.baseInfo.uatCluster;
      this.basicInfoData.prodCluster = this.baseInfo.prodCluster;
      this.basicInfoData.productOwner = this.baseInfo.productOwner || "";
      this.basicInfoData.developOwner = this.baseInfo.developOwner || "";
      this.basicInfoData.operateOwner = this.baseInfo.operateOwner || "";
    },
    async queryList(name) {
      const data = { name, sceneType: 3 };
      return await basicInfo.queryList(data).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error(error);
      });
    },
    // 测试环境集群模糊搜索
    async remoteTestCluster(query) {
      if (query !== "") {
        this.testClusterLoading = true;
        const response = await this.queryList(query);
        let { data } = response;
        if (data && data.length > 0) {
          data = data.map((item) => {
            const id = item.id;
            const name = item.name;
            return { id, name };
          });
        }
        this.testClusterOptionList = data;
        this.testClusterLoading = false;
      } else {
        this.testClusterOptionList = [];
      }
    },
    // 预发环境集群模糊搜索
    async remoteUatCluster(query) {
      if (query !== "") {
        this.uatClusterLoading = true;
        const response = await this.queryList(query);
        let { data } = response;
        if (data && data.length > 0) {
          data = data.map((item) => {
            const id = item.id;
            const name = item.name;
            return { id, name };
          });
        }
        this.uatClusterOptionList = data;
        this.uatClusterLoading = false;
      } else {
        this.uatClusterOptionList = [];
      }
    },
    // 生产环境集群模糊搜索
    async remoteProdCluster(query) {
      if (query !== "") {
        this.prodClusterLoading = true;
        const response = await this.queryList(query);
        let { data } = response;
        if (data && data.length > 0) {
          data = data.map((item) => {
            const id = item.id;
            const name = item.name;
            return { id, name };
          });
        }
        this.prodClusterOptionList = data;
        this.prodClusterLoading = false;
      } else {
        this.prodClusterOptionList = [];
      }
    },
    //打开编辑
    handleEdit() {
      this.editable = true;
      this.initCluster();
    },
    initCluster() {
      this.testClusterOptionList = [this.basicInfoData.testCluster];
      this.uatClusterOptionList = [this.basicInfoData.uatCluster];
      this.prodClusterOptionList = [this.basicInfoData.prodCluster];

      console.log("this.testClusterOptionList", this.testClusterOptionList);
    },
    //取消编辑
    handleCancel() {
      this.editable = false;
      this.initBasicInfoData();
    },
    //保存编辑
    handleSave() {
      this.$refs["basicInfoData"].validate(async (valid) => {
        if (valid) {
          this.sumbit();
        } else {
          return false;
        }
      });
    },
    fillSumbitData() {
      let data = {
        id: this.basicInfoData.id,
        code: this.basicInfoData.code,
        name: this.basicInfoData.cnName,
        description: this.basicInfoData.intr,
        type: this.basicInfoData.type,
        serviceType: this.basicInfoData.serviceType,

        productOwner: this.basicInfoData.productOwner,
        developOwner: this.basicInfoData.developOwner,
        operateOwner: this.basicInfoData.operateOwner,
      };
      if (
        this.env === "local" ||
        this.env === "devtest" ||
        this.env === "publictest"
      ) {
        if (this.basicInfoData.testCluster.id > 0) {
          data.testClusterId = this.basicInfoData.testCluster.id;
          data.testClusterName = this.basicInfoData.testCluster.name;
        }
      }
      if (this.env === "uat" || this.env === "prod") {
        if (this.basicInfoData.uatCluster.id > 0) {
          data.uatClusterId = this.basicInfoData.uatCluster.id;
          data.uatClusterName = this.basicInfoData.uatCluster.name;
        }
        if (this.basicInfoData.prodCluster.id > 0) {
          data.prodClusterId = this.basicInfoData.prodCluster.id;
          data.prodClusterName = this.basicInfoData.prodCluster.name;
        }
      }
      return data;
    },
    sumbit() {
      const data = this.fillSumbitData();
      let url = "/CloudDomainService/fontSave";
      gwApiRequest
        .post(url, [{ ...data, sceneType: 3 }])
        .then((rsp) => {
          if (rsp.code === 20000) {
            this.$message.success(rsp.message);
          }
          this.$emit("refresh");
          this.editable = false;
          this.loading = false;
        })
        .catch((e) => {
          console.log(e);
          this.loading = false;
        });
    },
  },
  created() {
    this.initBasicInfoData();
    console.log(JSON.stringify(this.basicInfoData));
  },
};
</script>

<style lang="scss" scoped>
.basic-info {
  .basic-info__editable-form {
    .row--offset {
      padding-left: 12px;
    }
  }
}
</style>
