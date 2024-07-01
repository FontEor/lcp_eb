<template>
  <div class="app-container">
    <div class="my-wrap">
      <steps v-bind="stepsObj" />
      <div class="myFormBox">
        <div style="display: none" id="innerAppDescId">
          <div
            style="
              text-align: center;
              padding: 0 50px;
              margin-bottom: 60px;
              color: #666666;
            "
          >
            {{ $t("app.addapp.5ix6o40kl8c0") }}
          </div>
        </div>
        <div style="display: none" id="outerAppDescId">
          <div
            style="
              text-align: center;
              padding: 0 50px;
              margin-bottom: 60px;
              color: #666666;
            "
          >
            {{ $t("app.addapp.5ix6o40kltg0") }}
          </div>
        </div>
        <el-form ref="form" :model="form" label-width="100px" :rules="rules">
          <el-form-item :label="$t('app.addapp.5ix6o40kmsw1')" prop="name">
            <div style="display: none" id="innerAppNameId">
              <el-autocomplete
                class="el-input"
                v-model="form.name"
                :fetch-suggestions="queryExistedApp"
                :placeholder="$t('app.addapp.5ix6o40kmsw2')"
                :trigger-on-focus="false"
                @select="(item) => handleSelect(item)"
              >
                <template slot-scope="{ item }">
                  <div class="name">{{ item.appName }}({{ item.appCode }})</div>
                </template>
              </el-autocomplete>
            </div>
            <div style="display: none" id="outerAppNameId">
              <el-input
                class="el-input"
                v-model="form.name"
                :placeholder="$t('app.addapp.5ix6o40kmsw3')"
              >
              </el-input>
            </div>
          </el-form-item>
          <el-form-item
            :label="$t('app.addapp.5ix6o40kmsw4')"
            prop="code"
            hidden
          >
            <el-input v-model="form.code"></el-input>
          </el-form-item>
          <el-form-item :label="$t('app.addapp.5ix6o40kmsw5')" prop="remark">
            <el-input
              type="textarea"
              v-model="form.remark"
              :placeholder="$t('app.addapp.5ix6o40kmsw6')"
            ></el-input>
          </el-form-item>
          <div style="text-align: center">
            <el-button v-on:click="onCancel" :disabled="isDisabled">{{
              $t("app.addapp.5ix6o40klyw0")
            }}</el-button>
            <el-button
              :loading="submitLoading"
              :disabled="isDisabled"
              type="primary"
              @click="onSubmit"
              >{{ $t("app.addapp.5ix6o40km2o0") }}</el-button
            >
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import steps from "@/components/steps/index.vue";
import { mapGetters } from "vuex";
import request from "@/utils/request";

export default {
  components: {
    steps,
  },
  data() {
    return {
      submitDebounceTimer: null,
      submitLoading: false,
      appType: this.$route.query.type,
      form: {
        name: "",
        code: "",
        remark: "",
        type: this.$route.query.type,
        systemSource:"lcp",
      },
      rules: {
        name: [
          {
            required: true,
            message: this.$t("app.addapp.5ix6o40km680"),
            trigger: "blur",
          },
          {
            min: 2,
            max: 20,
            message: this.$t("app.addapp.5ix6o40km9o0"),
            trigger: "change",
          },
        ],
        remark: [
          {
            required: true,
            message: this.$t("app.addapp.5ix6o40kmd00"),
            trigger: "blur",
          },
          {
            min: 10,
            max: 200,
            message: this.$t("app.addapp.5ix6o40kmg40"),
            trigger: "blur",
          },
        ],
      },
      stepsObj: {
        active: 1,
        title: this.$t("app.addapp.5ix6o40kmjg0"),
        tiptitle: [
          this.$t("app.addapp.5ix6o40kmmo0"),
          this.$t("app.addapp.5ix6o40kmpk0"),
          this.$t("app.addapp.5ix6o40kmsw0"),
        ],
      },
      isDisabled: false,
    };
  },
  computed: {
    ...mapGetters(["user_pin"]),
  },
  methods: {
    onCancel() {
      this.$router.push("/appManager/create-app");
    },
    onSubmit() {
      clearTimeout(this.submitDebounceTimer);
      this.submitDebounceTimer = setTimeout(() => {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            this.isDisabled = true;
            this.submitLoading = true;
            request({
              url: "/app/addAppInfo",
              method: "post",
              params: this.form,
            })
              .then((rsp) => {
                this.isDisabled = false;
                this.submitLoading = false;
                const name = "AppManagerCreateAppFinish";
                const id = rsp.data;
                const query = { id };
                this.$router.push({
                  name,
                  query,
                });
              })
              .catch((e) => {
                this.isDisabled = false;
                this.submitLoading = false;
                console.log(e);
              });
          } else {
            return false;
          }
        });
      }, 300);
    },

    queryExistedApp(queryString, callback) {
      this.form.code = "";
      var list = [{}];
      //调用的后台接口
      request({
        url: "/app/findExistedAppList",
        method: "get",
        params: { name: queryString, code: queryString },
      })
        .then((resp) => {
          for (let i of resp.data) {
            i.value = i.appName; //将想要展示的数据作为value
          }
          list = resp.data;
          callback(list);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    handleSelect(item) {
      this.form.code = item.appCode;
    },
  },
  mounted() {
    if (this.appType === 1 || this.appType === 2) {
      document.getElementById("innerAppDescId").style.display = "";
      document.getElementById("innerAppNameId").style.display = "";
    } else {
      document.getElementById("outerAppDescId").style.display = "";
      document.getElementById("outerAppNameId").style.display = "";
    }
  },
};
</script>

<style lang="scss" scoped>
.myFormBox {
  width: 50%;
  margin: 0 auto;
  h4 {
    margin-bottom: 40px;
    font-size: 18px;
    color: #333333;
    text-align: center;
  }
  h3 {
    margin-bottom: 20px;
    font-size: 24px;
    color: #333333;
  }
}
</style>
