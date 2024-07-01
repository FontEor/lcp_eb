<template>
  <div class="message-receive app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane
        v-for="{ label, name } in tabPaneList"
        :key="name"
        :label="label"
        :name="name"
      >
        <PlatformMessage
          v-if="name === 'platformMessage' && activeName === 'platformMessage'"
          :msgType="1"
        />
        <MessageTable
          v-else-if="name === 'apiMessage' && activeName === 'apiMessage'"
          :msgType="2"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import PlatformMessage from "@/views/intranet/messageReceive/platformMessage/index.vue";
import MessageTable from "@/views/messageManager/messagetable.vue";

export default {
  name: "MessageReceive",
  components: { PlatformMessage, MessageTable },
  data() {
    return {
      activeName: "platformMessage",
      tabPaneList: [
        { label: "平台消息", name: "platformMessage" },
        { label: "API消息", name: "apiMessage" },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.message-receive {
}
</style>