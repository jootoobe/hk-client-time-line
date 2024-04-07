class KeysModel {
  signInCryptoKey = '⚠️T3@$$%¨&)(_+-0@#!AIzaSRyvOumu09872635GOsd_Fvc{14785147Ujy}' // for dev local

  localStorage = {
    cryptoKey: '123', // SpiderShare
  }

  timeLineBody = {
    timeLineEncryptBody: ''
  }
}

export class EncryptDecryptKeyModel {
  spiderShareCryptoKeys: KeysModel = new KeysModel()
}


export class IAMEncryptDecryptKeyModel {
  constructor(
    public SICK: string, //signInCryptoKey
    public LS: { // localStorage
      ss: string, // spider-share
    }
  ) {

  }
}
