import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppTimeLineComponent } from './app-time-line.component';
import { FlagsSpiderModule } from './pages/containers/flags-spider/flags-spider.module';

const routes: Routes = [

  { path: '', component: AppTimeLineComponent },

  {
    path: '',
    // canActivate: [AuthGuard],
    // Se usar o loadChildren da forma padrão eu recebo o erro abaixo
    // angular minfolder Uncaught SyntaxError: Cannot use import statement outside a module (at main.js:1:1)
    // loadChildren: () => import('./pages/containers/flags-spider/flags-spider.module').then(m => m.FlagsSpiderModule)
    // loadChildren: async () => (await import('./pages/containers/flags-spider/flags-spider.module')).FlagsSpiderModule,
    loadChildren: async () => (await FlagsSpiderModule),
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppTimeLineRoutingModule { }
