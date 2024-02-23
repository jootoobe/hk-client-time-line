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



};
