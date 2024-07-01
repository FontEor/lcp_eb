import request_msg from "@/utils/request_msg";

const workOrder = {
  /**
   * 新消息提示
   *
   */
  newMessage: () => request_msg.post("/workOrder/newMessage"),
};

export default workOrder;
