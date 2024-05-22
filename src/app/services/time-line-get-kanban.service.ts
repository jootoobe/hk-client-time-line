import { HttpClient } from '@angular/common/http';
import { effect, Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { map, Observable, of } from 'rxjs';

import { environment } from '../../environments/environment';
import { TIMELINEKeysModel } from '../models/cryptos/time-line-keys.model';
import { StateService } from '../shared/services/state.service';
import { EncryptModel } from '../../../../hk-pro-client-spidershare/src/app/models/cryptos/subscriptions/encrypt.model';

@Injectable({
  providedIn: 'root'
})
export class TimeLineGetKanbanService {

  API_KANBAN: string = environment.ApiKanban
  timeLineKeys!: TIMELINEKeysModel
  constructor(
    private http: HttpClient,
    private stateService: StateService
  ) {
    effect(() => {
      this.timeLineKeys = this.stateService.keysCryptoTimeLineSignalComputed()
    })
  }


  getTimeLineKanbanById(): Observable<any> {
    console.log('ooooooooooo')
    let val = this.timeLineKeys.BY.tl3 + 'U2FxdGPkX1+TVa5MkDFDYrTSGvujWOb0'
    return this.http.get<any>(`${this.API_KANBAN}/controller/time-line-kanban?val=${val}`).pipe(
      map(res => {
        // let timeLine = this.dencryptTimeLineGetKanbanBody(res, this.timeLineKeys.BY.tl3) // criar chave GET
        // return timeLine
      })
    )
  }



  encryptTimeLineGetKanbanBody(inBody: any, key: any) {
    const iamEncrypt: any = CryptoJS.AES.encrypt(JSON.stringify(inBody), key,
      {
        keySize: 128 / 8,
        iv: key,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }).toString();
    // const neyBody: any = { a: iamEncrypt };
    // this.decryptSignIn(neyBody)
    return iamEncrypt

  }


  dencryptTimeLineGetKanbanBody(inBody: any, key: string) {
    // inBody = JSON.parse(inBody)
    let decrypted = undefined;
    decrypted = CryptoJS.AES.decrypt(inBody.a, key);
    const timeLine = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(timeLine)
  }


}



