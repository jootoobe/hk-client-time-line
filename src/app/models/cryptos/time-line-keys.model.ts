export class TIMELINEKeysModel {
  constructor(
    public SICK: string, //signInCryptoKey
    public LS: { // localStorage
      ss: string, // spider-share
      tl1: string,
      idb1: string
    },
    public BY: { // body
      tl1: string // createFlag
    }
  ) {

  }
}
