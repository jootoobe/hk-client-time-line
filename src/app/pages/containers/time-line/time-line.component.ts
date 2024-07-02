import { Component, Inject, OnInit, effect } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { StateService } from '../../../shared/services/state.service';
import { IndexDbTimeLineService } from '../../../shared/services/storage/indexed-db-timeline-store.service';
import { switchMap } from 'rxjs';
import { TimeLineModel } from '../../../models/time-line.model';
import { FlagModel } from '../../../models/flag.model';


@Component({
  selector: 'time-line',
  templateUrl: './time-line.component.html',
  styleUrl: './time-line.component.scss'
})
export class TimeLineComponent implements OnInit {
  language = ''
  constructor(
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private stateService: StateService,
    private indexDbTimeLineService: IndexDbTimeLineService
  ) { 
    effect(() => {
      this.language = this.stateService.languageSignalComputed()
      this.getDateFormatString(this.language)
    })

    effect(() => {
      let timeLineIndexDbError = this.stateService.timeLineIndexDbErrorSignalSignalComputed()
      if(timeLineIndexDbError) {
        this.timeLineIndexDbErrorSignalSignal('0000')
      }
    })

  }

  ngOnInit(): void {}


  // languagesLocale() {
  //   let languageStart: any = localStorage.getItem('leng') !== null ? localStorage.getItem('leng') : JSON.stringify('pt')
  //   this.getDateFormatString(`${JSON.parse(languageStart)}`)
  // }

  // translator
  getDateFormatString(val: string): string {
    this._locale = val
    this._adapter.setLocale(`${this._locale}`);
    if (val === 'en') {
      return 'MM/DD/YYYY';
    } else if (val === 'pt' || val === 'pt-BR') {
      return 'DD/MM/YYYY';
    } else if (val === 'es') {
      return 'DD/MM/YYYY';
    }
    return '';
  }


  timeLineIndexDbErrorSignalSignal(yearKey: string) {
    const connTimeLine$ = this.indexDbTimeLineService.connectToIDBTimeLine();
    connTimeLine$.pipe(
      switchMap(() =>
        this.indexDbTimeLineService.indexDbGetAllTimeLine('time_line', yearKey)
      ))
      .subscribe({
        next: (res: TimeLineModel) => {
          let valFlags: FlagModel[] = res.time_line.flags
          let newTimeLine = {
            time_line: {
              flags: valFlags
            }
          }
          this.stateService.updateGetAllTimeLine(newTimeLine)
        },
        error: (err) => {
          this.stateService.updateTimeLineIndexDbErrorSignalSignal(false)
        },
        complete: () => {
          this.stateService.updateTimeLineIndexDbErrorSignalSignal(false)
        }
      })
  }
}
