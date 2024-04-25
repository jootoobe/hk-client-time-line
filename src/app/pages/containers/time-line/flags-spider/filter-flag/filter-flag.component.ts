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

  colorArray: any

  filterTopDiv= [{color_rgb: '', color_hex: '', color_rgb_number: 0}] as any
  constructor(
    private dialogCreate: MatDialog,
    private filterFlagsService: FilterFlagsService,
    private indexDbTimeLineService: IndexDbTimeLineService,
    private stateService: StateService,
    private toastrService: ToastrService,
  ) {

    this.filterTopDiv = []
    this.colorArray = []
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

  addColors(val: FlagModel, colorHex:string, colorRgb: string) {
    console.log(val)
    let flagsReturnFilter:any = []
    let valFilter:any = []
    valFilter  = this.filterTopDiv.filter((colorHex:any) => colorHex.color_hex === val.flag_design.color_hex.toLowerCase());
    flagsReturnFilter = this.timeLine.time_line.flags.filter((colorHex:FlagModel) => colorHex.flag_design.color_hex.toLowerCase() === val.flag_design.color_hex.toLowerCase());

    console.log('2222222222222222222222222222222222222222222222222222222222222222222222222222222222222',flagsReturnFilter)
    
    if (valFilter.length > 0) {
      // this.toastrService.info('Has already been added', 'Flag color');
      this.toastrService.info(this.TOAST['TIME-LINE']['FilterFlagComponent'].info['msn-0']['message-0'], this.TOAST['TIME-LINE']['FilterFlagComponent'].info['msn-0']['message-1']);
      return
    }
    
    
    if (this.filterTopDiv.length < 5) {
      this.colorArray.push(...flagsReturnFilter)
      this.filterTopDiv.push({color_hex: colorHex , color_rgb: colorRgb, color_rgb_number: Number(colorRgb.split(',')[0])})

      this.timeLine.time_line.flags = this.colorArray

      // let newTimeLine = {
      //   time_line: {
      //     flags: this.colorArray
      //   }
      // }
      // let val = this.filterFlagsService.filterOrderFlags(newTimeLine)
      // console.log('sssssssssssssssss', this.colorArray)
      // console.log('sssssssssssssssss',newTimeLine)
      console.log('sssssssssssssssss', this.colorArray)

    } else if (this.filterTopDiv.length >= 4) {
      // this.toastrService.info('The filter becomes more effective', 'Add 05 colors at a time');
      this.toastrService.info(this.TOAST['TIME-LINE']['FilterFlagComponent'].info['msn-1']['message-0'], this.TOAST['TIME-LINE']['FilterFlagComponent'].info['msn-1']['message-1']);

    }

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


