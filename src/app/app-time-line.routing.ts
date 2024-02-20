import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppTimeLineComponent } from './app-time-line.component';


const routes: Routes = [
  //pathMatch: 'full' >> usado como estratégia para nunca chamar a rota vazia dedicada ao projeto Spider-Share SEMPRE -- verificar necessidade do projeto
  // E este micro-serviço tiver que voltar para o projeto principal comente a linha abaixo, se não tiver botão para o projeto principal descomente a linha abaixo.
  // { path: '', redirectTo: 'time-line', pathMatch: 'full'},
  { path: '', component: AppTimeLineComponent}, // Todo Micro-serviço deve ter o componente principal livre
  { path: 'time-line',
  // canActivate: [AuthGuard],
  loadChildren: () => import('./pages/containers/time-line/time-line.module').then(m => m.TimeLineModule) },
  { path: '**', redirectTo: 'time-line' } // NAO ALTERAR PELO AMOR DE DEUS
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppTimeLineRoutingModule { }
