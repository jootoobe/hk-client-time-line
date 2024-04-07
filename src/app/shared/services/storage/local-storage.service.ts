import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private items: any;

  constructor() {
    // this._items = JSON.parse(localStorage.getItem('items') || '[]'); // get the data at lunch
  }

  removeAllLocalStorag() {
    localStorage.clear()
  }

  removeLocalStorag(item: string) {
    localStorage.removeItem(item)
  }


  // Vários let de propósito não deixar código limpo pelo amor de deus kkkkk cache desgraçado
  getLocalStorag(item: string, key: any): any {
    let val = ''
    let getNewVal: any = ''
    val = item
    getNewVal = JSON.parse(localStorage.getItem(val) || '[]');
    // let getNewVal = JSON.parse(localStorage.getItem(item) as any);
    if (getNewVal) {
      let newVal: any = ''
      newVal = this.dencryptSetItemsLocal(getNewVal, key)
      return newVal
    }
    return undefined
  }

  setItems(item: string, inBody: any, key: string) {
    let newVal: any = ''
    newVal = this.encryptSetItemsLocal(inBody, key)
    localStorage.setItem(item, JSON.stringify(newVal));
  }



  dencryptSetItemsLocal(inBody: any, key: any) {
    try {
      let decrypted: any = '';
      let iam: any = ''
      let iam2: any = ''
      decrypted = CryptoJS.AES.decrypt(inBody.a, key);
      iam = decrypted.toString(CryptoJS.enc.Utf8);
      iam2 = JSON.parse(iam)
      // return JSON.parse(iam)
      return iam2
    } catch (error) {
      return { a: undefined }
    }
  }

  encryptSetItemsLocal(inBody: any, key: any) {
    let body = ''
    body = inBody
    try {
      const iamEncrypt: any = CryptoJS.AES.encrypt(JSON.stringify(body), key,
        {
          keySize: 128 / 8,
          iv: key,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }).toString();
      return { a: iamEncrypt }
    } catch (error) {
      return { a: undefined }
    }
  }

}
