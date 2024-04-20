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
  @Input({required: true}) timeLine!:TimeLineModel

  constructor() {
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
        flag1.flag_design?.color_date === '255,255,0' ) {
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
    editFlag(flagEdit: FlagModel, editFlag:string) {
      flagEdit.edit = editFlag
      console.log(flagEdit)
      this.editFlagOutput.emit(flagEdit)
    }




}
