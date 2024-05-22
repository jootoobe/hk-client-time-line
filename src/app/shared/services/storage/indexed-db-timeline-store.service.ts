import { effect, Injectable } from "@angular/core";
import * as CryptoJS2 from 'crypto-js';
import { IDBPDatabase, openDB } from "idb";
import { from, Observable, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { TimeLineModel } from "../../../models/time-line.model";
import { TIMELINEKeysModel } from "../../../models/cryptos/time-line-keys.model";
import { StateService } from "../state.service";


/**
* **************************************** RULES INDEX-DB *******************************************************
* * * * * =================== Get ADD PUT - DELETE  is sent directly to the https service ============= * * * * *
* @param { Rules } Used_so_that_other_microservices_have_access_to_data_without_having_to_use_the_backend
* @param { 0000 }  IndexDb_key_0000 - Stores all data encrypted - used to load the application locally

*/


type MyDBKeysTimeLine = keyof TimeLineModel;

@Injectable({
  providedIn: "root"
})
export class IndexDbTimeLineService {
  version = 1;
  databaseName = "TimeLine";

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
  // ====================== Return flag encryptIDB ====================================
  indexDbPutAllTimeLine(target: MyDBKeysTimeLine, timeLine: TimeLineModel): Observable<string> {
    let data: any = { year: timeLine?.year }
    let newVal = this.encryptIDB(timeLine, this.timeLineKeys.LS.idb1)

    return this.dbConnection$.pipe(
      map(db => {
        const tx = db.transaction(target, "readwrite");
        tx.objectStore(target)
          .put({ ...data, ...newVal })
          .then(v => { })
          .catch(err => {
          });
        return '';
      })
    );
  }

  // ======================================== ALL GET ===========================================================
  // =============== Return flag dencryptIDB - Receives the key reference and returns the entire database' ======
  indexDbGetAllTimeLine(target: MyDBKeysTimeLine, keyPar: string): Observable<TimeLineModel> {
    return this.dbConnection$.pipe(
      switchMap(db => {
        const tx = db.transaction(target, "readonly");
        const store = tx.objectStore(target);
        return from(store.getAll());
      }),
      map((res:any) => {
        let newVal = this.dencryptIDB(res[0], this.timeLineKeys.LS.idb1)
        return newVal
      }),
    );
  }


  // ===================== Flags Cryptography IndexDB ADD PUT DATA ==================================
  // ============================= Return flag encrypt flags =========================================
  encryptIDB(inBody: any, key: any) {
    const iamEncrypt: any = CryptoJS2.AES.encrypt(JSON.stringify(inBody), key,
      {
        keySize: 128 / 8,
        iv: key,
        mode: CryptoJS2.mode.CBC,
        padding: CryptoJS2.pad.Pkcs7
      }).toString();
    const neyBody: any = { a: iamEncrypt };
    // this.decryptSignIn(neyBody)
    return neyBody

  }


  dencryptIDB(inBody: any, key: string): TimeLineModel {
    // inBody = JSON.parse(inBody)
    let decrypted = undefined;
    decrypted = CryptoJS2.AES.decrypt(inBody.a, key);
    const timeLine = decrypted.toString(CryptoJS2.enc.Utf8);
    return JSON.parse(timeLine)
  }



}
