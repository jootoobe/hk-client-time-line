import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TimeLineComponent } from './time-line.component';
import { FlagsSpiderModule } from '../flags-spider/flags-spider.module';

// import { CanvasTimeLineComponent } from './canvas-time-line/canvas-time-line.component';

const routes: Routes = [


  {
    path: '', component: TimeLineComponent,
  },

  {
    path: '',
    // canActivate: [AuthGuard],
    // Se usar o loadChildren da forma padrão eu recebo o erro abaixo
    // angular minfolder Uncaught SyntaxError: Cannot use import statement outside a module (at main.js:1:1)
    // loadChildren: () => import('./pages/containers/flags-spider/flags-spider.module').then(m => m.FlagsSpiderModule)
    // loadChildren: async () => (await import('../flags-spider/flags-spider.module')).FlagsSpiderModule,
    loadChildren: async () => (await FlagsSpiderModule),
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimeLineRoutingModule { }
