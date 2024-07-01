<template>
  <div class="myFormBox">
    <h3>请填写SDK基本信息</h3>
    <p>这些信息将直接展示给用户，作为他们选用SDK的依据，请认真填写</p>
    <el-form  :model="sdkBaseInfo" label-width="80px" :rules="rules" ref="sdkBaseInfo" size="medium"  style="width: 60%;margin: 0 auto;">
      <el-form-item label="unitId:" prop="unitId" hidden>
        <el-input v-model="sdkBaseInfo.unitId"></el-input>
      </el-form-item>
      <el-form-item label="id主键:" prop="id" hidden>
        <el-input v-model="sdkBaseInfo.id"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="sdkBaseInfo.name" placeholder="例:京东快递业务SDK"></el-input>
      </el-form-item>
      <el-form-item label="版本号" prop="version">
        <el-input v-model="sdkBaseInfo.version" placeholder="每次更新SDK需要迭代，例:1.0"></el-input>
      </el-form-item>
      <el-form-item label="语言" prop="language">
        <el-select v-model="sdkBaseInfo.language" placeholder="请选择">
          <el-option key="JAVA" label="JAVA" :value="Number(1)">JAVA</el-option>
          <!-- <el-option key=".NET" label=".NET" :value="Number(2)">.NET</el-option>
          <el-option key="PHP" label="PHP" :value="Number(3)">PHP</el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input type="textarea" v-model="sdkBaseInfo.remark" rows="3" placeholder="描述SDK的使用场景、功能范围，10-200个字符"></el-input>
      </el-form-item>

      <el-form-item style="text-align: center" >
        <el-button
          :disabled = "openIsDisabled "
          type="primary"
          style=""
          @click="submitForm('sdkBaseInfo')" >下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import request from "@/utils/request"

  export default {
    name: 'sdkAddStep1',
    props:{
      sdkId:Number
    },
    data () {
      return {
        openIsDisabled:false,
        sdkBaseInfo: {
            id:'',
            unitId:'',
            name: '',
            version: '',
            language: '',
            remark: ''
          },
        rules:{
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'change' }
          ],
          version: [
            { required: true, message: '请输入', trigger: 'blur' },
            { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'change' }
          ],
          language: [
            { required: true, message: '请选择', trigger: 'blur' }
          ],
          remark: [
            { required: true, message: '请输入描述', trigger: 'blur' },
            { min: 10, max: 200, message: '长度在 10 到 200 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    created () {
      // 编辑SDK信息时从父级传入sdkId数据，如果刷新页面，则从URL中得到
      if (this.sdkId) {
        this.sdkBaseInfo.id = this.sdkId
      } else {
        this.sdkBaseInfo.id = this.$route.query.sdkId
      }
      this.sdkBaseInfo.unitId = this.$route.params.id
      this.fetchOldBizSdkPre()
    },
    methods: {
      fetchOldBizSdkPre () {
        let _this = this
        _this.loading = true
        request({
          url: "/sdk/getBizSdkPreById",
          method: 'get',
          params:{id:_this.sdkBaseInfo.id}
        }).then(rsp => {
          if(rsp.data){
            _this.sdkBaseInfo =rsp.data
          }
          this.loading = false
        }).catch(e => {
          console.log(e)
          this.loading = false
        })
      },

      submitForm (formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.openIsDisabled=true
            let url="/sdk/saveBizSdkPre";
            request({
              url: url,
              method: "post",
              data: {id:this.sdkBaseInfo.id,
                unitId:this.sdkBaseInfo.unitId,
                name:this.sdkBaseInfo.name,
                version:this.sdkBaseInfo.version,
                language:this.sdkBaseInfo.language,
                remark:this.sdkBaseInfo.remark}
            }).then(rsp => {
                // console.log(rsp)
                if (rsp.data){
                  this.$parent.stepsObj.active++
                  this.$route.query.sdkId = rsp.data
                  this.$router.push({
                    // path: '/openBiz/openBizDetail',
                    name:"OpenBizOpenBizDetail",
                    params:{ id:this.$route.params.id},
                    query: { tag: 'sdkAdd',sdkId:this.$route.query.sdkId, addStep:this.$parent.stepsObj.active }
                  })
                }
            }).catch(e => {
              let _this = this;
              let time=5;
              let intervalID = window.setInterval(function() {
                time--;
                if (time <= 0) {
                  clearInterval(intervalID);
                  _this.openIsDisabled=false
                }
              }, 1000);
              console.log(e)
            });
          }else {
            return false
          }
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .myFormBox {
    width: 72%;
    margin: 0 auto;

    h3 {
      margin-bottom: 20px;
      text-align: center;
      font-size: 24px;
      color: #333333;
    }

    p {
      text-align: center;
      margin-bottom: 20px;
    }
  }
</style>
