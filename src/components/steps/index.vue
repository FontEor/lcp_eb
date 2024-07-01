<template>
  <div>
    <h2 class="com-tit-mini" v-if="title">{{title}}</h2>
    <div class="my-step-bar">
      <el-steps :active="active" finish-status="success" class="my-steps" align-center>
        <el-step :title="item"  v-for="(item,index) in tiptitle" :key="index"></el-step>
      </el-steps>
    </div>
  </div>
</template>
<script>
export default {
  name: 'steps',
  props: {
    active: {
      required: true,
      type: Number
    },
    title: {
      required: false,
      type: String
    },
    tiptitle: {
      required: true,        
      type: Array
    }
  }
}
</script>
<style lang="scss" scoped>
.my-step-bar {
  width: 80%;
  margin: 25px auto 70px;
}
.com-tit-mini{
  font-size:16px;
  line-height:24px;
  font-weight: 600;
  padding-left:12px;
  position:relative;
  margin:0 0 20px;
  &:before{
    content:"";
    position:absolute;
    top:4px;
    left:0;
    width:3px;
    height:16px;
    background:#3c6ef0;
  }
}
</style>