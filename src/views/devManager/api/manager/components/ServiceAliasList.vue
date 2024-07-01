<template>
  <div>
    <div style="text-align: center; margin: 0;">
      <el-tag :key="tag.serviceAliasId" v-for="tag in savedAliasList" size="mini" style="margin-left: 5px; float: left">{{tag.alias}}</el-tag>
    </div>
  </div>
</template>


<script>
import gwApiRequest from '@/utils/gwApiRequest';

  export default {
    props: ["id"],
    data: function () {
      return {
        popKey: 'myPop2',
        checked: true,
        aliasList: [],
        savedAliasList: [],
        checkedAlias: [],
        visible: false
      };
    },
    created() {
      this.queryAliasList2()
    },
    methods: {
      queryAliasList2() {
        console.log("child----------:"+this.id);
        gwApiRequest({
          method: "post",
          url: "/ApiManagerService/queryApiApplyAlias",
          data: JSON.stringify([{
            apiApplyId: this.id
          }])
        }).then(rsp => {
          this.savedAliasList = rsp.data.checkedServiceAliasList
        }).catch(e => {
          console.log(e)
        })
      }
    }
  };
</script>

<style scoped>

</style>
