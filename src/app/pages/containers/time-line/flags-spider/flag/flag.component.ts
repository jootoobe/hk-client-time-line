import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges } from "@angular/core";
import { FlagModel, TimeLineModel } from "../../../../../models/flag.model";

@Component({
  selector: 'flag',
  templateUrl: './flag.component.html',
  styleUrls: ['./flag.component.scss'],
})
export class FlagComponent implements OnInit, OnChanges, AfterViewInit {

  aaaa!: TimeLineModel
  timeLine: TimeLineModel = {
    iam_id: '65ff5d9c8e66b41b0e36825d',
    time_line: {
      flags: [
        {
          year: "2024",
          flag_id: "flag_id_21ba-bc46-cacd-1156-822d",
          flag_title: "FLAG1",
          flag_description: "wwwwwww",
          flag_style: 1,

          color_hex: "#90ab3d",
          color_rgb: "144, 171, 64",
          color_hsl: "75, 46%, 92%",

          flag_local_zone: "America/Sao_Paulo",
          flag_created_at: "Feb 16, 2024, 9:09:03 PM",
          flag_update_at: "0",
          flag_margin_right: '3',

          flag_design: {
            color_text: '255,0,0',
            color_chips: {
              background: '0,0,0',
              text: '255,255,255'
            },
            color_transparency: '0.5',
            color_hex: "#90ab3d",
            color_rgb: "144, 171, 64",
            color_hsl: "75, 46%, 92%",
            color_date: {background: '144, 171, 64', transparency: '0.3'}
          },

          date_obj: {
            day_month_year: "2024-02-17T12:00:00.000Z",
            date_origin: "2024-02-17T03:00:00.000Z",
            day: "17",
            month: "02",
            month_s: "FEV",
            year: "2024",
            month_code: 2,
            timestamp: 1708171200000,
            time: "12:00:00"
          },
          social_medias_chips: [ {name:'Redes'}, {name:'TikTok'}, {name:'Wwwwwwwwww'}, {name:'Instagran'}, {name:'Wwwwwwwwww'}, {name:'Instagran'}, {name:'Wwwwwwwwww'}, {name:'Instagran'}],
          subject_tags: [],

          flags2: [
            {
              year: "2024",
              flag_id: "flag_id_21ba-bc46-cacd-1156-822d",
              flag_title: "FLAG2",
              flag_description: "wwwwwww",
              flag_style: 2,
              color_hex: "#90ab3d",
              color_rgb: "144, 171, 64",
              color_hsl: "75, 46%, 92%",
              flag_local_zone: "America/Sao_Paulo",
              flag_created_at: "Feb 16, 2024, 9:09:03 PM",
              flag_update_at: "0",
              flag_margin_right: '0',

              flag_design: {
                color_text: 'black',
                color_chips: {
                  background: 'black',
                  text: 'white'
                },
                color_transparency: '0.2',
                color_hex: "#90ab3d",
                color_rgb: "144, 171, 64",
                color_hsl: "75, 46%, 92%",
                color_date: {background: '255, 255, 0', transparency: '1'}
              },


              date_obj: {
                day_month_year: "2024-02-17T12:00:00.000Z",
                date_origin: "2024-02-17T03:00:00.000Z",
                day: "17",
                month: "02",
                month_s: "FEV",
                year: "2024",
                month_code: 2,
                timestamp: 1708171200000,
                time: "12:00:00"
              },
              social_medias_chips: [],
              subject_tags: [],
            }
          ]
        },




      ],
    }
  }

  constructor() {
    // if(this.aaaa?.time_line[0]?.flags2)
    // this.aaaa?.time_line[0]?.flags2[0]?.color_hsl
  }

  ngOnChanges(): void { }

  ngOnInit(): void { }


  ngAfterViewInit(): void { }


  trackFlagsDataJson(index: number, flags1: TimeLineModel) {
    return flags1
  }

  trackFlagsDataJson2(index: number, flags2: TimeLineModel) {
    return flags2
  }

  setStylesCards(flag1: FlagModel): any {
    let styles = {
      'border-left': '.5rem solid rgba(' + flag1.flag_design?.color_rgb + ',1)',
      'background-color': `rgba(${flag1.flag_design?.color_rgb}, ${flag1.flag_design?.color_transparency})`
    };
    return styles;
  }


  setStylesDate(flag1: FlagModel): any {
    let styles = {
      'background-color': `rgba(${flag1.flag_design?.color_date.background}, ${flag1.flag_design?.color_date.transparency})`
    };
    return styles;
  }

  setStylesText(flag1: FlagModel): any {
    let styles = {
      'color': `rgba(${flag1.flag_design?.color_text}, 1)`
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

}
