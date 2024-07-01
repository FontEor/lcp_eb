<template>
  <div class="myFormBox">
    <h3>下载SDK工程文件</h3>
    <p>根据您上一步选择的接口，系统生成了一个SDK工程，您可下载该工程文件，并进一步对接口进行自测</p>
    <el-row style="text-align: center;margin-bottom: 10px">
      <el-button type="primary" @click="downloadProj">下载SDK工程文件</el-button>
    </el-row>
    <el-row style="text-align: center;margin-bottom: 10px">
      <el-link type="primary" :underline="false" :href="this.apiOwnTestUrl" target="_blank">如何对接口进行自测？</el-link>
    </el-row>
    <el-form ref="form"  label-width="0px"  size="medium" style="width: 40%;margin: 30px auto;">
      <el-form-item style="text-align: center" >
        <el-button class="last" style="" @click="lastStep">上一步</el-button>
        <el-button
          type="primary"
          style=""
          @click="nextStep()" >下一步</el-button>
      </el-form-item>
    </el-form>

    <el-dialog
      class="process-dialog"
      :visible.sync="downloadDialogVisible"
      width="30%"
      :show-close="false"
      :close-on-click-modal="false"
      center>
      <el-progress :percentage="percentage" :format="format" :color="colors"></el-progress>
      <el-row class="dialog-row">
        <span v-if="percentage < 100  && recordSdk.failNum==0">正在生成工程文件...</span>
        <span v-else-if="percentage >= 100 && recordSdk.failNum==0">SDK生成完毕,请下载SDK工程文件...</span>
        <span v-else-if="recordSdk.failNum>0" style="color:#f56c6c">发生错误:{{recordSdk.failCause}} </span>
      </el-row>
      <el-row class="dialog-row">
        <el-button @click="cancelDownloadDialogVisible">关闭</el-button>
        <el-button @click="downloadSdk" v-if="this.percentage >= 100 && this.recordSdk.failNum==0" type="primary">下载</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import axios from "axios";
  import request from "@/utils/request";
  export default {
    name: 'sdkAddStep3',
    data () {
      return {
        apiOwnTestUrl:'',
        downloadDialogVisible: false,
        percentage:0,
        recordSdk:{
          finishPct:'',
          finishNum:'',
          fileName:'',
          failNum:'',
          failCause:'',
          jssKey:''
        },
        timer:null,
        colors: [
          {color: '#f56c6c', percentage: 20},
          {color: '#e6a23c', percentage: 40},
          {color: '#1989fa', percentage: 60},
          {color: '#6f7ad3', percentage: 80},
          {color: '#5cb87a', percentage: 100}
        ]
      }
    },
    created() {
      this.apiOwnTestUrl=window.location.protocol+"//"+`${window.location.host}/#/`+`${window.env.docApiTest}`;
    },
    methods: {
      format(percentage) {
        return percentage >= 100 ? '完成' : `${percentage}%`;
      },
      downloadProj(){
        this.downloadDialogVisible = true
        let _this = this
        _this.loading = true
        request({
          url: "/sdk/createSdkPreFile",
          method: 'get',
          params:{sdkId:this.$route.query.sdkId}
        }).then(rsp => {
          if(rsp.data){
            const timer = setInterval(() =>{
              request({
                url: '/sdk/getLastBizSdkRecordPercentage',
                method: 'get',
                params:{recordId:rsp.data}
              }).then(prsp => {
                // console.log(prsp)
                this.percentage = parseInt(prsp.data.finishPct);
                this.recordSdk.failNum = prsp.data.failNum;
                if(this.recordSdk.failNum>0){
                  this.recordSdk.failCause=prsp.data.failCause;
                  clearInterval(this.timer);
                }
                if(this.percentage>=100){
                  if(this.recordSdk.failNum==0){
                    this.recordSdk.jssKey=prsp.data.jssKey
                  }
                  clearInterval(this.timer);
                }
              }).catch(pe => {
                console.log(pe)
                this.percentage=10
                _this.loading = false
              })
            }, 500);
            this.timer = timer
            this.$once('hook:beforeDestroy', () => {
              clearInterval(this.timer);
            })
          }
        }).catch(e => {
          console.log(e)
          this.percentage=10
          _this.loading = false
        })
      },
      lastStep:function () {
        this.$parent.stepsObj.active--
        this.$router.push({
          // path: '/openBiz/openBizDetail',
          name:"OpenBizOpenBizDetail",
          params:{ id:this.$route.params.id},
          query: { tag: 'sdkAdd',sdkId:this.$route.query.sdkId, addStep:this.$parent.stepsObj.active }
        })
      },
      nextStep:function () {
        this.$parent.stepsObj.active++
        this.$router.push({
          // path: '/openBiz/openBizDetail',
          name:"OpenBizOpenBizDetail",
          params:{ id:this.$route.params.id},
          query: { tag: 'sdkAdd',sdkId:this.$route.query.sdkId, addStep:this.$parent.stepsObj.active }
        })
      },
      downloadSdk(){
        let fileName = this.recordSdk.jssKey
        if(fileName!=null){
          let gwUploadRequest = axios.create({
            // 本地配置了proxyTable之后不需要配置baseUrl，其他环境需要这个baseUrl
            baseURL: window.env.gatewayFileBaseApi, // url = base url + request url
            withCredentials: true, // send cookies when cross-domain requests
            timeout: 100000, // request timeout
            headers: {
              'LOP-DN': window.env.gatewayUploadLopDn,
              'fileName':fileName
            },
            responseType: 'blob'
          })
          gwUploadRequest({
            url: "/lop/file/download",
            method: "get"
          }).then(drsp => {
            const blob = new Blob([drsp.data], { type: 'application/octet-stream' })
            if (typeof window.navigator.msSaveBlob !== 'undefined') {
              // 兼容IE，window.navigator.msSaveBlob：以本地方式保存文件
              window.navigator.msSaveBlob(blob, decodeURI(fileName))
            } else {
              // 创建新的URL并指向File对象或者Blob对象的地址
              const blobURL = window.URL.createObjectURL(blob)
              // 创建a标签，用于跳转至下载链接
              const tempLink = document.createElement('a')
              tempLink.style.display = 'none'
              tempLink.href = blobURL
              tempLink.setAttribute('download', decodeURI(fileName))
              // 兼容：某些浏览器不支持HTML5的download属性
              if (typeof tempLink.download === 'undefined') {
                tempLink.setAttribute('target', '_blank')
              }
              // 挂载a标签
              document.body.appendChild(tempLink)
              tempLink.click()
              document.body.removeChild(tempLink)
              // 释放blob URL地址
              window.URL.revokeObjectURL(blobURL)
            }
          }).catch(de => {
            console.log(de)
          });
        }else{
          this.$message.error('SDK文件不存在!');
        }
      },
      cancelDownloadDialogVisible:function () {
        clearInterval(this.timer);
        this.loading = false
        this.downloadDialogVisible=false
        this.percentage=0
        this.recordSdk.fileName=''
        this.recordSdk.failNum=0
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
  .dialog-row.el-row{
    text-align: center;
    margin: 10px auto;
  }

  .process-dialog >>> .el-dialog__header{
    display: none;
  }
</style>
