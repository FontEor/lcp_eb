const fs = require("fs");
const path = require("path");
const readline = require("readline");

let inputFilePath = "zh2enSourceTranslation.txt";
let outputFilePath = "zh2enTranslation.json";

inputFilePath = path.resolve(__dirname, inputFilePath);
outputFilePath = path.resolve(__dirname, outputFilePath);

const chinese = [];
const english = [];
let index = 0;
const json = {};

try {
  const rl = readline.createInterface({
    input: fs.createReadStream(inputFilePath),
    output: process.stdout,
    terminal: false,
  });
  rl.on("line", (line) => {
    const str = line.trim();
    if (str) {
      if (index % 2 === 0) {
        chinese.push(str);
      } else {
        english.push(str);
      }
      index++;
    }
  });

  rl.on("close", () => {
    english.forEach((en, index) => {
      json[chinese[index]] = en;
    });
    fs.writeFileSync(outputFilePath, JSON.stringify(json, null, 2));
    console.log("####### 写入文件完成 #######");
  });
} catch (err) {
  console.error(err);
}
