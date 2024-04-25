import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { TimeLineModel } from "../../../../../models/time-line.model";
import { FilterFlagsService } from "../../../../../shared/services/filter-flags.service";
import { StateService } from "../../../../../shared/services/state.service";
import { IndexDbTimeLineService } from "../../../../../shared/services/storage/indexed-db-timeline-store.service";
import { switchMap } from "rxjs";
import { FlagModel } from "../../../../../models/flag.model";


@Component({
  selector: 'filter-flag',
  templateUrl: './filter-flag.component.html',
  styleUrls: ['./filter-flag.component.scss'],
})
export class FilterFlagComponent implements OnInit {
  @Input({ required: true }) timeLine!: TimeLineModel
  @ViewChild('filterTimeLine', { static: false }) filterTimeLine!: TemplateRef<ElementRef>; // open modal ref
  indexDbGetAllData!: TimeLineModel
  titleFlag!: string; // digitação filtro
  applyFilter = output<TimeLineModel>()
  applyFilterCloseDialog = false // if else dialogRef.afterClosed()
  emitFilterApply!: TimeLineModel // guarda o filtro aplicado

  selectedColors = 'Filtre sua bandeira pelas cores'

  constructor(
    private dialogCreate: MatDialog,
    private filterFlagsService: FilterFlagsService,
    // private stateService: StateService,
    private indexDbTimeLineService: IndexDbTimeLineService,
  ) {

    // this.stateService.getAllTimeLineSubject$
    //   .subscribe({
    //     next: (res: TimeLineModel) => {
    //       if (res && res.time_line) {
    //         this.indexDbGetAllData = res
    //       }
    //     },
    //     error: () => { },
    //     complete: () => { }
    //   })

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


