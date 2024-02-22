import { NgModule } from '@angular/core';
import { BrowserModule, createApplication } from '@angular/platform-browser';

import { AppTimeLineComponent } from './app-time-line.component';
import { createCustomElement } from '@angular/elements';
import { CommonModule } from '@angular/common';
import { AppTimeLineRoutingModule } from './app-time-line.routing';
import { TimeLineModule } from './time-line/time-line.module';

@NgModule({
  declarations: [
    AppTimeLineComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppTimeLineRoutingModule,
    TimeLineModule

  ],
  providers: [],
  bootstrap: [AppTimeLineComponent]
})
export class AppTimeLineModule {}
