import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeLineRoutingModule } from './time-line.routing';
import { TimeLineComponent } from './time-line.component';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    TimeLineComponent,

  ],
  imports: [
    TimeLineRoutingModule,
 ],

  exports: [
    TimeLineComponent
  ]

})
export class TimeLineModule { }
