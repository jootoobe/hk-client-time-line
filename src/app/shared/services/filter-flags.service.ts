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
    let val2: any = [];
    let newVal: any = [];

    if (!description) {
      return of('')
    }

    if (attributeObject === 'flag_title') {

      val2 = timeLine.time_line.flags.filter((optionFlag: FlagModel) => optionFlag.flags2?.some(item => item.flag_title.toLowerCase().includes(description.toLowerCase())))
      val = timeLine.time_line.flags.filter((optionFlag: FlagModel) => optionFlag.flag_title.toLowerCase().includes(description.toLowerCase()))

  
      val2.forEach((e: FlagModel) => {
        newVal.push(e)
      });

      val.forEach((e: FlagModel) => {
        newVal.push(e)
      });

    }

    this.newFilterFlags = {
      time_line: {
        flags: newVal
      }
    }

    this.newFilterFlags.time_line.flags.sort((x: FlagModel, y: FlagModel) => {
      return x.date_obj.timestamp - y.date_obj.timestamp;
    })

    return of(this.newFilterFlags)

  }




  filtercolorFlag(description: any, attributeObject: any, flagArray: any, colors: any): Observable<any> {

    return of(description)
  }



}
