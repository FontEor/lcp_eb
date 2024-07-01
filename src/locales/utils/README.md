# 国际化脚本工具使用说明

## 替换数据源翻译脚本运行方法

1. 将清洗后的翻译文本文件拷贝至目录下，如：src/locales/utils/zh2enSourceTranslation.txt
2. 修改格式化翻译文本文件的脚本 formatTranslation.js 配置
   1. 修改输入文件——翻译文本文件的路径（inputFilePath），如："zh2enSourceTranslation.txt"
   2. 修改输出文件——双语翻译映射 JSON 文件的路径（outputFilePath），如："zh2enTranslation.json"
3. 执行 `node src/locales/utils/formatTranslation.js` 得到双语翻译映射 JSON 文件，如：src/locales/utils/zh2enTranslation.json
4. 修改解析双语翻译映射文件的脚本 parseTranslation.js 配置
   1. 修改双语翻译映射 JSON 文件的路径（translationFilePath），如："zh2enTranslation.json"
   2. 修改输入文件——待翻译区域替换数据源文件的路径（inputLocaleFilePath），如："../zh-cn.json"
   3. 修改输出文件——目标区域替换数据源文件的路径（outputLocaleFilePath），如："../en-us.json"
5. 执行 `node src/locales/utils/parseTranslation.js` 得到目标区域替换数据源文件，如：src/locales/en-us.json
