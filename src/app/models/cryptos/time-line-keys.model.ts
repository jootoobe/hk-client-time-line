export class TIMELINEKeysModel {
  constructor(
    public SICK: string, //signInCryptoKey
    public LS: { // localStorage
      ss: string, // spider-share
      tl1: string,
      idb1: string // indexDB
    },
    public BY: { // body
      tl1: string, // createFlag 16
      tl2: string, // updateFlag 18
      tl3: string // updateFlag 22

    }
  ) {

  }
}
