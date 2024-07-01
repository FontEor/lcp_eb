<template>
  <div>
    <el-popover :key="popKey" ref="popover5" width="220" placement="bottom" v-model="apiAliasPopVisible">
      <div style="text-align: left; margin: 0;width: 220px">
        <el-checkbox-group v-model="checkedAlias">
          <template v-for="alias in aliasList">
            <el-checkbox v-if="alias.distributed" disabled :label="alias.aliasDes" :key="alias.serviceAliasId">{{alias.aliasDes}}</el-checkbox>
            <el-checkbox v-else :label="alias.aliasDes" :key="alias.serviceAliasId">{{alias.aliasDes}}</el-checkbox>
          </template>
        </el-checkbox-group>
      </div>
      <br/>
      <div style="text-align: center; margin: 0; width: 220px">
        <el-button @click="apiAliasPopVisible = false"  >取 消</el-button>
        <el-button type="primary" @click="saveAlias(id,checkedAlias)"  >确 定</el-button>
      </div>
    </el-popover>
    <div style="text-align: center; margin: 0;">
      <el-button v-popover:popover5 type="text" @click="checkData">分配别名</el-button>
    </div>
  </div>
</template>


<script>
import {Message} from "@lui/lui-ui";
import gwApiRequest from '@/utils/gwApiRequest';

  export default {
    props: ["id"],
    data: function () {
      return {
        popKey: 'myPop',
        checked: true,
        aliasList: [],
        checkedAlias: [],
        apiAliasPopVisible: false
      };
    },
    methods: {
      checkData() {
        this.aliasList = []
        this.checkedAlias = []
        gwApiRequest({
          method: "post",
          url: "/ApiManagerService/queryApiApplyAlias",
          data: JSON.stringify([{
            apiApplyId: this.id
          }])
        }).then(rsp => {
          this.aliasList = rsp.data.serviceAliasList
          this.checkedAlias = rsp.data.checkedAlias;
          this.apiAliasPopVisible = true
          console.log("--------------id:" + this.id + ",aliasList length:"+this.aliasList.length)
          if (this.aliasList.length == 0) {
            this.$message({type: 'error',message: '请先添加别名!' })
            this.popKey = 'myPop'+ Date.parse(new Date())
            this.apiAliasPopVisible = false;
            return;
          }
        }).catch(e => {
          console.log(e)
        })
      },
      saveAlias(id, alias) {
        console.log("saveAlias id:" + id + ",alias:" + alias)
        gwApiRequest({
          method: "post",
          url: "/ApiManagerService/assignAlias",
          data: JSON.stringify([{
            id: id,
            aliasList: alias
          }])
        }).then(rsp => {
          Message.success("别名分配成功");
          location.reload();
        }).catch(e => {
          console.log(e);
        });
        this.apiAliasPopVisible = false;
      },
    }
  };
</script>

<style scoped>

</style>
