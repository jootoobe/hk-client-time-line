import { Component, Input, OnInit, output } from '@angular/core';

// import { ConnectingExternalRoutesService } from '../../../../../shared/connecting-external-routes/connecting-external-routes.service';
import { SignInService } from '../../../../../spider-share/iam/services/auth/sign-in.service';
import { TimeLineModel } from '../../../../../models/time-line.model';
import { StateService } from '../../../../../shared/services/state.service';

@Component({
  selector: 'top-div',
  templateUrl: './top-div.component.html',
  styleUrl: './top-div.component.scss',
  providers: [SignInService]

})
export class TopDivComponent implements OnInit {
  @Input({ required: true }) timeLine!: TimeLineModel
  // toda vez que o menu for clicado eu limpoo filtro todo -- O Filtro não pode estar ativo quando o usuário edita ou deleta a bandeira 
  // <!-- Filter opacity -->
  @Input({ required: true }) valFilterColorBarInput = { color_hex: '', color_rgb: 0 } as any // stores the clicked filter bar and communicates with the top-div component
  timeLineOutput = output<TimeLineModel>()
  openModalOutput = output()

  toApplyFilterText = ''
  toApplyFilterColor = [] as any //  <!-- Filter select -->

  constructor(
    // private connectingExternalRoutesService: ConnectingExternalRoutesService,
    private stateService: StateService
  ) { }
  ngOnInit(): void {
    console.log('TopDivComponent 🃏')
  }

  openCreateTimeLineDialog() {
    let activeFilter = {activeFilter: 'create'}
    this.stateService.updateActiveFilterSignal(activeFilter) 

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
    this.toApplyFilterColor = event
  }




}
