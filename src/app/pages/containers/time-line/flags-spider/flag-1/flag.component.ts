import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges } from "@angular/core";

@Component({
  selector: 'flag',
  templateUrl: './flag.component.html',
  styleUrls: ['./flag.component.scss'],
})
export class FlagComponent implements OnInit, OnChanges, AfterViewInit {
  time_line = {
    iam_id: '65ff5d9c8e66b41b0e36825d',
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

        flags2:  [
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
      ],
      },


      {
        year: "2024",
        flag_id: "flag_id_21ba-bc46-cacd-1156-822d",
        flag_title: "uuuuuuuuuuuuuu",
        flag_description: "BBBBBBB",
        flag_style: 1,
        color_hex: "#90ab3d",
        color_rgb: "144, 171, 64",
        color_hsl: "75, 46%, 92%",
        flag_local_zone: "America/Sao_Paulo",
        flag_created_at: "Feb 16, 2024, 9:09:03 PM",
        flag_update_at: "0",
        flag_margin_right: '3',
        date_obj: {
          day_month_year: "2024-02-17T12:00:00.000Z",
          date_origin: "2024-02-17T03:00:00.000Z",
          day: "17",
          month: "02",
          month_s: "FEV",
          year: "2024",
          month_code: 2,
          timestamp: 1708171300000,
          time: "12:00:00"
        },
        social_medias_chips: [{ name: 'Facebook' }],
        subject_tags: [],

        flags2:  [
          {
            year: "2024",
            flag_id: "flag_id_21ba-bc46-cacd-1156-822d",
            flag_title: "uuuuuuu222222",
            flag_description: "BBBBBBB",
            flag_style: 2,
            color_hex: "#90ab3d",
            color_rgb: "144, 171, 64",
            color_hsl: "75, 46%, 92%",
            flag_local_zone: "America/Sao_Paulo",
            flag_created_at: "Feb 16, 2024, 9:09:03 PM",
            flag_update_at: "0",
            flag_margin_right: '0',
            date_obj: {
              day_month_year: "2024-02-17T12:00:00.000Z",
              date_origin: "2024-02-17T03:00:00.000Z",
              day: "17",
              month: "02",
              month_s: "FEV",
              year: "2024",
              month_code: 2,
              timestamp: 1708171300000,
              time: "12:00:00"
            },
            social_medias_chips: [{ name: 'Facebook' }],
            subject_tags: [],
        }
      ],
      },






      {
        year: "2030",
        flag_id: "flag_id_21ba-bc46-cacd-1156-822d",
        flag_title: "uuuuuuuuuuuuuu",
        flag_description: "BBBBBBB",
        flag_style: 1,
        color_hex: "#90ab3d",
        color_rgb: "144, 171, 64",
        color_hsl: "75, 46%, 92%",
        flag_local_zone: "America/Sao_Paulo",
        flag_created_at: "Feb 16, 2024, 9:09:03 PM",
        flag_update_at: "0",
        flag_margin_right: '0',
        date_obj: {
          day_month_year: "2024-02-17T12:00:00.000Z",
          date_origin: "2024-02-17T03:00:00.000Z",
          day: "17",
          month: "02",
          month_s: "FEV",
          year: "2030",
          month_code: 2,
          timestamp: 1708171500000,
          time: "12:00:00"
        },
        social_medias_chips: [{ name: 'Facebook' }],
        subject_tags: []
      },


    ],
  }

  constructor() { }

  ngOnChanges(): void { }

  ngOnInit(): void { }


  ngAfterViewInit(): void { }


  trackFlagsDataJson(index: number, flags1: any) {
    return flags1
  }

  trackFlagsDataJson2(index: number, flags2: any) {
    return flags2
  }

  setStyles(flag1: any): any {
    let styles = {
      'border-left': '.5rem solid rgba(' + flag1.color_rgb + ',1)',
      'background-color': 'rgba(' + flag1.color_rgb + ',.3)'
    };
    return styles;
  }

}
