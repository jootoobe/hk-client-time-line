import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild, effect } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { environment } from '../../../../../environments/environment';
import { TimeLineModel } from '../../../../models/time-line.model';
import { TimeLineService } from '../../../../services/time-line.service';
import { TIMELINEKeysModel } from '../../../../models/cryptos/time-line-keys.model';
import { StateService } from '../../../../shared/services/state.service';
import { IndexDbTimeLineService } from '../../../../shared/services/storage/indexed-db-timeline-store.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'flags-spider',
  templateUrl: './flags-spider.component.html',
  styleUrls: ['./flags-spider.component.scss']
})
export class FlagsSpiderComponent implements OnInit {
  @ViewChild('createTimeLine', { static: false }) createTimeLine!: TemplateRef<any> // open modal ref - modal to create or edit timeline

  assetsProd = environment.assetsProd // assetsProd: 'http://localhost:4201',
  flagSetting!: string

  timeLine: TimeLineModel = {} as any

  timeLineKeys!: TIMELINEKeysModel
  constructor(
    private dialogCreate: MatDialog,
    private renderer2: Renderer2,
    private elementRef: ElementRef,
    private timeLineService: TimeLineService,
    private stateService: StateService,
    private indexDbTimeLineService: IndexDbTimeLineService,
  ) {

    effect(() => { // tenho que certificar que a chave esteja lo LS - chave ss que abre o body {a: 'asdasd..}
      this.timeLineKeys = this.stateService.keysCryptoTimeLineSignalComputed()
      if (this.timeLineKeys && this.timeLineKeys?.LS?.ss) {
        this.getAllTimeLineById()
      }
    })

    this.stateService.getAllTimeLineSubject$
    .subscribe({
      next: (res: TimeLineModel) => {
        if(res && res.time_line) {
          this.timeLine = res
        }
      },
      error: () => {},
      complete: () => {}
    })

  }
  ngOnInit(): void {
    console.log('FlagsSpiderComponent 🃏')

  }



  // Open Create Time_Line
  openCreateTimeLineDialog(val: string): void {
    this.flagSetting = val

    this.dialogCreate.open(this.createTimeLine, {
      disableClose: true,
      panelClass: 'create-flag-dialog',
      // backdropClass: 'backdropBackground',
      position: {}
    });

  }


  getAllTimeLineById() {
    this.timeLineService.getAllTimeLineById()
      .subscribe({
        next: (res: any) => {
          console.log('sssssssssssssss', res)
          let newTimeLine = {
            time_line: {
              flags: res.flags
            }
          }
          this.stateService.updateGetAllTimeLine(newTimeLine)
          this.indexDbPutAllFlag(newTimeLine)
        },
        error: () => {
        },
        complete: () => {
        }
      })
  }


  indexDbPutAllFlag(newTimeLine: TimeLineModel) {
    // let getNewVal = JSON.parse(localStorage.getItem('flags') || '[]');
    const connTimeLine$ = this.indexDbTimeLineService.connectToIDBTimeLine();
    connTimeLine$.pipe(
      switchMap(() =>
        this.indexDbTimeLineService.indexDbPutAllTimeLine("TimeLine", {
          year: '0000',
          flags: newTimeLine
        })))
      .subscribe({
        next: (res: any) => {
          console.log('CanvasTimeLineComponent - linha 394 - indexDbPutAllFlag()', res)
     
        },
        error: (err) => { },
        complete: () => { }
      })
  }

}
