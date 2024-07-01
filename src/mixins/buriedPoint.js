import pageClick from "@/utils/pageClick.js";

export default {
  methods: {
    // 点击事件埋点
    clstag(intranetId, extranetId) {
      return pageClick(intranetId, extranetId);
    }
  }
};
