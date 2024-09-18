const concat = require("concat");
const fs = require('fs-extra');
let files = "../../back/hk-back-time-line/client/hk-client-time-line/browser/";


(async function build() {


  fs.readdirSync(files).forEach(file => {

    if (file.includes('polyfills')) {
      // fs.remove(`../../back/hk-back-time-line/client/hk-client-time-line/browser/index.html`)
      // fs.remove(`../../back/hk-back-time-line/client/hk-client-time-line/browser/${file}`)
    }
    if (file.includes('styles')) {
      // fs.remove(`../../back/hk-back-time-line/client/hk-client-time-line/browser/${file}`)
    }
  });
})();
