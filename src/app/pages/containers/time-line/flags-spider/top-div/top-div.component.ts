import { Component, effect, Input, OnInit, output } from '@angular/core';

// import { ConnectingExternalRoutesService } from '../../../../../shared/connecting-external-routes/connecting-external-routes.service';
import { SignInService } from '../../../../../spider-share/iam/services/auth/sign-in.service';
import { TimeLineModel } from '../../../../../models/time-line.model';
import { StateService } from '../../../../../shared/services/state.service';
import { UserForAppModel } from '../../../../../models/user-for-app/user-for-app.model';

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
  closeFilterId = output<string>()

  toApplyFilterText = ''
  toApplyFilterColor = [] as any //  <!-- Filter select -->
  user!: UserForAppModel
  constructor(
    // private connectingExternalRoutesService: ConnectingExternalRoutesService,
    private stateService: StateService
  ) { 

    effect(() => {
      let userVal = this.stateService.userForAppSignalComputed()
      if(userVal && userVal.email) {
        this.user = userVal
        console.log('TIME-LINE CHEGOU >>>>>>>>>>>',this.user)
      }
    })
  }



  ngOnInit(): void {
  }

  openCreateTimeLineDialog() {
    let activeFilter = {activeFilter: 'create'}
    this.stateService.updateActiveFilterSignal(activeFilter) 

    this.openModalOutput.emit()
  }

  timeLineEvent(event: TimeLineModel) {
    this.timeLineOutput.emit(event)
  }

  toApplyFilterTextEvent(event: string) {
    this.toApplyFilterText = event

    let val = event === '' ? [] : [event]
    
    let activeFilter = {
      flag: val,
      activeFilter: 'filter already exists'
    }
    this.stateService.updateActiveFilterSignal(activeFilter) 
  }

  toApplyFilterColorEvent(event: any) {
    this.toApplyFilterColor = event

      let activeFilter = {
        flag: event,
        activeFilter: 'filter already exists'
      }
      this.stateService.updateActiveFilterSignal(activeFilter) 
  }


  closeFilter(val: string) {
    let activeFilter = {activeFilter: val}
    this.stateService.updateActiveFilterSignal(activeFilter) 
  }

  openFilterDialogCloseFilterOpacity(){
    let activeFilter = {activeFilter: 'filter'}
    this.stateService.updateActiveFilterSignal(activeFilter) 
  }

}
