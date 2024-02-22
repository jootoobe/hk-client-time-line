import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TimeLineComponent } from './time-line.component';
import { TimeLineRoutingModule } from './time-line.routing';

@NgModule({
  declarations: [
    TimeLineComponent,

  ],
  imports: [
    CommonModule,
    TimeLineRoutingModule,

 ],

  exports: [
    TimeLineComponent
  ]

})
export class TimeLineModule { }
