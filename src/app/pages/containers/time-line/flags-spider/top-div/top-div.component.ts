import { Component, effect, Input, OnInit, output, SimpleChanges } from '@angular/core';

// import { ConnectingExternalRoutesService } from '../../../../../shared/connecting-external-routes/connecting-external-routes.service';
import { SignInService } from '../../../../../spider-share/iam/services/auth/sign-in.service';
import { TimeLineModel } from '../../../../../models/time-line.model';
import { StateService } from '../../../../../shared/services/state.service';
import { UserForAppModel } from '../../../../../models/user-for-app/user-for-app.model';
import { PaidUserPlansEnum } from '../../../../../enum/paid-user-plans.enum';
import { FlagModel } from '../../../../../models/flag.model';

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

  @Input({ required: true }) flagLengthInput!: number


  toApplyFilterText = ''
  toApplyFilterColor = [] as any //  <!-- Filter select -->
  user!: UserForAppModel
  paidUserPlans = PaidUserPlansEnum
  totalFlags = 0
  constructor(
    // private connectingExternalRoutesService: ConnectingExternalRoutesService,
    private stateService: StateService
  ) {

    effect(() => {
      let userVal = this.stateService.userForAppSignalComputed()
      
      if (userVal && userVal.email) {
        this.user = userVal
      }


    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['timeLine']) {
      console.log('ssssssssssss', this.timeLine)

      if (this.timeLine && this.timeLine.time_line && this.timeLine.time_line.flags) {

        let somaTotal = 0; // Inicializa a variável acumuladora

        this.timeLine.time_line.flags.forEach((e: FlagModel, i: number) => {
          const flags2Length = e.flags2 ? e.flags2.length : 0; // Garantir que flags2 existe
          somaTotal += flags2Length; // Acumula a soma do índice 'i' com o comprimento de flags2

          console.log(`Soma acumulada no índice ${i}:`, somaTotal);
        });

        this.totalFlags = somaTotal + this.timeLine.time_line.flags.length

        console.log(`Soma acumulada no índice`, this.totalFlags);
      }
    }
  }

  ngOnInit(): void {
  }

  openCreateTimeLineDialog() {
    let activeFilter = { activeFilter: 'create' }
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
    let activeFilter = { activeFilter: val }
    this.stateService.updateActiveFilterSignal(activeFilter)
  }

  openFilterDialogCloseFilterOpacity() {
    let activeFilter = { activeFilter: 'filter' }
    this.stateService.updateActiveFilterSignal(activeFilter)
  }

}
