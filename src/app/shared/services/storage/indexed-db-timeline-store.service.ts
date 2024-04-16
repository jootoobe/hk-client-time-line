import { effect, Injectable } from "@angular/core";
import * as CryptoJS from 'crypto-js';
import { IDBPDatabase, openDB } from "idb";
import { from, Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { TimeLineModel } from "../../../models/time-line.model";
import { TIMELINEKeysModel } from "../../../models/cryptos/time-line-keys.model";
import { StateService } from "../state.service";


/**
* **************************************** RULES INDEX-DB *******************************************************
* * * * * =================== Get ADD PUT - DELETE  is sent directly to the https service ============= * * * * *
* @param { 0000 }  IndexDb_key_0000 - Stores all data encrypted - used to load the application locally
* @param { 0001 }  IndexDb_key_0001 - (ADD GET PUT) Stores all data encrypted - which must be sent to the backend - The delete method updates the entire index but is sent directly to the back
* @param { Rules 0001 } Will_update_the_backend_when - 1º when string length reaches 5kb const KB changes: any = (len1 / 1024).toFixed(2); 2º when the page loads; 3º every hour it will be checked if data in key 0001

*/


type MyDBKeysTimeLine = keyof TimeLineModel;

@Injectable({
  providedIn: "root"
})
export class IndexDbTimeLineService {
  version = 1;
  databaseName = "SpiderShare";

  dbConnection$!: Observable<IDBPDatabase<MyDBKeysTimeLine>>;
  timeLineKeys!: TIMELINEKeysModel

  constructor(private stateService: StateService) {
    this.connectToIDBTimeLine()

    effect(() => {
      this.timeLineKeys = this.stateService.keysCryptoTimeLineSignalComputed()
    })
  }

  // Creating connection and banks in indexDB
  connectToIDBTimeLine() {
    this.dbConnection$ = from(
      openDB<MyDBKeysTimeLine>(this.databaseName, this.version, {
        upgrade(db) {
          // db.createObjectStore("Status", { keyPath: "AppName" });
          // db.createObjectStore("Kanban", { keyPath: "year" });
          db.createObjectStore("time_line", { keyPath: "year" });
        }
      })
    );

    return this.dbConnection$;
  }



  // ===================== ALL ADD, PUT FLAG ========================================
  // ====================== Return flag encryptIdb ====================================
  indexDbPutAllTimeLine<T>(target: MyDBKeysTimeLine, timeLine: TimeLineModel): Observable<any> {
    let data: any = { year: timeLine?.year }
    // let newVal = this.encryptIDB(timeLine, this.timeLineKeys.LS.idb1)
    // let time_line = {a: newVal}
    console.log('ssssssssssss 🅱️',this.timeLineKeys.LS.idb1)
    // console.log('ssssssssssss',newVal)
    return of('')
    // return this.dbConnection$.pipe(
    //   map(db => {
    //     const tx = db.transaction(target, "readwrite");
    //     tx.objectStore(target)
    //       .put({ ...data, ...time_line })
    //       .then(v => { })
    //       .catch(err => {
    //       });
    //     return timeLine;
    //   })
    // );
  }


  // ===================== Flags Cryptography IndexDB ADD PUT DATA ==================================
  // ============================= Return flag encrypt flags =========================================
  encryptIDB(inBody: any, key: any) {
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


  dencryptIDB(inBody: any, key: string) {
    // inBody = JSON.parse(inBody)
    let decrypted = undefined;
    decrypted = CryptoJS.AES.decrypt(inBody.a, key);
    const timeLine = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(timeLine)
  }



}
