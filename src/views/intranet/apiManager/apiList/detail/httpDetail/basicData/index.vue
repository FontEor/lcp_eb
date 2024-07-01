<template>
  <div class="basic-info">
    <!-- 非编辑态基本信息 -->
    <el-form
      v-show="!editable"
      class="basic-info__not-editable-form"
      label-width="120px"
      label-position="left"
      :model="{}"
    >
      <!-- 描述信息 -->
      <Title text="描述信息" />
      <el-row class="row--offset">
        <el-col :span="8">
          <el-form-item label="中文名称">
            <span>{{ name }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="功能描述">
            <span class="remark-content">{{ remark }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 敏感信息 -->
      <Title text="敏感信息" />
      <el-row class="row--offset">
        <el-col :span="8">
          <el-form-item label="数据级别">
            <span>{{ computeDataLevelText }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="敏感标签">
            <span> {{ computeSelectedLeafLabel }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 提供API的方式 -->
      <Title text="提供API的方式" />
      <el-row class="row--offset">
        <el-col :span="8">
          <el-form-item label="提供API的方式">
            <span>{{ computeTypeText }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="type === 1" class="row--offset">
        <el-col :span="8">
          <el-form-item label="JSF接口名">
            <span>{{ interfaceName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="方法名">
            <span>{{ method }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 根据环境展示JSF服务表单项 -->
      <!-- 测试环境 -->
      <template
        v-if="env === 'local' || env === 'devtest' || env === 'publictest'"
      >
        <el-row v-if="type === 1" class="row--offset">
          <el-col :span="8">
            <el-form-item label="测试环境-别名">
              <span>{{ testAlias }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="测试环境-token">
              <span>{{ testToken }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <!-- 预发、生产环境 -->
      <template v-else-if="env === 'uat' || env === 'prod'">
        <el-row v-if="type === 1" class="row--offset">
          <el-col :span="8">
            <el-form-item label="预发环境-别名">
              <span>{{ uatAlias }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="预发环境-token">
              <span>{{ uatToken }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="type === 1" class="row--offset">
          <el-col :span="8">
            <el-form-item label="生产环境-别名">
              <span>{{ prodAlias }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生产环境-token">
              <span>{{ prodToken }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <el-row v-if="type === 2" class="row--offset">
        <!-- 根据环境展示集群表单项 -->
        <!-- 测试环境 -->
        <template
          v-if="env === 'local' || env === 'devtest' || env === 'publictest'"
        >
          <el-col :span="8">
            <el-form-item label="测试环境-集群">
              <span>{{ testCluster.testClusterName }}</span>
            </el-form-item>
          </el-col>
        </template>
        <!-- 预发、生产环境 -->
        <template v-else-if="env === 'uat' || env === 'prod'">
          <el-col :span="8">
            <el-form-item label="预发环境-集群">
              <span>{{ uatCluster.uatClusterName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生产环境-集群">
              <span>{{ prodCluster.prodClusterName }}</span>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
      <!-- 分组信息 -->
      <Title text="分组信息" />
      <el-row class="row--offset">
        <el-col>
          <el-form-item label="所属分组">
            <span>{{ domain.domainName + "(" + domain.domainCode + ")" }}</span>
            <el-button
              type="text"
              style="margin-left: 8px"
              @click="gotoGroupDetail(domain.domainId)"
              >详情</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 应用信息 -->
      <Title text="应用信息" />
      <el-row class="row--offset">
        <el-col :span="16">
          <el-form-item label="所属应用">
            <span>{{ lcpApp.lcpAppName }}({{ lcpApp.lcpAppKey }})</span>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 负责人信息 -->
      <Title text="负责人信息" />
      <el-row class="row--offset">
        <el-col :span="8">
          <el-form-item label="产品负责人">
            <span>{{ productPrincipal }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="研发负责人">
            <span>{{ developPrincipal }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="运营负责人">
            <span>{{ operationPrincipal }}</span>
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
      label-position="right"
      :model="basicInfoData"
      :rules="basicInfoRules"
    >
      <!-- 描述信息 -->
      <Title text="描述信息" />
      <el-row class="row--offset">
        <el-col :span="8">
          <el-form-item label="中文名称" prop="name">
            <el-input
              v-model.trim="basicInfoData.name"
              placeholder="请输入中文名称"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="功能描述" prop="remark">
            <el-input
              v-model="basicInfoData.remark"
              placeholder="请输入功能描述"
              type="textarea"
              :rows="1"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 敏感信息 -->
      <Title text="敏感信息" />
      <el-row class="row--offset">
        <el-col :span="8">
          <el-form-item label="数据级别" prop="dataLevel">
            <el-select
              v-model="basicInfoData.dataLevel"
              placeholder="请选择数据级别"
              style="width: 100%"
            >
              <el-option
                v-for="item in dataLevelOptionList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="敏感标签" prop="labelIdList">
            <el-cascader
              :show-all-levels="false"
              ref="cascader"
              style="width: 100%"
              v-model="labelIdList"
              :options="cascaderOptions"
              :props="props"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button
            type="text"
            style="margin-left: 8px"
            @click="hrefToDocument"
            >说明</el-button
          >
        </el-col>
      </el-row>
      <!-- 提供API的方式 -->
      <Title text="提供API的方式" />
      <el-row class="row--offset">
        <el-col :span="8">
          <el-form-item label="提供API的方式" prop="type">
            <el-select
              v-model="basicInfoData.type"
              :disabled="showStatus !== 1"
              placeholder="请选择提供API的方式"
              style="width: 100%"
              @change="changeType"
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
        </el-col>
      </el-row>
      <!-- JSF接口名 -->
      <el-row v-show="basicInfoData.type === 1" class="row--offset">
        <el-col :span="8">
          <el-form-item
            label="JSF接口名"
            prop="interfaceName"
            ref="interfaceName"
            :error="interfaceNameErrorMessage"
          >
            <el-select
              v-model.trim="basicInfoData.interfaceName"
              :disabled="showStatus !== 1"
              :loading="interfaceNameLoading"
              :filterable="true"
              :allow-create="true"
              :remote="true"
              :remote-method="remoteInterfaceName"
              style="width: 100%"
              @visible-change="changeSelectInterface"
            >
              <el-option
                v-for="item in interfaceNameOptionList"
                :key="item.id"
                :label="item.interfaceName"
                :value="item.interfaceName"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="方法名" prop="method" ref="method">
            <el-select
              v-model.trim="basicInfoData.method"
              :disabled="showStatus !== 1"
              :filterable="true"
              :allow-create="true"
              placeholder="选择JSF方法名"
              style="width: 100%"
              @focus="focusSelectMethod"
            >
              <el-option
                v-for="(item, index) in methodOptionList"
                :key="index"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 根据环境展示JSF别名表单项 -->

      <!-- 测试环境 -->
      <template
        v-if="env === 'local' || env === 'devtest' || env === 'publictest'"
      >
        <el-row v-show="basicInfoData.type === 1" class="row--offset">
          <el-col :span="8">
            <el-form-item
              label="测试环境-别名"
              prop="testAlias"
              ref="testAlias"
              :error="testAliasErrorMessage"
            >
              <el-select
                v-model.trim="basicInfoData.testAlias"
                :disabled="showStatus !== 1"
                :filterable="true"
                :allow-create="true"
                placeholder="选择JSF别名"
                style="width: 100%"
                @focus="focusSelectAlias"
                @visible-change="($event) => changeSelectAlias($event, 'test')"
              >
                <el-option
                  v-for="item in aliasOptionList"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="测试环境-token" prop="testToken">
              <el-input
                v-model="basicInfoData.testToken"
                placeholder="输入测试环境JSF token"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <!-- 预发、生产环境 -->
      <template v-else-if="env === 'uat' || env === 'prod'">
        <el-row v-show="basicInfoData.type === 1" class="row--offset">
          <el-col :span="8">
            <el-form-item
              label="预发环境-别名"
              prop="uatAlias"
              ref="uatAlias"
              :error="uatAliasErrorMessage"
            >
              <el-select
                v-model.trim="basicInfoData.uatAlias"
                :disabled="showStatus !== 1"
                :filterable="true"
                :allow-create="true"
                placeholder="选择JSF别名"
                style="width: 100%"
                @focus="focusSelectAlias"
                @visible-change="($event) => changeSelectAlias($event, 'uat')"
              >
                <el-option
                  v-for="item in aliasOptionList"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="预发环境-token" prop="uatToken">
              <el-input
                v-model="basicInfoData.uatToken"
                placeholder="输入预发环境JSF token"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="basicInfoData.type === 1" class="row--offset">
          <el-col :span="8">
            <el-form-item
              label="生产环境-别名"
              prop="prodAlias"
              ref="prodAlias"
              :error="prodAliasErrorMessage"
            >
              <el-select
                v-model.trim="basicInfoData.prodAlias"
                :disabled="showStatus !== 1"
                :filterable="true"
                :allow-create="true"
                placeholder="选择JSF别名"
                style="width: 100%"
                @focus="focusSelectAlias"
                @visible-change="($event) => changeSelectAlias($event, 'prod')"
              >
                <el-option
                  v-for="item in aliasOptionList"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生产环境-token" prop="prodToken">
              <el-input
                v-model="basicInfoData.prodToken"
                placeholder="输入生产环境JSF token"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <!-- 根据环境展示集群表单项 -->
      <el-row v-show="basicInfoData.type === 2" class="row--offset">
        <!-- 测试环境 -->
        <template
          v-if="env === 'local' || env === 'devtest' || env === 'publictest'"
        >
          <el-col :span="8">
            <el-form-item
              label="测试环境-集群"
              prop="testCluster"
              ref="testCluster"
            >
              <el-select
                v-model="basicInfoData.testCluster"
                :loading="testClusterLoading"
                :filterable="true"
                :remote="true"
                :remote-method="($event) => remoteCluster($event, 'test')"
                value-key="testClusterId"
                placeholder="请输入集群的中文名称"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, index) in testClusterOptionList"
                  :key="index"
                  :label="item.testClusterName"
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
            <el-form-item
              label="预发环境-集群"
              prop="uatCluster"
              ref="uatCluster"
            >
              <el-select
                v-model="basicInfoData.uatCluster"
                :loading="uatClusterLoading"
                :filterable="true"
                :remote="true"
                :remote-method="($event) => remoteCluster($event, 'uat')"
                value-key="uatClusterId"
                placeholder="请输入集群的中文名称"
                style="width: 100%"
              >
                <el-option
                  v-for="item in uatClusterOptionList"
                  :key="item.uatClusterId"
                  :label="item.uatClusterName"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="生产环境-集群"
              prop="prodCluster"
              ref="prodCluster"
            >
              <el-select
                v-model="basicInfoData.prodCluster"
                :loading="prodClusterLoading"
                :filterable="true"
                :remote="true"
                :remote-method="($event) => remoteCluster($event, 'prod')"
                value-key="prodClusterId"
                placeholder="请输入集群的中文名称"
                style="width: 100%"
              >
                <el-option
                  v-for="item in prodClusterOptionList"
                  :key="item.prodClusterId"
                  :label="item.prodClusterName"
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
      <!-- 分组信息 -->
      <Title text="分组信息" />
      <el-row class="row--offset">
        <el-col :span="8">
          <el-form-item label="所属分组" prop="domain" ref="domain">
            <el-select
              v-model="basicInfoData.domain"
              :disabled="showStatus !== 1"
              :loading="domainLoading"
              :filterable="true"
              :remote="true"
              :remote-method="remoteDomain"
              value-key="domainId"
              placeholder="请输入分组中文名称或分组编码"
              style="width: 100%"
              class="select--fix-height"
            >
              <el-option
                v-for="item in domainOptionList"
                :key="item.domainId"
                :label="item.domainName + '(' + item.domainCode + ')'"
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
            @click="createGroupDialogVisible = true"
            >+创建分组</el-button
          >
        </el-col>
      </el-row>
      <!-- 应用信息 -->
      <Title text="应用信息" />
      <el-row class="row--offset">
        <el-col :span="16">
          <el-form-item label="所属应用" prop="lcpApp">
            <el-select
              v-model="basicInfoData.lcpApp"
              :disabled="showStatus !== 1"
              :filterable="true"
              value-key="lcpAppId"
              placeholder="请输入应用中文名称"
              style="width: 100%"
              class="select--fix-height"
            >
              <el-option
                v-for="item in lcpAppOptionList"
                :key="item.lcpAppId"
                :label="`${item.lcpAppName}(${item.lcpAppKey})`"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 负责人信息 -->
      <Title text="负责人信息" />
      <el-row class="row--offset">
        <el-col :span="8">
          <el-form-item label="产品负责人" prop="productPrincipal">
            <ErpPrincipal
              :showPopover="true"
              :formDataPrincipal.sync="basicInfoData.productPrincipal"
              :disabled="showStatus !== 1"
              placeholder="请输入产品负责人的ERP账号"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="研发负责人" prop="developPrincipal">
            <ErpPrincipal
              :showPopover="true"
              :formDataPrincipal.sync="basicInfoData.developPrincipal"
              :disabled="showStatus !== 1"
              placeholder="请输入研发负责人的ERP账号"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="运营负责人" prop="operationPrincipal">
            <ErpPrincipal
              :showPopover="true"
              :formDataPrincipal.sync="basicInfoData.operationPrincipal"
              :disabled="showStatus !== 1"
              placeholder="请输入运营负责人的ERP账号"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <CreateClusterDialog
      :createClusterDialogVisible.sync="createClusterDialogVisible"
    />
    <CreateGroupDialog
      :createGroupDialogVisible.sync="createGroupDialogVisible"
      :getDomain.sync="getDomain"
      :type="basicInfoData.type"
    />
    <StickyWrapper>
      <el-button
        v-if="!editable"
        type="primary"
        :disabled="disabledEdit"
        @click="handleEdit"
        >编辑</el-button
      >
      <div v-else class="button-wrapper">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
    </StickyWrapper>
  </div>
</template>

<script>
import Title from "@/components/Title.vue";
import StickyWrapper from "@/components/StickyWrapper.vue";
import CreateClusterDialog from "@/views/intranet/apiManager/apiList/detail/httpDetail/basicData/createClusterDialog.vue";
import CreateGroupDialog from "@/views/intranet/apiManager/apiList/detail/httpDetail/basicData/createGroupDialog.vue";
import ErpPrincipal from "@/views/intranet/apiManager/components/ErpPrincipal.vue";
import basicInfo from "@/api/intranet/apiManager/httpDetail/basicInfo.js";
import apiManager from "@/api/intranet/apiManager/index.js";
import envMap from "@/utils/envMap.js";
import gateway from "@/api/intranet/gateway/index.js";

export default {
  name: "BasicInfo",
  components: {
    Title,
    StickyWrapper,
    CreateClusterDialog,
    CreateGroupDialog,
    ErpPrincipal,
  },
  props: {
    disabledEdit: {
      type: Boolean,
      required: true,
    },
    showStatus: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    remark: {
      type: String,
      default: "",
    },
    visibility: {
      type: Number,
      default: 0,
    },
    dataLevel: {
      type: Number,
      default: 0,
    },
    type: {
      type: Number,
      default: 2,
    },
    testCluster: {
      type: Object,
      required: true,
    },
    uatCluster: {
      type: Object,
      required: true,
    },
    prodCluster: {
      type: Object,
      required: true,
    },
    domain: {
      type: Object,
      required: true,
    },
    lcpApp: {
      type: Object,
      required: true,
    },
    productPrincipal: { type: String, default: "" },
    developPrincipal: { type: String, default: "" },
    operationPrincipal: { type: String, default: "" },
    interfaceName: {
      type: String,
      default: "",
    },
    testAlias: {
      type: String,
      default: "",
    },
    method: {
      type: String,
      default: "",
    },
    uatAlias: {
      type: String,
      default: "",
    },
    prodAlias: {
      type: String,
      default: "",
    },
    testToken: {
      type: String,
      default: "",
    },
    uatToken: {
      type: String,
      default: "",
    },
    prodToken: {
      type: String,
      default: "",
    },
    leafIdList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    var validateTestCluster = (rule, value, callback) => {
      if (
        this.basicInfoData.testCluster &&
        this.basicInfoData.testCluster.testClusterId &&
        this.basicInfoData.testCluster.testClusterName
      ) {
        callback();
      } else {
        callback(new Error("请输入集群的中文名称"));
      }
    };
    var validateUatCluster = (rule, value, callback) => {
      if (
        this.basicInfoData.uatCluster &&
        this.basicInfoData.uatCluster.uatClusterId &&
        this.basicInfoData.uatCluster.uatClusterName
      ) {
        callback();
      } else {
        callback(new Error("请输入集群的中文名称"));
      }
    };
    var validateProdCluster = (rule, value, callback) => {
      if (
        this.basicInfoData.prodCluster &&
        this.basicInfoData.prodCluster.prodClusterId &&
        this.basicInfoData.prodCluster.prodClusterName
      ) {
        callback();
      } else {
        callback(new Error("请输入集群的中文名称"));
      }
    };
    var validateLabelIdList = (rule, value, callback) => {
      if (this.labelIdList.length !== 0) {
        callback();
      } else {
        callback(new Error("请选则敏感标签"));
      }
    };
    return {
      getDomain: {},
      env: window.env.buildEnv,
      editable: false,
      createClusterDialogVisible: false,
      createGroupDialogVisible: false,
      basicInfoData: {
        name: "",
        remark: "",
        dataLevel: 0,
        type: 2,
        testCluster: {},
        uatCluster: {},
        prodCluster: {},
        testAlias: "",
        method: "",
        uatAlias: "",
        prodAlias: "",
        testToken: "",
        uatToken: "",
        prodToken: "",
        domain: {},
        lcpApp: {},
        productPrincipal: "",
        developPrincipal: "",
        operationPrincipal: "",
        interfaceName: "",
      },
      basicInfoRules: {},
      basicInfoJsfRules: {
        name: [
          { required: true, message: "请输入中文名称" },
          {
            min: 2,
            max: 20,
            message: "请输入2到20个字符",
          },
        ],
        remark: [
          { required: true, message: "请输入功能描述" },
          {
            min: 2,
            max: 500,
            message: "请输入2到500个字符",
          },
        ],
        visibility: [{ required: true, message: "请选择功能描述" }],
        dataLevel: [{ required: true, message: "请选择数据级别" }],
        type: [{ required: true, message: "请选择提供API的方式" }],
        domain: [{ required: true, message: "请输入分组中文名称或分组编码" }],
        lcpApp: [{ required: true, message: "请输入应用中文名称" }],
        productPrincipal: [
          { required: true, message: "请输入产品负责人的ERP账号" },
        ],
        developPrincipal: [
          { required: true, message: "请输入研发负责人的ERP账号" },
        ],
        operationPrincipal: [
          { required: true, message: "请输入运营负责人的ERP账号" },
        ],
        interfaceName: [{ required: true, message: "请选择JSF接口名" }],
        testAlias: [{ required: true, message: "请选择测试环境-别名" }],
        uatAlias: [{ required: true, message: "请选择预发环境-别名" }],
        prodAlias: [{ required: true, message: "请选生产环境-别名" }],
        method: [{ required: true, message: "请选择方法名" }],
        testToken: [{ max: 50, message: "请输入0-50个字符" }],
        uatToken: [{ max: 50, message: "请输入0-50个字符" }],
        prodToken: [{ max: 50, message: "请输入0-50个字符" }],
        labelIdList: [{ required: true, validator: validateLabelIdList }],
      },
      basicInfoIpRules: {
        name: [
          { required: true, message: "请输入中文名称" },
          {
            min: 2,
            max: 20,
            message: "请输入2到20个字符",
          },
        ],
        remark: [
          { required: true, message: "请输入功能描述" },
          {
            min: 2,
            max: 500,
            message: "请输入2到500个字符",
          },
        ],
        dataLevel: [{ required: true, message: "请选择数据级别" }],
        labelIdList: [{ required: true, validator: validateLabelIdList }],
        type: [{ required: true, message: "请选择提供API的方式" }],
        testCluster: [
          {
            required: true,
            validator: validateTestCluster,
          },
        ],
        uatCluster: [
          {
            required: true,
            validator: validateUatCluster,
          },
        ],
        prodCluster: [
          {
            required: true,
            validator: validateProdCluster,
          },
        ],
        domain: [{ required: true, message: "请输入分组中文名称或分组编码" }],
        lcpApp: [{ required: true, message: "请输入应用中文名称" }],
        productPrincipal: [
          { required: true, message: "请输入产品负责人的ERP账号" },
        ],
        developPrincipal: [
          { required: true, message: "请输入研发负责人的ERP账号" },
        ],
        operationPrincipal: [
          { required: true, message: "请输入运营负责人的ERP账号" },
        ],
      },
      dataLevelOptionList: [
        { value: 0, label: "公开数据（L1）" },
        { value: 1, label: "秘密数据（L2）" },
        { value: 2, label: "机密数据（L3）" },
        { value: 3, label: "绝密数据（L4）" },
      ],
      typeOptionList: [
        { value: 1, label: "一个JSF服务的接口方法" },
        { value: 2, label: "IP端口组成的服务器集群" },
      ],
      // 一个JSF服务的接口方法：JSF接口名、方法名、各个环境别名存活校验信息
      interfaceNameErrorMessage: "",
      testAliasErrorMessage: "",
      uatAliasErrorMessage: "",
      prodAliasErrorMessage: "",

      testClusterOptionList: [],
      testClusterLoading: false,
      uatClusterOptionList: [],
      uatClusterLoading: false,
      prodClusterOptionList: [],
      prodClusterLoading: false,
      domainOptionList: [],
      domainLoading: false,
      lcpAppOptionList: [],
      interfaceNameLoading: false,
      interfaceNameOptionList: [],
      methodOptionList: [],
      aliasOptionList: [],
      props: { multiple: true, value: "id", label: "labelName" },
      selectedLeafLabel: [],
      cascaderOptions: [],
      labelIdList: this.leafIdList,
    };
  },
  computed: {
    computeDataLevelText() {
      const hashMap = {
        0: "公开数据（L1）",
        1: "秘密数据（L2）",
        2: "机密数据（L3）",
        3: "绝密数据（L4）",
      };
      return hashMap[this.dataLevel];
    },
    computeTypeText() {
      const hashMap = {
        1: "一个JSF服务的接口方法",
        2: "IP端口组成的服务器集群",
      };
      return hashMap[this.type];
    },
    // 某些表单项只在初始化状态下可编辑
    computeInitItemDisabled() {
      if (this.editable) {
        return this.showStatus === 1 ? false : true;
      } else {
        return true;
      }
    },
    // 已选中叶子结点标签转换为空格分隔符的字符串
    computeSelectedLeafLabel() {
      return this.selectedLeafLabel.toString().replace(/,/g, " ");
    },
  },
  watch: {
    "basicInfoData.type": {
      handler(newValue) {
        const { basicInfoJsfRules, basicInfoIpRules } = this;
        const hashMap = { 1: basicInfoJsfRules, 2: basicInfoIpRules };
        this.basicInfoRules = hashMap[newValue] || {};
      },
      immediate: true,
    },
    getDomain(newVal) {
      this.basicInfoData.domain = newVal;
      this.domainOptionList = [newVal];
    },
    leafIdList(newVal) {
      this.labelIdList = newVal;
      this.getSelectedLabel();
    },
    labelIdList: {
      handler(newValue) {
        this.basicInfoData.labelIdList = this.labelIdList;
      },
      immediate: true,
    },
  },
  methods: {
    //查询JSF接口
    async queryApiReleaseByCondition(searchKeyWord) {
      const pageNumb = 1;
      const pageSize = 1000;
      const searchType = 1;
      const data = [
        { pageNumb, pageSize },
        { searchType, searchKeyWord },
      ];
      return await basicInfo.queryApiReleaseByCondition(data).catch((error) => {
        const { message } = error;
        message && this.$message.error(message);
        throw new Error("queryApiReleaseByCondition");
      });
    },
    // 模糊查询集群列表
    async queryList(name) {
      const data = { name, sceneType: 1};
      return await basicInfo.queryList(data).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("queryList");
      });
    },
    // 查询应用列表
    async findAppListForSelect() {
      return await apiManager.findAppListForSelect().catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("findAppListForSelect");
      });
    },
    // 查询API分组列表
    async queryCloudDomainList(keyWords) {
      const isOnline = null;
      const page = 1;
      const pageSize = 10000;
      const type = this.basicInfoData.type;
      const data = [
        { page: page, pageSize: pageSize },
        { queryLike: keyWords, type: type, isOnline: isOnline, sceneType: 1}
      ];
      return await apiManager.queryCloudDomainList(data).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("queryCloudDomainList");
      });
    },
    // 保存API基本信息
    async saveBaseInfo() {
      const id = parseInt(this.$route.params.id);
      const name = this.basicInfoData.name;
      const remark = this.basicInfoData.remark;
      const dataLevel = this.basicInfoData.dataLevel;
      const type = this.basicInfoData.type;
      const { testClusterId, testClusterName } = this.basicInfoData.testCluster;
      const { uatClusterId, uatClusterName } = this.basicInfoData.uatCluster;
      const { prodClusterId, prodClusterName } = this.basicInfoData.prodCluster;
      const { domainId, domainCode, domainName } = this.basicInfoData.domain;
      const { lcpAppId, lcpAppKey, lcpAppName } = this.basicInfoData.lcpApp;
      const productPrincipal = this.basicInfoData.productPrincipal;
      const developPrincipal = this.basicInfoData.developPrincipal;
      const operationPrincipal = this.basicInfoData.operationPrincipal;
      const {
        interfaceName,
        testAlias,
        uatAlias,
        prodAlias,
        method,
        testToken,
        uatToken,
        prodToken,
      } = this.basicInfoData;
      const labelIdList = this.labelIdList;
      if (labelIdList.length <= 0) {
        this.$message.warning("敏感标签不能为空");
        return;
      }
      const data = {
        id,
        name,
        remark,
        dataLevel,
        type,
        testClusterId,
        testClusterName,
        uatClusterId,
        uatClusterName,
        prodClusterId,
        prodClusterName,
        domainId,
        domainCode,
        domainName,
        lcpAppId,
        lcpAppKey,
        lcpAppName,
        productPrincipal,
        developPrincipal,
        operationPrincipal,
        interfaceName,
        testAlias,
        uatAlias,
        prodAlias,
        method,
        testToken,
        uatToken,
        prodToken,
        labelIdList,
      };
      return await basicInfo.saveBaseInfo(data).catch((error) => {
        const { message } = error.data;
        message && this.$message.error(message);
        throw new Error("saveBaseInfo");
      });
    },
    // 根据JSF接口名查询API仓库维护接口的别名列表
    async queryAliasIfPresentInterface() {
      const qualifiedName = this.basicInfoData.interfaceName;
      return await gateway.JsfApiService.queryAliasIfPresentInterface([
        { qualifiedName },
      ]);
    },
    // 根据接口名查询别名
    async queryMethodIfPresentInterface() {
      const qualifiedName = this.basicInfoData.interfaceName;
      const data = [{ qualifiedName }];
      return await gateway.JsfApiService.queryMethodIfPresentInterface(data);
    },
    // 根据JSF接口名、JSF别名、方法名查询JSF接口在JSF注册中心的状态
    async findApiStatus(jsfAlias = "") {
      const qualifiedName = this.basicInfoData.interfaceName;
      const data = [{ qualifiedName, jsfAlias }];
      return await gateway.JsfApiMetaService.findApiStatus(data);
    },

    // 说明文档链接
    hrefToDocument() {
      window.open(
        "//cf.jd.com/pages/viewpage.action?pageId=106705184",
        "_blank"
      );
    },
    //查看分组详情
    gotoGroupDetail(id) {
      const url = `#/apiManager/apiGroup/detail/${id}`;
      window.open(url, "_blank");
    },
    // 初始化基本信息表单数据
    initBasicInfoData() {
      let {
        name,
        remark,
        dataLevel,
        type,
        testCluster,
        uatCluster,
        prodCluster,
        domain,
        lcpApp,
        productPrincipal,
        developPrincipal,
        operationPrincipal,
        interfaceName,
        testAlias,
        uatAlias,
        prodAlias,
        method,
        testToken,
        uatToken,
        prodToken,
      } = this;
      lcpApp.lcpAppId = String(lcpApp.lcpAppId);
      this.basicInfoData = {
        name,
        remark,
        dataLevel,
        type,
        testCluster,
        uatCluster,
        prodCluster,
        domain,
        lcpApp,
        productPrincipal,
        developPrincipal,
        operationPrincipal,
        interfaceName,
        testAlias,
        uatAlias,
        prodAlias,
        method,
        testToken,
        uatToken,
        prodToken,
      };
      this.testClusterOptionList = [testCluster];
      this.uatClusterOptionList = [uatCluster];
      this.prodClusterOptionList = [prodCluster];
      this.domainOptionList = [domain];
      // this.lcpAppOptionList = [lcpApp];
      this.labelIdList = this.leafIdList;
    },
    // 编辑API基本信息
    handleEdit() {
      this.editable = true;
      this.$nextTick(() => {
        this.initBasicInfoData();
      });
    },
    // 取消编辑API基本信息
    handleCancel() {
      this.$refs["basicInfoData"].resetFields();
      this.editable = false;
    },
    // 保存API基本信息操作
    handleSave() {
      this.$refs["basicInfoData"].validate(async (valid) => {
        if (valid) {
          const response = await this.saveBaseInfo().catch(() => {
            throw new Error("handleSave saveBaseInfo");
          });
          const { message } = response.data;
          message && this.$message.success(message);
          this.$refs["basicInfoData"].resetFields();
          this.editable = false;
          this.$emit("updateGetApi");
        } else {
          return false;
        }
      });
    },
    // 改变提供API的方式时，清空集群选中值、集群列表、JSF接口名、方法名、环境别名
    changeType() {
      const envName = envMap[this.env];
      let refList = [
        `${envName}Cluster`,
        "interfaceName",
        `${envName}Method`,
        `${envName}Alias`,
        "domain",
      ];
      let optionList = [
        `${envName}ClusterOptionList`,
        "interfaceNameOptionList",
        "methodOptionList",
        "aliasOptionList",
        "domainOptionList",
      ];
      if (envName === "prod") {
        refList = refList.concat(["uatCluster", "uatAlias"]);
        optionList = optionList.concat(["uatClusterOptionList"]);
      }
      refList.forEach((item) => this.$refs[item].resetField());
      optionList.forEach((item) => (this[item] = []));
    },
    // 模糊搜索接口名
    async remoteInterfaceName(query) {
      if (query !== "") {
        this.interfaceNameLoading = true;
        const response = await this.queryApiReleaseByCondition(query).catch(
          () => {
            this.interfaceNameLoading = false;
            throw new Error("remoteInterfaceName queryApiReleaseByCondition");
          }
        );
        const { list } = response.data;
        this.interfaceNameOptionList =
          list && list.length > 0
            ? list.map(({ qualifiedName }) => ({
                interfaceName: qualifiedName,
              }))
            : [];
        this.interfaceNameLoading = false;
      } else {
        this.interfaceNameOptionList = [];
      }
    },
    // 改变接口选择值时，重置JSF方法名与对应环境别名，获取JSF方法名列表，根据JSF接口名查询JSF接口在JSF注册中心的状态
    async changeSelectInterface(visible) {
      if (!visible) {
        const envName = envMap[this.env];
        const refList = [`${envName}Method`, `${envName}Alias`];
        const optionList = ["methodOptionList", "aliasOptionList"];
        if (envName === "prod") refList = refList.concat(["uatAlias"]);
        refList.forEach((item) => this.$refs[item].resetField());
        optionList.forEach((item) => (this[item] = []));
        this.interfaceNameErrorMessage = "";
        await this.findApiStatus().catch((error) => {
          const { message } = error;
          this.interfaceNameErrorMessage = message || "";
        });
      }
    },
    // 聚焦方法名选择框时，根据JSF接口名查询方法列表
    async focusSelectMethod() {
      if (!this.basicInfoData.interfaceName) return;
      const { data } = await this.queryMethodIfPresentInterface().catch(() => {
        throw new Error("focusSelectMethod queryMethodIfPresentInterface");
      });
      this.methodOptionList = data || [];
    },
    // 聚焦别名选择框时，根据JSF接口查询别名
    async focusSelectAlias() {
      if (!this.basicInfoData.interfaceName) return;
      const { data } = await this.queryAliasIfPresentInterface().catch(() => {
        throw new Error("focusSelectAlias queryAliasIfPresentInterface");
      });
      this.aliasOptionList = data || [];
    },
    // 改变别名选择值时，根据JSF接口名、JSF别名查询JSF接口在JSF注册中心的状态
    async changeSelectAlias(visible, env) {
      if (!visible) {
        this[`${env}AliasErrorMessage`] = "";
        const alias = this.basicInfoData[`${env}Alias`];
        await this.findApiStatus(alias).catch((error) => {
          const { code, message } = error;
          this[`${env}AliasErrorMessage`] = message || "";
        });
      }
    },
    // 集群模糊搜索
    async remoteCluster(query, env) {
      const hashMap = {
        // 切换集群列表加载状态
        toggleLoading: (isLoading) => {
          this[`${env}ClusterLoading`] = isLoading || false;
        },
        // 集群列表映射回调
        mapCallback: ({ id, name }) => {
          const item = {};
          item[`${env}ClusterId`] = id;
          item[`${env}ClusterName`] = name;
          return item;
        },
        // 集群列表赋值
        assignOptionList: (list) => {
          this[`${env}ClusterOptionList`] = list || [];
        },
      };
      if (query !== "") {
        hashMap.toggleLoading(true);
        const response = await this.queryList(query).catch(() => {
          throw new Error("remoteCluster queryList");
        });
        const { data } = response;
        data && data.length > 0
          ? hashMap.assignOptionList(data.map(hashMap.mapCallback))
          : hashMap.assignOptionList();
        hashMap.toggleLoading();
      } else {
        hashMap.assignOptionList();
      }
    },
    // 所属分组模糊搜索
    async remoteDomain(query) {
      if (query !== "") {
        this.domainLoading = true;
        const response = await this.queryCloudDomainList(query).catch(() => {
          throw new Error("remoteDomain queryCloudDomainList");
        });

        const rows = response.data.rows;
        this.domainOptionList =
          rows && rows.length > 0
            ? rows.map((item) => {
                const domainId = item.id;
                const domainCode = item.code;
                const domainName = item.cnName;
                return { domainId, domainCode, domainName };
              })
            : [];
        this.domainLoading = false;
      } else {
        this.domainOptionList = [];
      }
    },
    // 获取敏感标签数据
    async getSensitiveLabelForest() {
      const response = await basicInfo.getSensitiveLabelForest();
      this.cascaderOptions = response.data;
      this.getSelectedLabel();
    },
    // 获取选中节点标签
    getSelectedLabel() {
      this.selectedLeafLabel = [];
      this.labelIdList.forEach((item) => {
        this.queryLeafLabel(item[item.length - 1], this.cascaderOptions);
      });
    },
    // 递归遍历树节点获取选中子节点标签
    queryLeafLabel(id, cascaderOptions) {
      cascaderOptions.forEach((item) => {
        if (item.id === id) {
          this.selectedLeafLabel.push(item.labelName);
          return;
        }
        if (item.children) {
          this.queryLeafLabel(id, item.children);
        }
      });
    },
    onCopy(e) {
      this.$message.success("复制成功");
    },
    onError(e) {
      this.$message.error("复制失败");
    },
  },
  async created() {
    (async () => {
      const response = await this.findAppListForSelect().catch(() => {
        throw new Error("created findAppListForSelect");
      });
      const { data } = response.data;
      this.lcpAppOptionList =
        data && data.length > 0
          ? data.map((item) => {
              const lcpAppId = item.value;
              const lcpAppKey = item.code;
              const lcpAppName = item.label;
              return { lcpAppId, lcpAppKey, lcpAppName };
            })
          : [];
    })();
    await this.getSensitiveLabelForest();
  },
};
</script>

<style lang="scss" scoped>
.basic-info {
  .basic-info__not-editable-form {
    .row--offset {
      padding-left: 12px;
    }
  }
  .basic-info__editable-form {
    .row--offset {
      padding-left: 12px;
    }
  }
  .select--fix-height {
    ::v-deep.el-input__inner {
      height: 32px !important;
    }
  }
}
.remark-content {
  white-space: pre-wrap;
  word-break: break-all
}
</style>
