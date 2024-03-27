import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';
import { FlagsSpiderComponent } from './flags-spider/flags-spider.component';
import { TopDivComponent } from './flags-spider/top-div/top-div.component';
import { TimeLineComponent } from './time-line.component';
import { TimeLineRoutingModule } from './time-line.routing';

@NgModule({
  declarations: [
    TimeLineComponent,
    FlagsSpiderComponent,
    TopDivComponent
  ],
  imports: [
    CommonModule,
    TimeLineRoutingModule,
    ComponentsModule,
 ],

  exports: [
    TimeLineComponent,
    FlagsSpiderComponent,
    TopDivComponent
  ]

})
export class TimeLineModule { }
