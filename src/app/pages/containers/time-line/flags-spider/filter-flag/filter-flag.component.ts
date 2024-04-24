import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { TimeLineModel } from "../../../../../models/time-line.model";


@Component({
  selector: 'filter-flag',
  templateUrl: './filter-flag.component.html',
  styleUrls: ['./filter-flag.component.scss'],
})
export class FilterFlagComponent implements OnInit {
  @Input({ required: true }) timeLine!: TimeLineModel
  @ViewChild('filterTimeLine', { static: false }) filterTimeLine!: TemplateRef<ElementRef>; // open modal ref

  titleFlag!: string;
  constructor(
    private dialogCreate: MatDialog,

  ) {


  }

  ngOnInit(): void {
  }

    // Open Create Time_Line
    openFilterTimeLineDialog() {
      this.dialogCreate.open(this.filterTimeLine, {
        disableClose: false,
        panelClass: 'filter-time-line-dialog',
        // backdropClass: 'backdropBackground',
        position: {}
      });
  
    }

    filterFlag() {
      
    }
}


