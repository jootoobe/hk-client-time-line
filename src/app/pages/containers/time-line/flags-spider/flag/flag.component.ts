import { AfterViewInit, Component, computed, effect, ElementRef, EventEmitter, Inject, input, Input, OnChanges, OnInit, output, Output, Renderer2, SimpleChanges } from "@angular/core";

import { FlagModel } from "../../../../../models/flag.model";
import { TimeLineModel } from "../../../../../models/time-line.model";
import { ToastrService } from "ngx-toastr";
import { StateService } from "../../../../../shared/services/state.service";
import { IFilterCheckActive } from "../../../../../interfaces/filter-check-active.interface";
import { TimeLineService } from "../../../../../services/time-line.service";
import { DoubleCheckDialogModel } from "../../../../../models/double-check-dialog/double-check-dialog.model";
import { LocalStorageService } from "../../../../../shared/services/storage/local-storage.service";
import { ConnectingExternalRoutesService } from "../../../../../shared/services/connecting-external-routes/connecting-external-routes.service";
import { EncryptDecryptModel } from "../../../../../models/encrypt-decrypt/encrypt-decrypt.model";
import { WINDOW } from "../../../../../shared/services/window.service";

export function coerceArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}


@Component({
  selector: 'flag',
  templateUrl: './flag.component.html',
  styleUrls: ['./flag.component.scss'],
})
export class FlagComponent implements OnInit, OnChanges, AfterViewInit {

  editFlagOutput = output<FlagModel>()
  @Input({ required: true }) timeLine!: TimeLineModel
  @Input({ required: true }) checkingOpacityFilterAppliedInput!: string
  @Input({ required: true }) flagLengthInput!: number

  // resetFlagsOutput = output()
  valFilterColorBarOutput = output<{ color_hex: '', color_rgb: 0 }>()  // stores the clicked filter and communicates with the top-div component

  cardIndexMouseUp = { index: 0, mouse: false } // euando o mouse passa sobre a bandeira 2

  filterColorId: any = [] // used to identify the html id of the filter color clicked on the bottom bars of the time line
  valFilterClose = { color_hex: '', color_rgb: 0 } as any// stores the clicked filter and communicates with the top-div component - start -> filterColor()
  enableDisableMouse = true // desabilita o mouse quando filtro esta ativado na bandeira 
  TOAST!: any // translator used in ToastrService
  checksFilterIsActive = false

  checkingOpacityFilterApplied = ''
  activeFilterSignal!: IFilterCheckActive
  saveFlagopacityFilter: FlagModel | undefined
  filterAlreadyExists: any = []

  language: string = ''


  doubleCheckerData!: DoubleCheckDialogModel
  innerWidthVal!: number
  innerHeightVal!: number
  innerHeightVal2!: boolean

  constructor(
    private renderer2: Renderer2,
    private elementRef: ElementRef,
    private toastrService: ToastrService,
    private stateService: StateService,
    private timeLineService: TimeLineService,
    private localStorageService: LocalStorageService,
    private connectingExternalRoutesService: ConnectingExternalRoutesService,
    @Inject(WINDOW) private window: Window,

  ) {
    setTimeout(()=>{
      this.innerWidthVal = this.window.innerWidth
      this.innerHeightVal = this.window.innerHeight
  
      if (this.innerWidthVal > 768) {
        if (this.innerHeightVal > 650) { // para pc com 650 de altura      transform: translate3d(3rem, 3.9rem, 0) scale(.8);
          this.innerHeightVal2 = false
        } else if (this.innerHeightVal < 650) {
          this.innerHeightVal2 = true
        }
      }
    },500)



    effect(() => {
      this.TOAST = this.stateService.toastSignalComputed()
    })

    effect(() => { // verifica se o filtro está ativo 
      this.checksFilterIsActive = this.stateService.checksFilterIsActiveSignalComputed()
    })


    effect(() => { // verifica se o filtro está ativo 

      this.activeFilterSignal = this.stateService.activeFilterSignalComputed()
      // aqui verifica se a flag foi clicada no filtro
      if (this.activeFilterSignal.activeFilter === '1') {
        this.saveFlagopacityFilter = this.activeFilterSignal?.flag
      }
      // aqui verifica se está undefined
      else if (this.activeFilterSignal.activeFilter === '0') {
        this.saveFlagopacityFilter = this.activeFilterSignal?.flag
      }
      // Quando o filtro de texto está aplicado
      else if (this.activeFilterSignal.activeFilter === 'filter already exists2') {
        this.filterAlreadyExists = this.activeFilterSignal.flag
      }
      // Quando o filtro de cor está aplicado
      else if (this.activeFilterSignal.activeFilter === 'filter already exists') {
        this.filterAlreadyExists = this.activeFilterSignal.flag
      }
      // fecha o filtro de opacidade - click closeFilter Top-div
      else if (this.activeFilterSignal?.activeFilter?.includes('#')) {
        let id = this.activeFilterSignal?.activeFilter?.substring(1)
        this.filterColor(this.saveFlagopacityFilter, id)
      }

      // Limpa filtro opacity
      else if (this.activeFilterSignal.activeFilter === 'create' || this.activeFilterSignal.activeFilter === 'filter') {
        if (this.saveFlagopacityFilter?.flag_title) {
          let id = this.saveFlagopacityFilter?.flag_design?.color_hex?.substring(1)
          this.filterColor(this.saveFlagopacityFilter, id)
        }
      }
    })



    effect(() => {
      this.language = this.stateService.languageSignalComputed()
    })


  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['checkingOpacityFilterAppliedInput']?.currentValue) {
      this.checkingOpacityFilterApplied = changes['checkingOpacityFilterAppliedInput']?.currentValue
    }

  }

  ngOnInit(): void {
    // this.timeLine.time_line.flags[0].flags2
  }


  ngAfterViewInit(): void { }


  trackFlagsDataJson(index: number, flags1: TimeLineModel) {
    return flags1 ? flags1.time_line : undefined;
  }

  trackFlagsDataJson2(index: number, flags2: TimeLineModel) {
    return flags2 ? flags2.time_line : undefined;
  }





  //================================= FLAG STYLES ==============================
  //==============================================================================

  setStylesText(flag1: FlagModel): any {
    let styles = {
      'color': `rgba(${flag1.flag_design?.color_text}, 1)`
    };
    return styles;
  }

  setStylesTextMonth(flag1: FlagModel): any {
    let styles = {
      'color': `rgba(${flag1.flag_design?.color_text}, 0.8)`
    };
    return styles;
  }


  setStylesTextYear(flag1: FlagModel): any {
    let styles = {
      'color': `rgba(${flag1.flag_design?.color_text}, 0.6)`
    };
    return styles;
  }



  setStylesChip(flag1: FlagModel): any {
    let styles = {
      'color': `rgba(${flag1.flag_design?.color_chips.text}, 1)`,
      'background-color': `rgba(${flag1.flag_design?.color_chips.background}, 1)`
    };
    return styles;
  }

  setStylesDate(flag1: FlagModel): any {

    if (flag1.flag_design?.color_date === '255, 255, 255' && flag1.flag_design?.color_rgb !== '255, 255, 255' ||
      flag1.flag_design?.color_date === '0, 0, 0' && flag1.flag_design?.color_rgb !== '0, 0, 0' ||
      flag1.flag_design?.color_date === '255, 0, 0' && flag1.flag_design?.color_rgb !== '255, 0, 0' ||
      flag1.flag_design?.color_date === '255, 255, 0' && flag1.flag_design?.color_rgb !== '255, 255, 0') {
      let styles = {
        'background-color': `rgba(${flag1.flag_design?.color_date}, 1)`
      };
      return styles;
    }

    let styles = {
      'background-color': `rgba(${flag1.flag_design?.color_date}, 0.2)`
    };

    return styles;
  }

  setStylesCards(flag1: FlagModel): any {
    let styles = {
      'border-left': '.5rem solid rgba(' + flag1.flag_design?.color_rgb + ',1)',
      'background-color': `rgba(${flag1.flag_design?.color_rgb}, ${flag1.flag_design?.color_transparency})`
    };
    return styles;
  }




  // ⬇️ Edit Flag
  editFlag(flagEdit: FlagModel, editFlag: string) {
    flagEdit.edit = editFlag
    this.editFlagOutput.emit(flagEdit)
  }




  // mouse hovers over flag 02 (pops up)
  // Faz a flag vir para a frente
  mouseUp(val: number) {
    // if (this.enableDisableMouse) {
    if (val === -1) {
      this.cardIndexMouseUp = { index: -1, mouse: false }
      return
    }
    this.cardIndexMouseUp = { index: val, mouse: true }
    // }
  }

  disableFilter(flag: FlagModel, id?: string) {

    if (this.filterColorId[0] === `color-${id}`) {
      this.filterColor(flag, id)
    }

    // this.resetFlagsOutput.emit()

  }


  /**
   * OBS filtra uma cor por vez apenas
* **************************************** We have 2 types of filters ********************************************************
* * * * * ====== Direct time line filter AND filter activated by the icon in the component TopDivComponent ========= * * * * *
* @param { DirectTimeLineFilter }  filterColor - filterColor(val?: any) - Leaves the flags opaque so they can be highlighted
* @param { FilterFlagComponent }  FilterFlagComponent - Stays in the component TopDivComponent -- It is a component that filters the flag name and colors - all filters are applied individually so far
*/
  filterColor(flag?: FlagModel | any, id?: string) {

    if (this.filterAlreadyExists.length > 0) {
      this.toastrService.info(this.TOAST['TIME-LINE']['FlagComponent'].info['msn-0']['message-0'], this.TOAST['TIME-LINE']['FlagComponent'].info['msn-0']['message-1']);
      return
    }

    // this.filterAlreadyExists = []
    this.filterColorId.filter((colorId: any) => colorId === `color-${id}`);


    const card = this.elementRef.nativeElement.querySelectorAll([
      '.flag-1_card', '.flag-1_line', '.flag-1_base', '.flag-1_filter',
      '.flag-2_card', '.flag-2_line', '.flag-2_base', '.flag-2_filter2']);

    const remove = this.elementRef.nativeElement.querySelectorAll(['.remove']);
    const opacity = this.elementRef.nativeElement.querySelectorAll(['.opacity']);

    if (this.filterColorId.length === 0) {

      this.enableDisableMouse = false

      card.forEach((e: any, i: number) => {
        if (e.id !== `color-${id}`) {
          this.renderer2.setStyle(e, 'opacity', '.3');
        }
      });

      remove.forEach((e: any, i: number) => {
        if (e.id !== `remove-${id}`) {
          this.renderer2.setStyle(e, 'display', 'none');
        }
      });

      opacity.forEach((e: any, i: number) => {
        if (e.id === `opacity-${id}`) {
          this.renderer2.setStyle(e, 'opacity', '1');
        }
      });


      this.filterColorId.push(`color-${id}`)
      this.valFilterClose = {
        color_hex: flag?.flag_design.color_hex,
        color_rgb: Number(flag?.flag_design.color_rgb.split(',')[0])
      }

      let activeFilter = {
        flag,
        activeFilter: '1'
      }

      this.stateService.updateActiveFilterSignal(activeFilter)
      this.valFilterColorBarOutput.emit(this.valFilterClose)


    } else if (this.filterColorId[0] === `color-${id}`) {
      this.enableDisableMouse = true
      card.forEach((e: any, i: number) => {
        if (e.id != `color-${id}`) {
          this.renderer2.setStyle(e, 'opacity', '1');
        }
      });

      // desabilita o click de edição das bandeiras filtradas
      remove.forEach((e: any, i: number) => {
        if (e.id != `remove-${id}`) {
          this.renderer2.setStyle(e, 'display', 'inline-flex');
        }
      })

      this.valFilterClose = {
        color_hex: '',
        color_rgb: 0
      }
      this.filterColorId = []
      this.valFilterColorBarOutput.emit(this.valFilterClose)

      let activeFilter = {
        activeFilter: '0'
      }

      setTimeout(() => {
        this.stateService.updateActiveFilterSignal(activeFilter)
      }, 100)


    }
  }

  // modal-doublechecker
  deleteChecksBeforeSocialMediasChips(flagDelete: FlagModel | any, editFlag: string) {

    if (editFlag === 'edit-flag-1') {
      // Value sent to the modal
      this.doubleCheckerData = {
        modals: {
          types: {
            type: 'type-delete',
            flag: flagDelete,
            _id: editFlag
          },
        }
      }
    } else if (editFlag === 'edit-flag-2') {
      this.doubleCheckerData = {
        modals: {
          types: {
            type: 'type-delete',
            flag: flagDelete.flags2[0],
            _id: editFlag
          },
        }
      }
    }
  }

  deleteFlagEvent(e: boolean) {
    let editFlag: any = this.doubleCheckerData.modals.types._id
    this.deleteFlag(this.doubleCheckerData.modals.types.flag, editFlag)
  }

  deleteFlag(flagDelete: FlagModel | any, editFlag: string) {
    this.connectingExternalRoutesService.spiderShareLoader({ message: true })
    let id: any = ''
    let flag = ''

    if (editFlag === 'edit-flag-1' && flagDelete.flags2?.length > 0) {
      id = flagDelete.flag_id?.split('_')
      flag = '3' // bandeira 1 - possui bandeira 2
    }

    if (editFlag === 'edit-flag-1' && flagDelete.flags2?.length <= 0) {

      id = flagDelete.flag_id?.split('_')
      flag = '1' // bandeira 1 - individual

    } else if (editFlag === 'edit-flag-2') {
      id = flagDelete.flag_id?.split('_')
      flag = '2' // bandeira 2
    }

    this.timeLineService.deleteById(id[2], flag)
      .subscribe({
        next: (res: EncryptDecryptModel) => {
          if (res.a === 'OK') {
            this.stateService.updateGetTimeLineHttpSignal(true)
          }
        },
        error: (err) => {
          this.stateService.updateTimeLineIndexDbErrorSignalSignal(true)
          setTimeout(() => {
            this.connectingExternalRoutesService.spiderShareLoader({ message: false })
            this.toastrService.error(this.TOAST['TIME-LINE']['FlagComponent'].error['msn-0']['message-0'], this.TOAST['TIME-LINE']['FlagComponent'].error['msn-0']['message-1']);
          }, 2000)
        },
        complete: () => { }
      })


  }

  getFlagIdNavegateKanban(flagId: FlagModel) {
    let idFlag = flagId.flag_id.split('_')

    const routerKanban = {
      router: `/kanban/${idFlag[2]}`,
      message: 'Time-Line >> navigating to kanban byId'
    }
    this.connectingExternalRoutesService.navigateKanban(routerKanban)

  }
}
