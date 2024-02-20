const concat = require("concat");
const fs = require('fs-extra');


(async function build() {
  const files = [
    "./dist/Hk-client-time-line/browser/polyfills.js",
    "./dist/Hk-client-time-line/browser/main.js",
  ];
  var htmlContent = await buildIndexHtml();

  await concat(files, "./dist/Hk-client-time-line/browser/app-time-line.js");
  await fs.remove('./dist/Hk-client-time-line/browser/index.html')
  await fs.remove('./dist/Hk-client-time-line/browser/polyfills.js')
  await fs.remove('./dist/Hk-client-time-line/browser/main.js')
  await fs.writeFile('./dist/Hk-client-time-line/index.html', htmlContent)
})();



async function buildIndexHtml() {
  let fileHtmlIndex = `
  <!doctype html>
  <html lang="en" data-critters-container>
    <head>
      <meta charset="utf-8">
      <title>HkClientTimeLine</title>
      <base href="/">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="icon" type="image/x-icon" href="favicon.ico">
      <link rel="stylesheet" href="styles.css">
      <link rel="modulepreload" href="chunk-TT2A2SUP.js">
    </head>
    <body>
      <app-time-line></app-time-line>

      <script src="polyfills-RT5I6R6G.js" type="module"></script>
      <script src="main-WE25ATLQ.js" type="module"></script>
    </body>
  </html>



`;
  return fileHtmlIndex

};

// <!DOCTYPE html>
// <html lang="en">
//   <head>
//     <meta charset="utf-8">
//     <title>HkClientTimeLine</title>
//     <base href="/">
//     <meta name="viewport" content="width=device-width, initial-scale=1">
//     <link rel="icon" type="image/x-icon" href="favicon.ico">


//     <link href="style.css" rel="preload" as="style" onload="this.rel='stylesheet'">
//     <noscript>
//     <link rel="stylesheet" href="style.css">
//     </noscript>

//   </head>
// <body>
//   <app-time-line></app-time-line>
//   <script src="app-time-line.js" type="module"></script>
// </body>
// </html>
