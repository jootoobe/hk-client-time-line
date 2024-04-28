import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, TemplateRef, ViewChild, effect, output } from "@angular/core";
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
  @Input({ required: true }) resetFilterInput!: Boolean 


  @ViewChild('filterTimeLine', { static: false }) filterTimeLine!: TemplateRef<ElementRef>; // open modal ref
  indexDbGetAllData!: TimeLineModel
  selectColor!: FlagModel[]
  titleFlag!: any; // digitação filtro
  toApplyFilterTextOutput = output<TimeLineModel>()
  applyFilterCloseDialog = false // if else dialogRef.afterClosed()
  emitFilterApply!: TimeLineModel // guarda o filtro aplicado

  selectedColors: any = 'Filtre sua bandeira pelas cores'

  TOAST!: any // translator used in ToastrService

  colorArray: any

  filterTopDiv = [{ color_rgb: '', color_hex: '', color_rgb_number: 0 }] as any
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
      this.indexDbGetAllTimeLine('0000')
    })

  }

  ngOnChanges(changes: SimpleChanges) {

    // toda vez que clicar no botão "criar" o filtro da barra inferior deve ser desabilitado
    if (changes['resetFilterInput']?.currentValue) {
      this.clearFilter('update')
    }

  }

  ngOnInit(): void {
    this.filterTopDiv = []
    this.colorArray = []


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
        if (this.applyFilterCloseDialog && this.titleFlag?.lenght > 0) {
          this.toApplyFilterTextOutput.emit(this.emitFilterApply)

        } else if (this.applyFilterCloseDialog && this.filterTopDiv?.lenght > 0) {
          // não preciso fazer nada aqui
        } else if (!this.applyFilterCloseDialog) {
          this.clearFilter('update') // aqui é quando clico fora do modal ou no X
        }
      });

    this.indexDbGetAllTimeLine('0000')
  }


  filterFlag() {

    if (this.filterTopDiv?.length > 0) {
      this.toastrService.info('Aplique um filtro por vez', 'Filtro individual');
      this.clearFilter('update')
      return
    }

    this.applyFilterCloseDialog = false
    let val = this.titleFlag.length >= 1 ? this.titleFlag : ''

    this.filterFlagsService.filterFlags(val, 'flag_title', this.indexDbGetAllData)
      .subscribe((res: TimeLineModel) => {
        if (res) {
          this.emitFilterApply = res
          return this.toApplyFilterTextOutput.emit(this.emitFilterApply)
        }
        if (!res) {
          this.titleFlag = ''
          return this.toApplyFilterTextOutput.emit(this.indexDbGetAllData)
        }

      })

  }


  closeFilter() {
    this.clearFilter('update')
  }


  toApplyFilter(val?: string) {
    this.applyFilterCloseDialog = true
    this.dialogCreate.closeAll()
  }

  addColors(val: FlagModel, colorHex: string, colorRgb: string) {

    if (this.titleFlag?.length > 0) {
      this.toastrService.info('Aplique um filtro por vez', 'Filtro individual');
      this.clearFilter('update')
      return
    }

    let flagsReturnFilter: any = []
    let valFilter: any = []
    valFilter = this.filterTopDiv?.filter((colorHex: any) => colorHex.color_hex?.toLowerCase() === val.flag_design.color_hex?.toLowerCase());

    if (valFilter.length > 0) {
      this.toastrService.info(this.TOAST['TIME-LINE']['FilterFlagComponent'].info['msn-0']['message-0'], this.TOAST['TIME-LINE']['FilterFlagComponent'].info['msn-0']['message-1']);
      return
    }


    if (this.filterTopDiv.length < 5) {
      this.filterTopDiv.push({ color_hex: colorHex, color_rgb: colorRgb, color_rgb_number: Number(colorRgb.split(',')[0]) })

      this.indexDbGetAllData.time_line.flags.forEach((e: FlagModel, i: number) => {
        if ((e.flag_design.color_hex?.toLowerCase()) === (colorHex?.toLowerCase())) {
          flagsReturnFilter.push(e)
        }
      })

      this.colorArray = this.colorArray.concat(flagsReturnFilter)

      let newTimeLine = {
        time_line: {
          flags: this.colorArray
        }
      }

      this.stateService.updateGetAllTimeLine(newTimeLine)


    } else if (this.filterTopDiv.length >= 4) {
      // this.toastrService.info('The filter becomes more effective', 'Add 05 colors at a time');
      this.toastrService.info(this.TOAST['TIME-LINE']['FilterFlagComponent'].info['msn-1']['message-0'], this.TOAST['TIME-LINE']['FilterFlagComponent'].info['msn-1']['message-1']);

    }

  }

  removeColor(i: number, color: any) {

    this.colorArray = this.colorArray.map((res: any) => {
      if ((res.flag_design.color_hex?.toLowerCase()) !== (color?.toLowerCase())) {
        return res
      }
    });

    this.colorArray = this.colorArray.filter((element: any) => {
      return element !== undefined;
    });

    this.filterTopDiv.splice(i, 1)
    let newTimeLine: any = {}


    if (this.colorArray.length <= 0) {
      this.clearFilter('update')
      return
    }
    this.selectedColors = null
    this.titleFlag = ''


    newTimeLine = {
      time_line: {
        flags: this.colorArray
      }
    }

    this.stateService.updateGetAllTimeLine(newTimeLine)
  }


  indexDbGetAllTimeLine(yearKey: string, reset?: string) {
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
          console.log('PAPAPAPPAPAPAPPAPAPA', this.indexDbGetAllData)
          this.uniqueColor(this.indexDbGetAllData.time_line.flags)

          if (reset === 'reset') {
            this.stateService.updateGetAllTimeLine(this.indexDbGetAllData)
          }
        },
        error: (err) => {

        },
        complete: () => {
        }
      })
  }

  convertToNumber(val: any): number {
    let numberValue = Number(val);
    return numberValue
  }

  uniqueColor(flags: any[]) {
    this.selectColor = [];
    let allCode = flags.map((value) => value.flag_design.color_hex);
    flags.map((value, index) => {
      if (allCode.indexOf(value.flag_design.color_hex) !== index) {
        // uniqueArr.push(value)
      } else {
        this.selectColor.push(value)
      }
    })
  }

  clearFilter(update?: string) {
    this.selectedColors = null
    this.titleFlag = ''
    this.colorArray = []
    this.filterTopDiv = []

    if (update === 'update') {
      this.stateService.updateGetAllTimeLine(this.indexDbGetAllData)
    }
  }
}

