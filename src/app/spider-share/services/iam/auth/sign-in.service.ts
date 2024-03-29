import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';

// import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignInService {
  // API_IAM: string = environment.ApiIam;
  // API_TIME_LINE: string = environment.ApiTimeLine;



  constructor() { }


  devSignIn(val: any, urlParams?: HttpParams): Observable<any> {

    return of('')
  }





}
