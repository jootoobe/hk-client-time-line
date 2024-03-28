const concat = require("concat");
const fs = require('fs-extra');
let files = "../../back/Hk-back-time-line/client/Hk-client-time-line/browser/";


(async function build() {


  fs.readdirSync(files).forEach(file => {

    if (file.includes('polyfills')) {
      fs.remove(`../../back/Hk-back-time-line/client/Hk-client-time-line/browser/index.html`)
      fs.remove(`../../back/Hk-back-time-line/client/Hk-client-time-line/browser/${file}`)
    }
    if (file.includes('styles')) {
      fs.remove(`../../back/Hk-back-time-line/client/Hk-client-time-line/browser/${file}`)
    }
  });
})();
