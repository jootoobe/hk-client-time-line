import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild, effect, output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { TimeLineModel } from "../../../../../models/time-line.model";
import { FilterFlagsService } from "../../../../../shared/services/filter-flags.service";
import { StateService } from "../../../../../shared/services/state.service";
import { IndexDbTimeLineService } from "../../../../../shared/services/storage/indexed-db-timeline-store.service";
import { switchMap } from "rxjs";
import { FlagModel } from "../../../../../models/flag.model";
import { ToastrService } from "ngx-toastr";
import { IFilterCheckActive } from "../../../../../interfaces/filter-check-active.interface";


@Component({
  selector: 'filter-flag',
  templateUrl: './filter-flag.component.html',
  styleUrls: ['./filter-flag.component.scss'],
})
export class FilterFlagComponent implements OnInit {
  @Input({ required: true }) timeLine!: TimeLineModel


  @ViewChild('filterTimeLine', { static: false }) filterTimeLine!: TemplateRef<ElementRef>; // open modal ref
  indexDbGetAllData!: TimeLineModel
  selectColor!: FlagModel[]
  titleFlag!: any; // digitação filtro
  timeLineOutput = output<TimeLineModel>()
  toApplyFilterTextOutput = output<string>()

  toApplyFilterColorOutput = output<[{ color_rgb: '', color_hex: '', color_rgb_number: 0 }]>()
  applyFilterCloseDialog = false // if else dialogRef.afterClosed()
  emitFilterApply!: TimeLineModel // guarda o filtro aplicado

  selectedColors: any = 'Filtre sua bandeira pelas cores'

  TOAST!: any // translator used in ToastrService

  colorArray: any

  filterTopDiv = [{ color_rgb: '', color_hex: '', color_rgb_number: 0 }] as any
  activeFilterSignal!: IFilterCheckActive

  constructor(
    private dialogCreate: MatDialog,
    private filterFlagsService: FilterFlagsService,
    private indexDbTimeLineService: IndexDbTimeLineService,
    private stateService: StateService,
    private toastrService: ToastrService,
  ) {


    effect(() => {
      this.TOAST = this.stateService.toastSignalComputed()
      this.indexDbGetAllTimeLine('0000')
    })

    effect(() => { // verifica se o filtro está ativo 
      this.activeFilterSignal = this.stateService.activeFilterSignalComputed()
      if (this.activeFilterSignal.activeFilter === 'create') {
        if(this.filterTopDiv?.length > 0 || this.titleFlag?.length > 0) {
          setTimeout(()=>{
            this.clearFilter('update')
          },200)
        }
      }
    
    })

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
          this.timeLineOutput.emit(this.emitFilterApply)
        } else if (this.applyFilterCloseDialog && this.filterTopDiv?.lenght > 0) {
          // não preciso fazer nada aqui
        } else if (!this.applyFilterCloseDialog) {
          this.clearFilter('update') // aqui é quando clico fora do modal ou no X
        } 
        
      });

    this.indexDbGetAllTimeLine('0000')
  }


  filterFlag() {

    // Aqui só vai entrar se der algum bug no html
    // Já existe uma trava [disabled]="filterTopDiv?.length > 0"
    if (this.filterTopDiv?.length > 0) {
      // 'Aplique um filtro por vez', 'Filtro individual'
      this.toastrService.info(this.TOAST['TIME-LINE']['FilterFlagComponent'].info['msn-2']['message-0'], this.TOAST['TIME-LINE']['FilterFlagComponent'].info['msn-2']['message-1']);
      this.clearFilter('update')
      return
    }

    this.applyFilterCloseDialog = false
    let val = this.titleFlag.length >= 1 ? this.titleFlag : ''

    this.filterFlagsService.filterFlags(val, 'flag_title', this.indexDbGetAllData)
      .subscribe((res: TimeLineModel) => {
        if (res) {
          this.emitFilterApply = res
          this.stateService.updateChecksFilterIsActive(true)
          this.timeLineOutput.emit(this.emitFilterApply)
          return this.toApplyFilterTextOutput.emit(val) 
        }
        if (!res) {
          this.titleFlag = ''
          this.timeLineOutput.emit(this.indexDbGetAllData)
          return this.toApplyFilterTextOutput.emit('')  
        }


      })

  }


  closeFilter() {
    this.clearFilter('update')
  }


  toApplyFilter(val?: string) {
    this.applyFilterCloseDialog = true
    this.dialogCreate.closeAll()

    setTimeout(()=>{
      this.applyFilterCloseDialog = false
    },1000)
  }

  addColors(val: FlagModel, colorHex: string, colorRgb: string) {

    this.applyFilterCloseDialog = false

    // Aqui só vai entrar se der algum bug no html
    // Já existe uma trava [disabled]="titleFlag?.length > 0"
    if (this.titleFlag?.length > 0) {
      // 'Aplique um filtro por vez', 'Filtro individual';
      this.toastrService.info(this.TOAST['TIME-LINE']['FilterFlagComponent'].info['msn-2']['message-0'], this.TOAST['TIME-LINE']['FilterFlagComponent'].info['msn-2']['message-1']);
      this.clearFilter('update')
      return
    }

    let flagsReturnFilter: any = []
    let valFilter: any = []
    valFilter = this.filterTopDiv?.filter((colorHex: any) => colorHex.color_hex?.toLowerCase() === val.flag_design.color_hex?.toLowerCase());

    if (valFilter.length > 0) {
      // Filtro já aplicado Remova o atual
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
      this.stateService.updateChecksFilterIsActive(true)
      this.toApplyFilterColorOutput.emit(this.filterTopDiv)

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
          console.log('INDEXDB TIME LINE 🎅', res)
          let valFlags: FlagModel[] = res.time_line.flags
          let newTimeLine = {
            time_line: {
              flags: valFlags
            }
          }

          this.indexDbGetAllData = newTimeLine
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
    this.toApplyFilterColorOutput.emit(this.filterTopDiv)

    if (update === 'update') {
      this.stateService.updateGetAllTimeLine(this.indexDbGetAllData)
      this.stateService.updateChecksFilterIsActive(false)
      this.toApplyFilterTextOutput.emit('')  
    }
  }
}

