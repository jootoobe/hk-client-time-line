import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, effect, output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { TimeLineModel } from "../../../../../models/time-line.model";
import { FilterFlagsService } from "../../../../../shared/services/filter-flags.service";
import { StateService } from "../../../../../shared/services/state.service";
import { IndexDbTimeLineService } from "../../../../../shared/services/storage/indexed-db-timeline-store.service";
import { switchMap } from "rxjs";
import { FlagModel } from "../../../../../models/flag.model";
import { ToastrService } from "ngx-toastr";


@Component({
  selector: 'filter-flag',
  templateUrl: './filter-flag.component.html',
  styleUrls: ['./filter-flag.component.scss'],
})
export class FilterFlagComponent implements OnInit {
  @Input({ required: true }) timeLine!: TimeLineModel
  @ViewChild('filterTimeLine', { static: false }) filterTimeLine!: TemplateRef<ElementRef>; // open modal ref
  indexDbGetAllData!: TimeLineModel
  titleFlag!: any; // digitação filtro
  applyFilter = output<TimeLineModel>()
  applyFilterCloseDialog = false // if else dialogRef.afterClosed()
  emitFilterApply!: TimeLineModel // guarda o filtro aplicado

  selectedColors = 'Filtre sua bandeira pelas cores'

  TOAST!: any // translator used in ToastrService

  // colorArray: any = []
  constructor(
    private dialogCreate: MatDialog,
    private filterFlagsService: FilterFlagsService,
    private indexDbTimeLineService: IndexDbTimeLineService,
    private stateService: StateService,
    private toastrService: ToastrService,
  ) {


    effect(() => {
      this.TOAST = this.stateService.toastSignalComputed()
      console.log('TOAST', this.TOAST)
    })

  }

  ngOnInit(): void {
    this.indexDbGetAllTimeLine('0000')
  }

  // Open Create Time_Line
  openFilterTimeLineDialog() {
    let dialogRef = this.dialogCreate.open(this.filterTimeLine, {
      disableClose: false,
      panelClass: 'filter-time-line-dialog',
      // backdropClass: 'backdropBackground',
      position: {}
    });

    dialogRef.afterClosed()
      .subscribe(() => {
        if (this.applyFilterCloseDialog) {
          this.applyFilter.emit(this.emitFilterApply)

        } else if (!this.applyFilterCloseDialog) {
          this.titleFlag = ''
          this.applyFilter.emit(this.indexDbGetAllData)
        }
      });
  }


  filterFlag() {
    this.applyFilterCloseDialog = false
    let val = this.titleFlag.length >= 1 ? this.titleFlag : ''

    this.filterFlagsService.filterFlags(val, 'flag_title', this.indexDbGetAllData)
      .subscribe((res: TimeLineModel) => {
        if (res) {
          this.emitFilterApply = res
          return this.applyFilter.emit(this.emitFilterApply)
        }
        if (!res) {
          this.titleFlag = ''
          return this.applyFilter.emit(this.indexDbGetAllData)
        }

      })

  }


  closeFilter() {
    this.titleFlag = ''
    return this.applyFilter.emit(this.indexDbGetAllData)
  }


  toApplyFilter() {
    this.applyFilterCloseDialog = true
    this.dialogCreate.closeAll()
  }

  addColors(val: FlagModel) {
    let valFilter = []
    valFilter = this.timeLine.time_line.flags.filter(() => val.flag_design.color_hex.toLowerCase());

    console.log('sssssssss',valFilter)

    if (valFilter.length !== 0) {
      // this.toastrService.info('Has already been added', 'Flag color');
      this.toastrService.info(this.TOAST['TIME-LINE']['FilterFlagComponent'].info['msn-0']['message-0'], this.TOAST['TIME-LINE']['FilterFlagComponent'].info['msn-0']['message-1']);
      return
    }

    // if (this.colorArray.length < 5) {
    //   this.colorArray.push(val);
    //   this.filtercolorFlag(this.colorArray)
    //   // array of colors added by filter
    //   // sent to the component top-div
    //   let newVal = {
    //     color_rgb: Number(val.color_rgb.split(',')[0]),
    //     color_hex: val.color_hex
    //   }
    //   this.filterInpuTopDiv.push(newVal)
    //   this.filterFlagsService.topDivFilterInpu(this.filterInpuTopDiv)

    // } else if (this.colorArray.length >= 4) {
    //   // this.toastrService.info('The filter becomes more effective', 'Add 05 colors at a time');
    //   this.toastrService.info(this.TOAST['TIME-LINE']['FilterFlagComponent'].info['msn-1']['message-0'], this.TOAST['TIME-LINE']['FilterFlagComponent'].info['msn-1']['message-1']);

    // }
  }



  indexDbGetAllTimeLine(yearKey: string) {
    const connTimeLine$ = this.indexDbTimeLineService.connectToIDBTimeLine();
    connTimeLine$.pipe(
      switchMap(() =>
        this.indexDbTimeLineService.indexDbGetAllTimeLine('time_line', yearKey)
      ))
      .subscribe({
        next: (res: TimeLineModel) => {
          console.log('this.indexDbGetAllTimeLine', res)
          let valFlags: FlagModel[] = res.time_line.flags
          let newTimeLine = {
            time_line: {
              flags: valFlags
            }
          }
          this.indexDbGetAllData = newTimeLine
        },
        error: (err) => {

        },
        complete: () => {
        }
      })
  }
}


