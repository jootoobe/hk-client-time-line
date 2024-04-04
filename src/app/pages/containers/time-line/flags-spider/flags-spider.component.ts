import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'flags-spider',
  templateUrl: './flags-spider.component.html',
  styleUrls: ['./flags-spider.component.scss']
})
export class FlagsSpiderComponent implements OnInit {
  @ViewChild('createTimeLine', { static: false }) createTimeLine!: TemplateRef<any> // open modal ref - modal to create or edit timeline

  assetsProd = environment.assetsProd // assetsProd: 'http://localhost:4201',


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
