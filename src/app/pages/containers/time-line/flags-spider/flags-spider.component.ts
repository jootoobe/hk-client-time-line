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
  // timeLine: TimeLineModel = {
  //   iam_id: '65ff5d9c8e66b41b0e36825d',
  //   time_line: {
  //     flags: [
  //       {
  //         year: "2024",
  //         flag_id: "flag_id_21ba-bc46-cacd-1156-822d",
  //         flag_title: "FLAG1",
  //         flag_description: "wwwwwww",
  //         flag_style: 1,

  //         flag_created_at: "Feb 16, 2024, 9:09:03 PM",
  //         flag_update_at: "0",
  //         flag_margin_right: '0', // aqui entra 3 se tiver 02 flags - server para aumentar a distância da próxima flag


  //         flag_design: {
  //           color_text: '0,0,0',
  //           color_transparency: '0.2',
  //           color_hex: "#90ab3d",
  //           color_rgb: "144, 171, 64",
  //           color_hsl: "75, 46%, 92%",
  //           color_date: '144, 171, 64',
  //           color_chips: {
  //             background: '74,74,74',
  //             text: '255,255,255'
  //           },
  //         },

  //         date_obj: {
  //           day_month_year: "2024-04-05T12:00:00.000Z",
  //           date_origin: "2024-04-05T03:00:00.000Z",
  //           day: "05",
  //           month: "04",
  //           month_s: "ABR",
  //           year: "2024",
  //           month_code: 4,
  //           timestamp: 1712318400000,
  //           time: "12:00:00"
  //         },
  //         social_medias_chips: [{ name: 'Redes' }, { name: 'TikTok' }, { name: 'Wwwwwwwwww' }, { name: 'Instagran' }, { name: 'Wwwwwwwwww' }, { name: 'Instagran' }, { name: 'Wwwwwwwwww' }, { name: 'Instagran' }],
  //         subject_tags: [],

  //         flags2: []
  //       },
  //     ],
  //   }
  // }
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
          console.log('+++++++++++++++++++++', res)
        },
        error: () => {
        },
        complete: () => {
        }
      })


  }

}
