// Este ambiente é igual o LOCAL, mas não pode ser deletado porque quando o build é criado os dados saem desse arquivo.
// Já o arquivo local é utilizado única e exclusivamente para o npm start ou start-loc
// Implementação necessária a partir do Angular 15
export const environment = {
  production: false,
  helloEnvironment: 'local',

  // ApiIam: 'http://localhost:3200/api-iam',
  ApiIam: 'https://iam.spider-share.com/api-iam', //http://hk-iam-back-spidershare.us-east-1.elasticbeanstalk.com

  // API
  ApiTimeLine: 'http://localhost:3001/api-time-line',


  // A Aplicação principal está gerando número aleatório no build - 31d50b1623a24feb
  // Solução definitiva tem que fazer a mesma coisa com o build das aplicações filhas
  // ATENÇÃO isso pode impactar da aplicação nova não carregar as atualizações sem um ctrl + Shift + R
  // styleSpiderShare: 'http://localhost:4200/styles.css', https://www.spider-share.com/styles.31d50b1623a24feb.css

  styleSpiderShare:'https://www.spider-share.com/styles-6TFC6SEM.css', //'https://www.spider-share.com/styles-6TFC6SEM.css', //'http://localhost:4200',


    // urlTranslate: 'http://localhost:4200', // running in client folder only -- translator points to Pro SpiderShare assets in function of PWA { prefix: `${urlTranslate}/assets/i18n/TIME-LINE/canvas-time-line/top-div/`, suffix: ".json" },
    urlTranslate: '.', //dev local,
};
