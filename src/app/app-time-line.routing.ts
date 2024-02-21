import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppTimeLineComponent } from './app-time-line.component';
import { TimeLineComponent } from './pages/containers/time-line/time-line.component';


const routes: Routes = [

  { path: '', component: AppTimeLineComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppTimeLineRoutingModule { }
