import { Injectable } from "@angular/core";
import * as CryptoJS from 'crypto-js';
import { DBSchema, deleteDB, IDBPDatabase, openDB } from "idb";
import { from, Observable, of } from "rxjs";
import { map, mergeMap, switchMap, tap } from "rxjs/operators";
import { TimeLineModel } from "../../../models/time-line.model";


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

  constructor() {
    this.connectToIDBTimeLine()
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
    
    console.log('sssssss',data)
    console.log('sssssss',timeLine)
    return this.dbConnection$.pipe(
      map(db => {
        const tx = db.transaction(target, "readwrite");
        tx.objectStore(target)
          .put({ ...data, ...timeLine })
          .then(v => { })
          .catch(err => {
          });
        return timeLine;
      })
    );
  }



}
