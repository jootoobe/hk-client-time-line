import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TimeLineModule } from './pages/containers/time-line/time-line.module';
import { AppTimeLineComponent } from './app-time-line.component';

const routes: Routes = [
  { path: '', component: AppTimeLineComponent},

  {
    path: ':id', // time-line
    // canActivate: [AuthGuard],
    // Se usar o loadChildren da forma padrão eu recebo o erro abaixo
    // angular minfolder Uncaught SyntaxError: Cannot use import statement outside a module (at main.js:1:1)
    // loadChildren: () => import('./pages/containers/time-line/time-line.module').then(m => m.TimeLineModule)
    // loadChildren: async () => (await import('./pages/containers/flags-spider/flags-spider.module')).FlagsSpiderModule,
    loadChildren: async () => (await TimeLineModule),
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppTimeLineRoutingModule { }
