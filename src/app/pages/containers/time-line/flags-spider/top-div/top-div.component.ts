import { Component, Input, OnInit, output } from '@angular/core';

// import { ConnectingExternalRoutesService } from '../../../../../shared/connecting-external-routes/connecting-external-routes.service';
import { SignInService } from '../../../../../spider-share/iam/services/auth/sign-in.service';
import { TimeLineModel } from '../../../../../models/time-line.model';

@Component({
  selector: 'top-div',
  templateUrl: './top-div.component.html',
  styleUrl: './top-div.component.scss',
  providers:[SignInService]

})
export class TopDivComponent implements OnInit {
  @Input({ required: true }) timeLine!: TimeLineModel
  // toda vez que o menu for clicado eu limpoo filtro todo -- O Filtro não pode estar ativo quando o usuário edita ou deleta a bandeira 
  @Input({ required: true }) resetFilterInput!: Boolean 
  @Input({ required: true }) valFilterColorBarInput = { color_hex: '', color_rgb: 0 } as any // stores the clicked filter bar and communicates with the top-div component
  timeLineOutput = output<TimeLineModel>()
  openModalOutput = output()
  clearBarFilterBarOutput = output() // limpa o filtro barra inferior

  toApplyFilterText = ''
  toApplyFilterColor = [] as any

  constructor(
    // private connectingExternalRoutesService: ConnectingExternalRoutesService,
    private signInService: SignInService
    ) { }
  ngOnInit(): void {
    console.log('TopDivComponent 🃏')
  }

  openCreateTimeLineDialog() {
    this.openModalOutput.emit()
  }

  timeLineEvent(event: TimeLineModel) {
    console.log('event event event event', event)
    this.timeLineOutput.emit(event)
  }
  
  toApplyFilterTextEvent(event: string) {
    this.toApplyFilterText = event
  }

  toApplyFilterColorEvent(event: any) {
    console.log('event event event event', event)
    this.toApplyFilterColor = event
  }

  clearBarFilterBar() {
   this.clearBarFilterBarOutput.emit() 
  }

}
