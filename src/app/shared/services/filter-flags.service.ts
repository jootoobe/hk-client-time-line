import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter, from, map, mergeMap, of, tap } from 'rxjs';
import { TimeLineModel } from '../../models/time-line.model';
import { FlagModel } from '../../models/flag.model';

@Injectable({
  providedIn: 'root'
})
export class FilterFlagsService {

  flags!: FlagModel[]
  constructor() { }




  filterOrderFlags(timeLine: TimeLineModel): FlagModel[] {
    this.flags = timeLine.time_line.flags.sort((x: FlagModel, y: FlagModel) => x.date_obj.timestamp - y.date_obj.timestamp)
    return this.flags
  }




  filterFlags(description: any, attributeObject: any, flagArray: any): Observable<any> {

    return of(description)



  }



  filtercolorFlag(description: any, attributeObject: any, flagArray: any, colors: any): Observable<any> {

    return of(description)
  }



}
