// Este ambiente é igual o LOCAL, mas não pode ser deletado porque quando o build é criado os dados saem desse arquivo.
// Já o arquivo local é utilizado única e exclusivamente para o npm start ou start-loc
// Implementação necessária a partir do Angular 15
export const environment = {
  production: false,
  helloEnvironment: 'local',

  ApiIam: 'http://localhost:3200/api-iam',

  // ApiIam: 'https://iam.spider-share.com/api-iam', //http://hk-iam-back-spidershare.us-east-1.elasticbeanstalk.com

  // API
  ApiTimeLine: 'http://localhost:3001/api-time-line',

  //Kanban
  ApiKanban: 'http://localhost:3002/api-kanban',

  keyEncryptSignInUp: 'TUc0emRqRXpkdw123123Senhor@#!AIzaSyDDgRhFRyvOumWOmo2OX1uc6NjGOsd_Fvc',

  // A Aplicação principal está gerando número aleatório no build - 31d50b1623a24feb
  // Solução definitiva tem que fazer a mesma coisa com o build das aplicações filhas
  // ATENÇÃO isso pode impactar da aplicação nova não carregar as atualizações sem um ctrl + Shift + R
  // styleSpiderShare: 'http://localhost:4200/styles.css', https://www.spider-share.com/styles.31d50b1623a24feb.css

  styleSpiderShare: 'http://localhost:4200/styles.css',


  assetsProd: 'http://localhost:4201',

  // urlTranslate: 'http://localhost:4200', // running in client folder only -- translator points to Pro SpiderShare assets in function of PWA { prefix: `${urlTranslate}/assets/i18n/TIME-LINE/canvas-time-line/top-div/`, suffix: ".json" },
  urlTranslate: '.', //dev local,

  // TIME_LINE Keys IndexDb - key database '0000'
  timeLineEncryptIndexDb: 'ZZZZZZZwse##@@@@@$$$$123Vamo!!!QueVamo',

  // TIME_LINE Keys LocalStorage
  timeLineEncryptLocalStorage: 'UUUç7777wse##1;fplçorekm@$ç$$123Vamo!!!QueVamo',

  // TIME_LINE Keys Body
  timeLineEncryptBody: 'flag_id_b765-3d7e-c35b-3Vamo!!!QueVamo',

};
