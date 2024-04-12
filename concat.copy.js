const concat = require("concat");
const fs = require('fs-extra');
let files = "../../back/hk-back-time-line/client/hk-client-time-line/browser/";


(async function build() {
  let val = []

  fs.readdirSync(files).forEach(file => {

    if (file.includes('polyfills')) {
      val.push(`${files}${file}`)
    }
    if (file.includes('styles')) {
      // val.push(`${files}${file}`)
    }

    if (file.includes('main')) {
      val.push(`${files}${file}`)
    }
  });

  // if(val.lenght === 2) {

  // }

  await concat(val, `${val[0]}`);
  setTimeout(() => {
    // fs.remove(`${val[0]}`);
    fs.remove(`${val[1]}`);
    fs.remove(`${val[2]}`);
    fs.remove(`../../back/hk-back-time-line/client/hk-client-time-line/browser/index.html`);
    // await fs.remove(`../../back/hk-back-time-line/client/hk-client-time-line/browser/${val}`);
  }, 3000)

})();
