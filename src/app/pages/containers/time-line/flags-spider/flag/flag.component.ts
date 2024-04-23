import { AfterViewInit, Component, computed, ElementRef, EventEmitter, input, Input, OnChanges, OnInit, output, Output, Renderer2, SimpleChanges } from "@angular/core";

import { FlagModel } from "../../../../../models/flag.model";
import { TimeLineModel } from "../../../../../models/time-line.model";

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
  cardIndexMouseUp = { index: 0, mouse: false }
  filterColorId: any = [] // used to identify the html id of the filter color clicked on the bottom bars of the time line

  constructor(
    private renderer2: Renderer2,
    private elementRef: ElementRef
  ) {
    // if(this.aaaa?.time_line[0]?.flags2)
    // this.aaaa?.time_line[0]?.flags2[0]?.color_hsl
  }

  ngOnChanges(): void { }

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

    if (flag1.flag_design?.color_date === '255,255,255' ||
      flag1.flag_design?.color_date === '0,0,0' ||
      flag1.flag_design?.color_date === '255,0,0' ||
      flag1.flag_design?.color_date === '255,255,0') {
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
    console.log(flagEdit)
    this.editFlagOutput.emit(flagEdit)
  }




  // mouse hovers over flag 02 (pops up)
  // Faz a flag vir para a frente
  mouseUp(val: number) {
    console.log(val)
    if (val === -1) {
      this.cardIndexMouseUp = { index: -1, mouse: false }
      return
    }
    this.cardIndexMouseUp = { index: val, mouse: true }
  }


  /**
* **************************************** We have 2 types of filters ********************************************************
* * * * * ====== Direct time line filter AND filter activated by the icon in the component TopDivComponent ========= * * * * *
* @param { DirectTimeLineFilter }  filterColor - filterColor(val?: any) - Leaves the flags opaque so they can be highlighted
* @param { FilterFlagComponent }  FilterFlagComponent - Stays in the component TopDivComponent -- It is a component that filters the flag name and colors - all filters are applied individually so far
*/
  filterColor(flag?: any, id?: any) {

    const card = this.elementRef.nativeElement.querySelectorAll([
      '.flag-1_card', '.flag-1_line', '.flag-1_base', '.flag-1_filter',
      '.flag-2_card', '.flag-2_line', '.flag-2_base', '.flag-2_filter2']);

    const month = this.elementRef.nativeElement.querySelectorAll(['.flag-1_month']);
    
    const menu_remove_icon = this.elementRef.nativeElement.querySelectorAll(['.menu-remove-icon']);

    const white_background = this.elementRef.nativeElement.querySelectorAll(['.flag-1_white--background']);

    card.forEach((e: any, i: number) => {
      if (e.id !== `color-${id}`) {
        this.renderer2.setStyle(e, 'opacity', '.3');
      }
    });

    // month.forEach((e: any, i: number) => {
    //   if (e.id !== `month-${id}`) {
    //     this.renderer2.setStyle(e, 'display', 'none');
    //   }
    // });

    menu_remove_icon.forEach((e: any, i: number) => {
      if (e.id != `menu-${id}}`) {
        this.renderer2.setStyle(e, 'display', 'none');
      }
    });

    white_background.forEach((e: any, i: number) => {
      if (e.id !== `background-${id}}`) {
        // this.renderer2.setStyle(e, 'background', 'white');
        // this.renderer2.setStyle(e, 'opacity', '1');
      }
    });
    

  }


}
