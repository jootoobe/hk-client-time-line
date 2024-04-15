import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild, effect } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { environment } from '../../../../../environments/environment';
import { TimeLineModel } from '../../../../models/time-line.model';
import { TimeLineService } from '../../../../services/time-line.service';
import { TIMELINEKeysModel } from '../../../../models/cryptos/time-line-keys.model';
import { StateService } from '../../../../shared/services/state.service';

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
  ) {

    effect(() => { // tenho que certificar que a chave esteja lo LS - chave ss que abre o body {a: 'asdasd..}
      this.timeLineKeys = this.stateService.keysCryptoTimeLineSignalComputed()
      if (this.timeLineKeys && this.timeLineKeys?.LS?.ss) {
        this.getAllTimeLineById()
      }
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
          this.timeLine = {
            time_line: {
              flags: res.flags
            }
          }
        },
        error: () => {
        },
        complete: () => {
        }
      })


  }

  // timeLineOutput(e: any) {
  //   // this.timeLine = e

  //   console.log('ssssssssssssss66666666666666666666666ssssssss',e)

  // }

}
