const fs = require("fs");

fs.copyFile(
  "patch/cloud-screenshot.png",
  "dist/lcp_web/cloud-screenshot.png",
  function callback(err) {
    if (err) throw err;
    console.log(
      "Copy cloud-screenshot.png patch to dist/lcp_web successfully!"
    );
  }
);

fs.copyFile("patch/notice.html", "dist/lcp_web/notice.html", function callback(
  err
) {
  if (err) throw err;
  console.log("Copy notice.html patch to dist/lcp_web successfully!");
});
