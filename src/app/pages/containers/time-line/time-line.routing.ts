import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimeLineComponent } from './time-line.component';
// import { CanvasTimeLineComponent } from './canvas-time-line/canvas-time-line.component';

const routes: Routes = [
  { path: '', component: TimeLineComponent},
  // { path: 'vamo-que-vamo', component: VamoQueVamoComponent},
  // { path: 'vamo-que-vamo/:id', component: VamoQueVamoComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimeLineRoutingModule { }
