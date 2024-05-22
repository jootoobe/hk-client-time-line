// Este ambiente é igual o LOCAL, mas não pode ser deletado porque quando o build é criado os dados saem desse arquivo.
// Já o arquivo local é utilizado única e exclusivamente para o npm start ou start-loc
// Implementação necessária a partir do Angular 15
export const environment = {
  production: false,
  helloEnvironment: 'local environment',

  // ApiIam: 'http://localhost:3200/api-iam',
  ApiIam: 'https://iam.spider-share.com/api-iam', //http://hk-iam-back-spidershare.us-east-1.elasticbeanstalk.com
  ApiIam2: 'http://localhost:3200/api-iam/c', // Get crypto data


  // API Time-line
  ApiTimeLine: 'http://localhost:3001/api-time-line',

  //Kanban
  ApiKanban: 'http://localhost:3002/api-kanban',
  

  styleSpiderShare: 'http://localhost:4200',

  // urlTranslate: 'http://localhost:4200', // running in client folder only -- translator points to Pro SpiderShare assets in function of PWA { prefix: `${urlTranslate}/assets/i18n/TIME-LINE/canvas-time-line/top-div/`, suffix: ".json" },
  urlTranslate: '.', //dev local,

  assetsProd: 'http://localhost:4201',

  isIdValidId: '15&¨%$856327QWS!!@P', // validação para o id da url flag_id_b896-fa87-77fa-521e-30c5
  timeLineId: '16&¨!@95W3s7QWS,!@Ç' // time-line id seta o localstorage quando clica na bandeira Object('663b81615ba9150b416ea2ef')
};
