import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeLineRoutingModule } from './time-line.routing';
import { TimeLineComponent } from './time-line.component';

@NgModule({
  declarations: [
    TimeLineComponent,

  ],
  imports: [
    CommonModule,
    TimeLineRoutingModule,
 ],

  exports: []

})
export class TimeLineModule { }
