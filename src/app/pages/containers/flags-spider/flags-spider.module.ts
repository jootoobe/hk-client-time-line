import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FlagsSpiderComponent } from './flags-spider.component';
import { FlagsSpiderRoutingModule } from './flags-spider.routing';
import { TopDivComponent } from './top-div/top-div.component';

@NgModule({
  declarations: [
    FlagsSpiderComponent,
    TopDivComponent
  ],
  imports: [
    CommonModule,
    FlagsSpiderRoutingModule
  ],
  providers: [],
  bootstrap: [],
  exports:[]
})
export class FlagsSpiderModule {

}

