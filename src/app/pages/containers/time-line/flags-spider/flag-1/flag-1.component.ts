import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges } from "@angular/core";

@Component({
  selector: 'flag-1',
  templateUrl: './flag-1.component.html',
  styleUrls: ['./flag-1.component.scss'],
})
export class Flag1Component implements OnInit, OnChanges, AfterViewInit {
  time_line = [
    {
      year: "2024",
      flags: [
        {
          flag_id: "flag_id_21ba-bc46-cacd-1156-822d",
          flag_title: "wwwwwwww",
          flag_description: "wwwwwww",
          flag_style: 1,
          color_hex: "#90ab3d",
          color_rgb: "144, 171, 64",
          color_hsl: "75, 46%, 92%",
          flag_local_zone: "America/Sao_Paulo",
          flag_created_at: "Feb 16, 2024, 9:09:03 PM",
          flag_update_at: "0",
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
          subject_tags: []
        },
        // {
        //   flag_id: "flag_id_21ba-bc46-cacd-1156-822d",
        //   flag_title: "AAAAAAA",
        //   flag_description: "BBBBBBB",
        //   flag_style: 1,
        //   color_hex: "#90ab3d",
        //   color_rgb: "144, 171, 64",
        //   color_hsl: "75, 46%, 92%",
        //   flag_local_zone: "America/Sao_Paulo",
        //   flag_created_at: "Feb 16, 2024, 9:09:03 PM",
        //   flag_update_at: "0",
        //   date_obj: {
        //     day_month_year: "2024-02-17T12:00:00.000Z",
        //     date_origin: "2024-02-17T03:00:00.000Z",
        //     day: "17",
        //     month: "02",
        //     month_s: "FEV",
        //     year: "2024",
        //     month_code: 2,
        //     timestamp: 1708171200000,
        //     time: "12:00:00"
        //   },
        //   social_medias_chips: [],
        //   subject_tags: []
        // },
      ]
    }
  ]

  constructor() {}

  ngOnChanges(): void { }

  ngOnInit(): void {}


  ngAfterViewInit(): void { }


}
