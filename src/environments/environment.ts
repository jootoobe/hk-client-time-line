// Este ambiente é igual o LOCAL, mas não pode ser deletado porque quando o build é criado os dados saem desse arquivo.
// Já o arquivo local é utilizado única e exclusivamente para o npm start ou start-loc
// Implementação necessária a partir do Angular 15
export const environment = {
  production: false,
  helloEnvironment: 'local environment',

  // ApiIam: 'http://localhost:3200/api-iam',
  ApiIam: 'http://hk-api-iam-spidershare.us-east-1.elasticbeanstalk.com/api-iam',

  // API
  ApiTimeLine: 'http://localhost:3001/api-time-line',

  //Kanban
  ApiKanban: 'http://localhost:3002/api-kanban',

  keyEncryptSignInUp: 'TUc0emRqRXpkdw123123Senhor@#!AIzaSyDDgRhFRyvOumWOmo2OX1uc6NjGOsd_Fvc',

  styleSpiderShare: 'http://localhost:4200/styles.css',

  assetsProd: 'http://localhost:4201',
  // urlTranslate: 'http://localhost:4200', // running in client folder only -- translator points to Pro SpiderShare assets in function of PWA { prefix: `${urlTranslate}/assets/i18n/TIME-LINE/canvas-time-line/top-div/`, suffix: ".json" },
  urlTranslate: '.', //dev local


  // TIME_LINE Keys IndexDb - key database '0000'
  timeLineEncryptIndexDb: 'ZZZZZZZwse##@@@@@$$$$123Vamo!!!QueVamo',

  // TIME_LINE Keys LocalStorage
  timeLineEncryptLocalStorage: 'UUUç7777wse##1;fplçorekm@$ç$$123Vamo!!!QueVamo',


  // TIME_LINE Keys Body
  timeLineEncryptBody: 'flag_id_b765-3d7e-c35b-3Vamo!!!QueVamo',



};
