const regExp = {
  // USF表单相关验证
  normal: /^[a-zA-Z0-9_\-.#\u4e00-\u9fa5]+$/,

  // 检测邮箱
  email: /^[a-zA-Z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,

  // 检测中文
  chinese: /^[\u4e00-\u9fa5]*$/,

  // 检测英文
  english: /^[a-zA-Z]*$/,

  // 域名
  url: /^(http|https)?(:\/\/)?[-A-Za-z0-9+&@#\/%?=~_|!:,.;]+[-A-Za-z0-9+&@#\/%=~_|]$/,

  // 英文字母、数字、下划线
  engNumUnder: /^[a-zA-Z0-9_]*$/,

  // 11位手机号
  mobile: /^1[3456789]{1}[0-9]{9}$/,

  // 中文、英文字母、数字、下划线
  zhEngNumUnder: /^[\u4E00-\u9FA5\uF900-\uFA2D0-9a-zA-Z_]+$/,

  // 扩展字段枚举值校验
  enumValue: /^([\u4E00-\u9FA5\uF900-\uFA2D0-9a-zA-Z_]+\:[\u4E00-\u9FA5\uF900-\uFA2D0-9a-zA-Z_]+)(,[\u4E00-\u9FA5\uF900-\uFA2D0-9a-zA-Z_]+\:[\u4E00-\u9FA5\uF900-\uFA2D0-9a-zA-Z_]+)*$/,

  //数字 小数点后两位
  number: /^\d+.?\d{0,2}$/,
};
export default regExp;
