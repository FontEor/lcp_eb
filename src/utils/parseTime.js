const parseTime = {
  /**
   * 用于格式化表格中时间数据的方法
   * @description 将时间戳、时间字符串等，格式化为正确的时区时间 格式化结果：“2021-3-12 09:40:17”
   */
  timeInTable: params => {
    typeof params === "string" && params.replace(".000+0000","")
    const timestamp = new Date(params)
    return params
      ? `${timestamp.toLocaleDateString().replaceAll("/", "-")} ${
          timestamp.toTimeString().split(" ")[0]
        }`
      : "";
  }
};

export default parseTime;
