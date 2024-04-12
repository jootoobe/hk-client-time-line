import { HttpClient } from '@angular/common/http';
import { effect, Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { map, Observable, of } from 'rxjs';

import { environment } from '../../environments/environment';
import { TIMELINEKeysModel } from '../models/cryptos/time-line-keys.model';
import { TimeLineModel } from '../models/time-line.model';
import { StateService } from '../shared/services/state.service';

@Injectable({
  providedIn: 'root'
})
export class TimeLineService {

  API_TIME_LINE: string = environment.ApiTimeLine
  timeLineKeys!: TIMELINEKeysModel
  constructor(
    private http: HttpClient,
    private stateService: StateService
  ) {
    effect(() => {
      this.timeLineKeys = this.stateService.keysCryptoTimeLineSignalComputed()
    })
  }

  createFlag(time_line: TimeLineModel): Observable<any> {

    let encrypto = this.encryptBody(time_line, this.timeLineKeys.BY.tl1)

    let newValEncrypto = {
      id: 0,
      a: this.timeLineKeys.BY.tl1 + encrypto
    }
    return this.http.post<TimeLineModel>(`${this.API_TIME_LINE}/controller`, newValEncrypto).pipe(
      map(res => {
        return res
      })
    )
  }



  encryptBody(inBody: any, key: any) {
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


  dencryptBody(inBody: any, key: string) {
    // inBody = JSON.parse(inBody)
    let decrypted = undefined;
    decrypted = CryptoJS.AES.decrypt(inBody.a, key);
    const timeLine = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(timeLine)
  }


}



