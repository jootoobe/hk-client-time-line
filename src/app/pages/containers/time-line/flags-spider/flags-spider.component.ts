import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { TimeLineModel } from '../../../../models/flag.model';

@Component({
  selector: 'flags-spider',
  templateUrl: './flags-spider.component.html',
  styleUrls: ['./flags-spider.component.scss']
})
export class FlagsSpiderComponent implements OnInit {
  @ViewChild('createTimeLine', { static: false }) createTimeLine!: TemplateRef<any> // open modal ref - modal to create or edit timeline

  assetsProd = environment.assetsProd // assetsProd: 'http://localhost:4201',

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

          flag_created_at: "Feb 16, 2024, 9:09:03 PM",
          flag_update_at: "0",
          flag_margin_right: '3',


          flag_design: {
            color_text: '0,0,0',
            color_transparency: '0.2',
            color_hex: "#90ab3d",
            color_rgb: "144, 171, 64",
            color_hsl: "75, 46%, 92%",
            color_date: '144, 171, 64',
            color_chips: {
              background: '74,74,74',
              text: '255,255,255'
            },
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
          social_medias_chips: [{ name: 'Redes' }, { name: 'TikTok' }, { name: 'Wwwwwwwwww' }, { name: 'Instagran' }, { name: 'Wwwwwwwwww' }, { name: 'Instagran' }, { name: 'Wwwwwwwwww' }, { name: 'Instagran' }],
          subject_tags: [],

          flags2: [
            {
              year: "2024",
              flag_id: "flag_id_21ba-bc46-cacd-1156-822d",
              flag_title: "FLAG2",
              flag_description: "wwwwwww",
              flag_style: 2,
              flag_created_at: "Feb 16, 2024, 9:09:03 PM",
              flag_update_at: "0",
              flag_margin_right: '0',

              flag_design: {
                color_text: '0,0,0',
                color_transparency: '0.2',
                color_hex: "#90ab3d",
                color_rgb: "144, 171, 64",
                color_hsl: "75, 46%, 92%",
                color_date: '144, 171, 64',
                color_chips: {
                  background: '74,74,74',
                  text: '255,255,255'
                },
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

  constructor(
    private dialogCreate: MatDialog,
    private renderer2: Renderer2,
    private elementRef: ElementRef,) { }
  ngOnInit(): void {
    console.log('FlagsSpiderComponent 🃏')
  }



    // Open Create Time_Line
    openCreateTimeLineDialog(val?: string): void {

      this.dialogCreate.open(this.createTimeLine, {
        disableClose: true,
        panelClass: 'create-flag-dialog',
        // backdropClass: 'backdropBackground',
        position: {}
      });

    }
}
