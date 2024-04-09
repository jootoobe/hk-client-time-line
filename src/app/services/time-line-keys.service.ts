import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { TimeLineModel } from '../models/time-line.model';


@Injectable({
  providedIn: 'root'
})
export class TimeLineKeysService {
  API_IAM2: string = environment.ApiIam2;

  constructor(private http: HttpClient) { }

  // SPIDER-SHARE - SS
  getIam2(): Observable<any> {
    return this.http.get<any>(this.API_IAM2+'/tl').pipe(
      map((res) => {
        return res;
      }));
  }

}



