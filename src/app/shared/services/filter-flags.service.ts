import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter, from, map, mergeMap, of, tap } from 'rxjs';
import { TimeLineModel } from '../../models/time-line.model';
import { FlagModel } from '../../models/flag.model';

@Injectable({
  providedIn: 'root'
})
export class FilterFlagsService {

  flags!: FlagModel[]
  newFilterFlags!: TimeLineModel
  constructor() { }




  filterOrderFlags(timeLine: TimeLineModel): FlagModel[] {
    this.flags = timeLine.time_line.flags.sort((x: FlagModel, y: FlagModel) => x.date_obj.timestamp - y.date_obj.timestamp)
    return this.flags
  }




  filterFlags(description: any, attributeObject: any, timeLine: TimeLineModel): Observable<any> {
    let val: any = [];

    if (!description) {
      return of('')
    }

    if(attributeObject === 'flag_title') {
      val = timeLine.time_line.flags.filter((optionFlag: FlagModel) => optionFlag.flag_title.toLowerCase().includes(description.toLowerCase()))
      this.newFilterFlags = {
        time_line: {
          flags: val
        }
      }
    }
    return of(this.newFilterFlags)

  }



  filtercolorFlag(description: any, attributeObject: any, flagArray: any, colors: any): Observable<any> {

    return of(description)
  }



}
