import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FlagsSpiderComponent } from './flags-spider.component';
import { TopDivComponent } from './top-div/top-div.component';

// import { CanvasTimeLineComponent } from './canvas-time-line/canvas-time-line.component';

const routes: Routes = [

  { path: ':id', component: FlagsSpiderComponent }, //:id/:id
  // { path: ':id/top-div', component: TopDivComponent},//:id/:id/top-div
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlagsSpiderRoutingModule { }
