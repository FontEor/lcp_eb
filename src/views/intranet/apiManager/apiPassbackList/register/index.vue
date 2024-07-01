<template>
  <div class="register">
    <Title text="注册API" />
    <Steps :active="active" :titleList="titleList" />
    <BasicInfo v-if="active === 0" :active.sync="active" :id.sync="id" />
    <RegisterSuccess v-else-if="active === 1" :active.sync="active" :id="id" />
  </div>
</template>

<script>
import Title from "@/components/Title.vue";
import Steps from "@/components/Steps.vue";
import BasicInfo from "@/views/intranet/apiManager/apiPassbackList/register/basicInfo.vue";
import RegisterSuccess from "@/views/intranet/apiManager/apiPassbackList/register/registerSuccess.vue";

export default {
  name: "Register",
  components: { Title, Steps, BasicInfo, RegisterSuccess },
  data() {
    return {
      active: 0,
      titleList: ["填写API基本信息", "注册成功"],
      id: 0,
    };
  },
};
</script>

<style lang="scss" scoped>
.register {
  margin: 0 20px;
  padding: 20px;
  background: #fff;
  min-height: calc(100vh - 120px);
}
</style>