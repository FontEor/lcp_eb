const fs = require("fs");

fs.copyFile(
  "patch/cloud-screenshot.png",
  "dist/international/cloud-screenshot.png",
  function callback(err) {
    if (err) throw err;
    console.log(
      "Copy cloud-screenshot.png patch to dist/international successfully!"
    );
  }
);

fs.copyFile(
  "patch/notice.html",
  "dist/international/notice.html",
  function callback(err) {
    if (err) throw err;
    console.log("Copy notice.html patch to dist/international successfully!");
  }
);
