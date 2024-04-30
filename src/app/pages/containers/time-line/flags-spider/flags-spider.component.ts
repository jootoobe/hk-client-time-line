import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild, effect, output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { TimeLineModel } from '../../../../models/time-line.model';
import { TimeLineService } from '../../../../services/time-line.service';
import { TIMELINEKeysModel } from '../../../../models/cryptos/time-line-keys.model';
import { StateService } from '../../../../shared/services/state.service';
import { IndexDbTimeLineService } from '../../../../shared/services/storage/indexed-db-timeline-store.service';
import { switchMap } from 'rxjs';
import { FlagModel, FlagsModel } from '../../../../models/flag.model';
import { environment } from '../../../../../environments/environment';
import { ConnectingExternalRoutesService } from '../../../../shared/services/connecting-external-routes/connecting-external-routes.service';
import { DetectBrowserNameService } from '../../../../shared/services/detect-browser-name.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'flags-spider',
  templateUrl: './flags-spider.component.html',
  styleUrls: ['./flags-spider.component.scss']
})
export class FlagsSpiderComponent implements OnInit, AfterViewInit {
  @ViewChild('openClose', { static: true }) openClose!: ElementRef //  relating to the method openCloseHorizontalScroll()


  @ViewChild('createTimeLine', { static: false }) createTimeLine!: TemplateRef<any> // open modal ref - modal to create or edit timeline

  assetsProd = environment.assetsProd // assetsProd: 'http://localhost:4201',

  timeLine: TimeLineModel = {} as any

  timeLineKeys!: TIMELINEKeysModel
  editFlagForm!: FlagModel | any
  flagCreateEdit!: string

  envProd = environment.production

  resetFlags!: TimeLineModel

  detectBrowser!: string // used to identify the firefox browser and send an alter to the user
  openColse = true // used to show and hide the horizontal scroll
  flagLength = 0 // used to adjust the horizontal line style, to show and hide the word end



  valFilterColorBar = { color_hex: '', color_rgb: 0 } as any // stores the clicked filter bar and communicates with the top-div component
  checkingOpacityFilterApplied = '' // verifica se o filtro no modal está ativo ou não

  TOAST: any

  constructor(
    private dialogCreate: MatDialog,
    private renderer2: Renderer2,
    private elementRef: ElementRef,
    private timeLineService: TimeLineService,
    private stateService: StateService,
    private indexDbTimeLineService: IndexDbTimeLineService,
    private connectingExternalRoutesService: ConnectingExternalRoutesService,
    private detectBrowserNameService: DetectBrowserNameService,
    // private toastrService: ToastrService,
  ) {

    effect(() => { // tenho que certificar que a chave esteja lo LS - chave ss que abre o body {a: 'asdasd..}
      this.timeLineKeys = this.stateService.keysCryptoTimeLineSignalComputed()
      // if (this.timeLineKeys && this.timeLineKeys?.LS?.ss) {
      //   // this.getAllTimeLineById()
      // }
    })

    this.stateService.getAllTimeLineSubject$
      .subscribe({
        next: (res: TimeLineModel) => {
          // let val: any = {}
          // this.timeLine = val
          if (res && res.time_line) {
            this.timeLine = res
          }
        },
        error: () => { },
        complete: () => { }
      })


    effect(() => {
      this.TOAST = this.stateService.toastSignalComputed()
    })

  }
  ngOnInit(): void {
    this.detectBrowser = this.detectBrowserNameService.detectBrowserName()

    console.log('FlagsSpiderComponent 🃏')


    setTimeout(() => {
      this.getAllTimeLineById()
      this.openCloseHorizontalScroll('open')
    }, 1000)

  }

  ngAfterViewInit(): void {

  }

  editFlagEvent(flag: FlagModel) {
    this.editFlagForm = flag
    this.openCreateTimeLineDialog('edit')
  }


  // Open Create Time_Line
  openCreateTimeLineDialog(val: string): void {
    this.flagCreateEdit = val

    if (val === 'create') {
      this.editFlagForm = {}
    }

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
        next: (res: FlagsModel) => {
          let newTimeLine = {
            time_line: {
              flags: res.flags
            }
          }

          this.resetFlags = newTimeLine
          this.stateService.updateGetAllTimeLine(newTimeLine)
          this.flagLength = newTimeLine.time_line?.flags?.length
          this.indexDbPutAllFlag(newTimeLine)
          // end-loader
          this.connectingExternalRoutesService.spiderShareLoader({ message: false })
        },
        error: () => {
          let newTimeLine = { time_line: { flags: [] } }
          this.stateService.updateGetAllTimeLine(newTimeLine)
          // end-loader
          this.connectingExternalRoutesService.spiderShareLoader({ message: false })
        },
        complete: () => {
        }
      })
  }

  timeLineEvent(event: TimeLineModel) {
    this.timeLine = event
  }

  indexDbPutAllFlag(newTimeLine: TimeLineModel) {
    // let getNewVal = JSON.parse(localStorage.getItem('flags') || '[]');
    const connTimeLine$ = this.indexDbTimeLineService.connectToIDBTimeLine();
    connTimeLine$.pipe(
      switchMap(() =>
        this.indexDbTimeLineService.indexDbPutAllTimeLine("time_line", {
          year: '0000',
          time_line: newTimeLine.time_line
        })))
      .subscribe({
        next: (res: any) => { },
        error: (err) => { },
        complete: () => {
          // this.indexDbGetAllTimeLine('0000')
        }
      })
  }


  indexDbGetAllTimeLine(yearKey: string) {
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
          this.resetFlags = newTimeLine
          this.stateService.updateGetAllTimeLine(newTimeLine)
        },
        error: (err) => {
        },
        complete: () => {
        }
      })
  }


  // horizontal scroll button open and close
  // Levar para aplicação principal
  openCloseHorizontalScroll(val: string) {
    const open = this.openClose.nativeElement.querySelector("#open");
    const close = this.openClose.nativeElement.querySelector("#close");

    // Para você ter uma melhor experiência visual utilize outro browser como Opera, Chrome, Edge ..... 😄
    if (this.detectBrowser === 'firefox') {
      alert(this.TOAST['TIME-LINE']['FlagsSpiderComponent'].alert['msn-0']['message'])
    }

    // if (this.detectBrowser !== 'firefox') {
    if (val === 'open') {
      // open.style.opacity = '0';
      // close.style.opacity = '1';
      this.openColse = true
      open.style.display = 'none';
      close.style.display = 'inline-table';
      return
    } else if (val === 'close') {
      this.openColse = false
      // open.style.opacity = '1';
      // close.style.opacity = '0';
      open.style.display = 'inline-table';
      close.style.display = 'none';
      return
    }
    // }

    open.style.display = 'none';
    close.style.display = 'none';
  }

}
