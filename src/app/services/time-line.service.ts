import { HttpClient } from '@angular/common/http';
import { effect, Injectable } from '@angular/core';
import * as CryptoJS1 from 'crypto-js';
import { map, Observable, of } from 'rxjs';

import { environment } from '../../environments/environment';
import { TIMELINEKeysModel } from '../models/cryptos/time-line-keys.model';
import { TimeLineModel } from '../models/time-line.model';
import { StateService } from '../shared/services/state.service';
import { FlagsModel } from '../models/flag.model';
import { EncryptDecryptModel } from '../models/encrypt-decrypt/encrypt-decrypt.model';

@Injectable({
  providedIn: 'root'
})
export class TimeLineService {

  API_TIME_LINE: string = environment.ApiTimeLine
  API_KANBAN: string = environment.ApiKanban
  API_SPIDER_TUBE: string = environment.ApiSpiderTube;
  
  timeLineKeys!: TIMELINEKeysModel
  constructor(
    private http: HttpClient,
    private stateService: StateService
  ) {
    effect(() => {
      this.timeLineKeys = this.stateService.keysCryptoTimeLineSignalComputed()
    })
  }

  createFlag(time_line: TimeLineModel): Observable<EncryptDecryptModel> { //EncryptDecryptModel

    let encrypto = this.encryptBody(time_line, this.timeLineKeys.BY.tl1)

    let newValEncrypto = {
      id: 0,
      a: this.timeLineKeys.BY.tl1 + encrypto
    }
    return this.http.post<EncryptDecryptModel>(`${this.API_TIME_LINE}/controller`, newValEncrypto).pipe(
      map(res => {
        return res
      })
    )
  }


  updateFlag(time_line: TimeLineModel): Observable<EncryptDecryptModel> { //EncryptDecryptModel

    let encrypto = this.encryptBody(time_line, this.timeLineKeys.BY.tl2)

    let newValEncrypto = {
      id: 1,
      a: this.timeLineKeys.BY.tl2 + encrypto
    }
    return this.http.put<EncryptDecryptModel>(`${this.API_TIME_LINE}/controller`, newValEncrypto).pipe(
      map(res => {
        return res
      })
    )
  }


  getAllTimeLineById(): Observable<TimeLineModel[]> {
    let val = this.timeLineKeys.BY.tl3 + 'U2FsdGVkX1+TVq5MkDFDYrTSGvujWOb9'
    return this.http.get<TimeLineModel[]>(`${this.API_TIME_LINE}/controller?val=${val}`).pipe(
      map(res => {
        let timeLine = this.dencryptBody(res, this.timeLineKeys.BY.tl3) // criar chave GET
        return timeLine
      })
    )
  }


  deleteById(id: string, flag: string): Observable<EncryptDecryptModel> {
    return this.http.delete<EncryptDecryptModel>(`${this.API_TIME_LINE}/controller?id=${id}&flag=${flag}`).pipe(
      map(res => {
        return res
      })
    )
  }


  updateSocialMediasChipsFlag(time_line: TimeLineModel): Observable<EncryptDecryptModel> { //EncryptDecryptModel

    let encrypto = this.encryptBody(time_line, this.timeLineKeys.BY.tl2)

    let newValEncrypto = {
      id: 1,
      a: this.timeLineKeys.BY.tl2 + encrypto
    }
    return this.http.put<EncryptDecryptModel>(`${this.API_TIME_LINE}/controller/medias-chips`, newValEncrypto).pipe(
      map(res => {
        return res
      })
    )
  }


  updateKanbanObjectId(updateKanbanObjectId: any): Observable<EncryptDecryptModel> { //EncryptDecryptModel

    let encrypto = this.encryptBody(updateKanbanObjectId, this.timeLineKeys.BY.tl2)

    let newValEncrypto = {
      id: 4,
      a: this.timeLineKeys.BY.tl2 + encrypto
    }
    return this.http.put<EncryptDecryptModel>(`${this.API_KANBAN}/controller/object`, newValEncrypto).pipe(
      map(res => {
        return res
      })
    )
  }

  updateSpiderTubeObjectId(updateKanbanObjectId: any): Observable<EncryptDecryptModel> { //EncryptDecryptModel

    let encrypto = this.encryptBody(updateKanbanObjectId, this.timeLineKeys.BY.tl2)

    let newValEncrypto = {
      id: 4,
      a: this.timeLineKeys.BY.tl2 + encrypto
    }
    return this.http.put<EncryptDecryptModel>(`${this.API_SPIDER_TUBE}/controller/object`, newValEncrypto).pipe(
      map(res => {
        return res
      })
    )
  }



  encryptBody(inBody: any, key: any) {
    const iamEncrypt: any = CryptoJS1.AES.encrypt(JSON.stringify(inBody), key,
      {
        keySize: 128 / 8,
        iv: key,
        mode: CryptoJS1.mode.CBC,
        padding: CryptoJS1.pad.Pkcs7
      }).toString();
    // const neyBody: any = { a: iamEncrypt };
    // this.decryptSignIn(neyBody)
    return iamEncrypt

  }


  dencryptBody(inBody: any, key: string) {
    // inBody = JSON.parse(inBody)
    let decrypted = undefined;
    decrypted = CryptoJS1.AES.decrypt(inBody.a, key);
    const timeLine = decrypted.toString(CryptoJS1.enc.Utf8);
    return JSON.parse(timeLine)
  }


}



