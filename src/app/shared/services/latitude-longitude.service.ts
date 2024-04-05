import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';


import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LatitudeLongitudeService {
  constructor(private http: HttpClient) { }

  latitudeLongitude(): Observable<any> {
    return this.http.get<any>('https://api.bigdatacloud.net/data/reverse-geocode-client')
  }

}


