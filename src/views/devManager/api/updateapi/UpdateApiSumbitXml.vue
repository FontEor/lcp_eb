<template>
  <div>
    <el-row :gutter="20">
      <el-col :push="5" :span="4" style="text-align: right"
        ><span style="font-weight: bold; color: #666"
          >请选择API文档生成方式:</span
        ></el-col
      >
      <el-col :push="5" :span="2">
        <el-tooltip
          :disabled="!isRedioDisabled(1)"
          class="item"
          effect="dark"
          content="更新API时，不允许更换API文件生成方式"
          placement="top"
        >
          <el-radio
            :disabled="isRedioDisabled(1)"
            v-model="registerType"
            label="1"
            @change="updateRegisterType()"
            ><span style="font-weight: normal">IDEA插件</span></el-radio
          >
        </el-tooltip>
      </el-col>
      <el-col :push="5" :span="2">
        <el-tooltip
          :disabled="!isRedioDisabled(2)"
          class="item"
          effect="dark"
          content="更新API时，不允许更换API文件生成方式"
          placement="top"
        >
          <el-radio
            :disabled="isRedioDisabled(2)"
            v-model="registerType"
            label="2"
            @change="updateRegisterType()"
          >
            <span style="font-weight: normal"> 拉取JSF元数据</span>
            <el-tooltip
              class="item"
              effect="dark"
              content="若方法中含有泛型参数，不建议使用此种方式"
              placement="bottom"
            >
              <i class="el-icon-help-solid"></i>
            </el-tooltip>
          </el-radio>
        </el-tooltip>
      </el-col>
    </el-row>
    <br />
    <div v-if="registerType == 1">
      <el-upload
        drag
        class="entrySuccess dlk-inline"
        :action="upload"
        name="file"
        :auto-upload="false"
        :on-change="imageOnChange"
        :file-list="fileList"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将IDEA插件生成的API定义文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div style="color: red" slot="tip">只能上传xml文件</div>
      </el-upload>
    </div>
    <div v-if="registerType == 2">
      <div>
        <span class="font">
          填写以下信息之前，请确保JSF服务已按
          <a :href="this.apiPublishPath" style="color: #3c6ef0" target="_blank"
            >《API部署手册》</a
          >
          部署完成</span
        >
      </div>
      <br />
      <el-form
        :model="jsfDate"
        :rules="rules"
        ref="jsfDate"
        :show-message="false"
      >
        <el-row>
          <el-col :push="7" :span="7">
            <el-form-item
              label="JSF接口名"
              label-width="30%"
              prop="qualifiedName"
            >
              <el-input
                v-model="jsfDate.qualifiedName"
                placeholder="示例：com.jd.lcp.xxx.api.xxx"
                :disabled="true"
                maxlength="500"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :push="7" :span="7">
            <el-form-item label="JSF别名" label-width="30%" prop="jsfAlias">
              <el-select
                v-model="jsfDate.jsfAlias"
                filterable
                placeholder="请选择"
                class="inline-input"
                @change="updatejsfAlias()"
              >
                <el-option
                  v-for="item in this.jsfAliasList"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :push="7" :span="7">
            <el-form-item
              label="JSF方法名"
              label-width="30%"
              prop="methodList"
              style="margin-bottom: 1px"
            >
              <el-autocomplete
                class="inline-input"
                v-model.trim="methodName"
                :fetch-suggestions="querySearch"
                placeholder="请输入"
                @select="handleSelect"
                :debounce="0"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :push="9" :span="7" style="text-align: left">
            <el-tag
              :key="tag"
              v-for="tag in this.jsfDate.methodList"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)"
            >
              {{ tag }}
            </el-tag>
          </el-col>
        </el-row>
      </el-form>
      <br />
      <div>
        <el-button type="primary" style="" @click="next()">下一步</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import gwApiRequest from "@/utils/gwApiRequest.js";

export default {
  props: {
    apiMessage: Object,
  },
  data() {
    return {
      fileList: [],
      upload: "",
      registerPath: "",
      registerType: "1",
      apiPublishPath: "",
      jsfDate: {
        qualifiedName: "",
        methodList: [],
        jsfAlias: "",
      },
      //后端返回的方法的列表
      methodMap: [],
      methodName: "",
      jsfAliasList: [],
      rules: {
        qualifiedName: [{ required: true, message: "请填写【JSF接口名】" }],
        methodList: [{ required: true, message: "请填写【JSF方法名】" }],
        jsfAlias: [{ required: true, message: "请选择【JSF别名】" }],
      },
    };
  },
  methods: {
    async queryAliasByInterface() {
      const url = "/JsfApiMetaService/queryAliasByInterface";
      let { qualifiedName = "" } = this.$route.query;
      qualifiedName = qualifiedName.trim();
      const data = [{ qualifiedName }];
      return await gwApiRequest.post(url, JSON.stringify(data));
    },
    async queryMethodByCondition(method = undefined) {
      const url = "/JsfApiMetaService/queryMethodByCondition";
      const { qualifiedName, jsfAlias } = this.jsfDate;
      const data = [{ qualifiedName, jsfAlias, method }];
      method === undefined && delete data[0].method;
      return await gwApiRequest.post(url, JSON.stringify(data));
    },
    async findApiXmlDoc() {
      const url = "/JsfApiMetaService/findApiXmlDoc";
      const { qualifiedName, jsfAlias, methodList } = this.jsfDate;
      const data = [{ qualifiedName, jsfAlias, methodList }];
      return await gwApiRequest.post(url, JSON.stringify(data));
    },
    async findApiBaseInfo() {
      const url = "/ApiManagerService/findApiBaseInfo";
      const { id } = this.$route.params;
      const data = [{ id }];
      return await gwApiRequest.post(url, JSON.stringify(data));
    },

    initRegisterType() {
      if (
        this.apiMessage.registerType === null ||
        this.apiMessage.registerType === undefined ||
        this.apiMessage.registerType === ""
      ) {
        this.getRegisterType();
      } else {
        this.registerType = this.apiMessage.registerType;
        if (this.registerType === "2") {
          this.initQualifiedName(this.apiMessage.jsfDate);
        }
      }
    },
    async getRegisterType() {
      const { data } = await this.findApiBaseInfo().catch(() => {
        throw new Error("getRegisterType findApiBaseInfo");
      });
      this.apiMessage.id = data.id;
      this.registerType = JSON.stringify(data.registerType);
      this.apiMessage.registerType = this.registerType;
      //如果状态为2则回显注册时jsf的源数据
      if (this.registerType === "2") {
        this.initQualifiedName(data);
      }
    },
    initQualifiedName(jsfMeta) {
      this.jsfDate.qualifiedName = jsfMeta.qualifiedName;
      console.log(this.jsfDate.qualifiedName);
      //初始化别名
      this.initJsfAlias(jsfMeta);
      //初始化方法列表，方法列表只和接口是父子关系，和别名只是决定方法列表可以添加哪些方法
      this.initMethodList();
    },
    initJsfAlias(jsfMeta) {
      if (jsfMeta.jsfAlias !== null && jsfMeta.jsfAlias !== undefined) {
        this.apiMessage.jsfDate.jsfAlias = jsfMeta.jsfAlias;
        this.jsfDate.jsfAlias = jsfMeta.jsfAlias;
        this.getJsfAliasList();
      }
    },
    initMethodList() {
      //判断是回退还是第一次进来
      if (
        this.apiMessage.jsfDate.methodList === null ||
        this.apiMessage.jsfDate.methodList === undefined ||
        this.apiMessage.jsfDate.methodList.length < 1
      ) {
        if (
          this.jsfDate.methodList === null ||
          this.jsfDate.methodList === undefined ||
          this.jsfDate.methodList.length < 1
        ) {
          this.getRegisteredMethodList();
        }
      } else {
        //回退
        this.fillJsfDateMethodList();
      }
      //获得此接口别名的所有方法
      this.getAllMethodList();
    },
    imageOnChange(file, fileList) {
      if (file.raw.type !== "text/xml") {
        this.$message.error("只支持xml格式的文件！");
        this.fileList = [];
        return false;
      }
      const formData = new FormData();
      formData.append("file", file.raw);
      formData.append("qualifiedName", this.$route.query.qualifiedName);
      gwApiRequest({
        method: "post",
        url: "/ApiManagerService/verifyApiForUpdate",
        data: formData,
        timeout: 3 * 60 * 1000,
      })
        .then((rsp) => {
          if (rsp.code === 20000) {
            this.$message({
              duration: 2000,
              message: "上传API文件成功",
              type: "success",
            });
            sessionStorage.removeItem("apiXml");
            sessionStorage.setItem("apiXml", escape(rsp.data.apiXml));
            this.apiMessage.apiupdatecompare = rsp.data;
            this.apiMessage.registerType = this.registerType;
            this.$emit("next");
          } else {
            this.fileList = [];
            this.$message.error(rsp.message);
          }
        })
        .catch((e) => {
          this.fileList = [];
          console.log(e);
        });
    },
    updateRegisterType() {
      sessionStorage.removeItem("apiXml");
      this.initQualifiedName({
        qualifiedName: this.$route.query.qualifiedName,
        jsfAlias: this.jsfDate.jsfAlias,
      });
    },
    //获得jsf别名列表
    async getJsfAliasList() {
      if (
        this.$route.query.qualifiedName === undefined ||
        this.$route.query.qualifiedName.trim() === ""
      ) {
        this.$message.error("请填写【JSF接口名】");
        return;
      }
      const response = await this.queryAliasByInterface().catch(() => {
        throw new Error("getJsfAliasList queryAliasByInterface");
      });
      const { data } = response;
      if (data && data.length > 0) {
        this.jsfAliasList = data;
        if (
          this.jsfAliasList.indexOf(this.apiMessage.jsfDate.jsfAlias) !== -1
        ) {
          this.jsfDate.jsfAlias = this.apiMessage.jsfDate.jsfAlias;
        } else {
          this.apiMessage.jsfDate.jsfAlias = "";
        }
      }
    },
    //当修改jsf别名时，已选择的方法列表不变，只是候选的方法列表重新获取，
    updatejsfAlias() {
      // this.methodMap = [];
      // this.jsfDate.methodList.length = 0;

      this.methodName = "";
      // 重新获得方法列表
      this.getAllMethodList();
    },
    async getAllMethodList() {
      if (this.jsfDate.qualifiedName == "" || this.jsfDate.jsfAlias == "") {
        return;
      }
      const response = await this.queryMethodByCondition().catch(() => {
        throw new Error("getAllMethodList queryMethodByCondition");
      });
      const { data } = response;
      this.methodMap =
        data.map((item) => {
          const value = item;
          return { value };
        }) || [];
      if (!(data && data.length > 0)) {
        this.apiMessage.jsfDate.methodList = [];
      }
    },
    //给jsfDate.MethodList赋值
    fillJsfDateMethodList() {
      this.jsfDate.methodList = [];
      for (
        let index = 0;
        index < this.apiMessage.jsfDate.methodList.length;
        index++
      ) {
        this.jsfDate.methodList.push(this.apiMessage.jsfDate.methodList[index]);
      }
    },

    /**
     * 方法名查询,这里模糊查询，需要访问后端
     */
    querySearch(queryString, cb) {
      //联调下面注释打开
      this.getBlurryMethodList(queryString);
      cb(this.methodMap);
    },
    //获得模糊匹配的方法的集合
    async getBlurryMethodList(queryString) {
      if (
        this.jsfDate.qualifiedName === undefined ||
        this.jsfDate.qualifiedName.trim() === ""
      ) {
        this.$message.error("请填写【JSF接口名】");
        return;
      }
      if (this.jsfDate.jsfAlias === undefined || this.jsfDate.jsfAlias === "") {
        this.$message.error("请选择【JSF别名】");
        return;
      }
      const response = await this.queryMethodByCondition(queryString).catch(
        () => {
          throw new Error("getBlurryMethodList queryMethodByCondition");
        }
      );
      const { data } = response;
      this.putMethodMap(data);
    },
    //后端返回的方法List填充到methodMap中
    putMethodMap(methodList) {
      let methodMap = [];
      for (let index = 0; index < methodList.length; index++) {
        methodMap.push({ value: methodList[index] });
      }
      this.$set(this, "methodMap", methodMap);
    },
    handleSelect(item) {
      console.log(item);
      if (this.jsfDate.methodList.indexOf(item.value) < 0) {
        this.jsfDate.methodList.push(item.value);
      }
      this.methodName = "";
    },
    handleClose(tag) {
      this.jsfDate.methodList.splice(this.jsfDate.methodList.indexOf(tag), 1);
    },
    async next() {
      if (
        this.jsfDate.qualifiedName === undefined ||
        this.jsfDate.qualifiedName.trim() === ""
      ) {
        this.$message.error("请填写【JSF接口名】");
        return;
      }
      if (this.jsfDate.jsfAlias === undefined || this.jsfDate.jsfAlias === "") {
        this.$message.error("请选择【JSF别名】");
        return;
      }
      if (
        this.jsfDate.methodList === undefined ||
        this.jsfDate.methodList.length < 1
      ) {
        this.$message.error("请填写【JSF方法名】");
        return;
      }
      sessionStorage.removeItem("apiXml");
      await this.getApiXml();
    },
    async getApiXml() {
      const response = await this.findApiXmlDoc().catch(() => {
        throw new Error("getApiXml findApiXmlDoc");
      });
      const { data } = response;
      sessionStorage.removeItem("apiXml");
      sessionStorage.setItem("apiXml", escape(data));
      this.apiMessage.registerType = this.registerType;
      this.apiMessage.qualifiedName = this.jsfDate.qualifiedName;
      this.apiMessage.jsfDate = this.jsfDate;
      this.$emit("next");
    },
    getRegisteredMethodList() {
      gwApiRequest({
        url: "/ApiManagerService/queryApiMethodByCondition",
        method: "post",
        data: JSON.stringify([
          {
            qualifiedName: this.jsfDate.qualifiedName,
          },
        ]),
      })
        .then((rsp) => {
          for (let index = 0; index < rsp.data.length; index++) {
            this.jsfDate.methodList.push(rsp.data[index].name);
          }
        })
        .catch((e) => {
          this.$message.error(e);
        });
    },
    selectJsfValue(callback, vc) {
      if (callback) {
        this.getJsfAliasList();
      }
    },
    isRedioDisabled(registerType) {
      if (this.registerType == registerType) {
        return false;
      } else {
        return true;
      }
    },
  },
  mounted() {
    this.registerPath =
      window.location.protocol +
      "//" +
      `${window.location.host}/#` +
      `${window.env.docDescription}`;
    sessionStorage.removeItem("apiXml");

    this.apiPublishPath =
      window.location.protocol +
      "//" +
      `${window.location.host}/#` +
      `${window.env.docApiPublish}`;

    // 初始化注册类型
    this.initRegisterType();
  },
};
</script>

<style lang="scss" scoped>
.font {
  margin-top: 0.8vh;
  color: #b5b5b5;
  margin-left: 5px;
}
.inline-input {
  width: 100%;
}
.el-tag {
  margin-left: 10px;
  background-color: #ffffff;
  color: #333;
  line-height: 12px;
  height: 12px;
  font-size: 12px;
  border-color: #ffffff;
  border-style: none;
  padding: 0;
  ::v-deep .el-tag__close {
    color: #b5b5b5;
  }
}
.el-icon-help-solid {
  margin-left: 5px;
}
</style>
