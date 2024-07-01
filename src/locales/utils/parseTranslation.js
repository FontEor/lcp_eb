const fs = require("fs");
const path = require("path");

let translationFilePath = "zh2enTranslation.json";
let inputLocaleFilePath = "../zh-cn.json";
let outputLocaleFilePath = "../en-us.json";

translationFilePath = path.resolve(__dirname, translationFilePath);
inputLocaleFilePath = path.resolve(__dirname, inputLocaleFilePath);
outputLocaleFilePath = path.resolve(__dirname, outputLocaleFilePath);
let translationHashMap = {};

const getHashMapByReadFileSync = (filePath) => {
  let fileHashMap = {};
  try {
    const fileString = fs.readFileSync(filePath, "utf-8");
    fileHashMap = JSON.parse(fileString);
  } catch (error) {
    console.log(`Error reading file ${filePath}: ${error}`);
    throw new Error("Error in getHashMapByReadFileSync.");
  }
  return fileHashMap;
};
const reverseTranslationHashMap = (hashMap) => {
  const hashMapEntries = Object.entries(hashMap).map(([key, value]) => [
    value,
    key,
  ]);
  return Object.fromEntries(hashMapEntries);
};
const getEntries = ([key, value]) =>
  value instanceof Object
    ? [key, Object.entries(value).map(getEntries)]
    : [key, value];
const parseEntries = (previous, [key, value]) => {
  if (value instanceof Object) {
    return { ...previous, [key]: value.reduce(parseEntries, {}) };
  } else {
    value = translationHashMap[value] || value || "-";
    return { ...previous, [key]: value };
  }
};
const outputFileByWriteFileSync = (filePath, outputLocale) => {
  try {
    const fileString = JSON.stringify(outputLocale, null, 2);
    fs.writeFileSync(filePath, fileString, "utf-8");
  } catch (error) {
    console.log(`Error writing file ${filePath}: ${error}`);
    throw new Error("Error in outputFileByWriteFileSync.");
  }
};

const main = () => {
  const inputLocaleHashMap = getHashMapByReadFileSync(inputLocaleFilePath);
  translationHashMap = getHashMapByReadFileSync(translationFilePath);
  // 反转翻译映射键值
  // translationHashMap = reverseTranslationHashMap(translationHashMap);

  const inputLocaleEntries = Object.entries(inputLocaleHashMap).map(getEntries);
  const outputLocale = inputLocaleEntries.reduce(parseEntries, {});

  outputFileByWriteFileSync(outputLocaleFilePath, outputLocale);
};

main();
