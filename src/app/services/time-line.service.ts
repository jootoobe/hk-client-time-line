import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { map, Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { TimeLineModel } from '../models/time-line.model';

@Injectable({
  providedIn: 'root'
})
export class TimeLineService {

  API_TIME_LINE: string = environment.ApiTimeLine

  constructor(private http: HttpClient) { }

  createFlag(lineTime: TimeLineModel): Observable<any> {
    return this.http.post<TimeLineModel>(`${this.API_TIME_LINE}/vamo_que_vamo`, lineTime).pipe(
      map(res => {
        return res
      })
    )
  }



  // encryptBody(inBody: any) {
  //   const iamEncrypt: any = CryptoJS.AES.encrypt(JSON.stringify(inBody), timeLineEncryptBody,
  //     {
  //       keySize: 128 / 8,
  //       iv: timeLineEncryptBody,
  //       mode: CryptoJS.mode.CBC,
  //       padding: CryptoJS.pad.Pkcs7
  //     }).toString();
  //   const neyBody: any = { a: iamEncrypt };
  //   // this.decryptSignIn(neyBody)
  //   return neyBody

  // }


  // dencryptBody(inBody: any) {
  //   // inBody = JSON.parse(inBody)
  //   let decrypted = undefined;
  //   decrypted = CryptoJS.AES.decrypt(inBody.a, timeLineEncryptBody);
  //   const timeLine = decrypted.toString(CryptoJS.enc.Utf8);
  //   return JSON.parse(timeLine)
  // }


}



