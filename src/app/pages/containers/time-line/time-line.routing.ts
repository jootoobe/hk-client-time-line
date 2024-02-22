import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TimeLineComponent } from './time-line.component';

// import { CanvasTimeLineComponent } from './canvas-time-line/canvas-time-line.component';

const routes: Routes = [

  {
    path: 'time-line', component: TimeLineComponent,
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimeLineRoutingModule { }
