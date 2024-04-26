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
  toApplyFilterText = output<TimeLineModel>()
  openModal = output()
  clearBarFilterBar = output() // limpa o filtro barra inferior

  constructor(
    // private connectingExternalRoutesService: ConnectingExternalRoutesService,
    private signInService: SignInService
    ) { }
  ngOnInit(): void {
    console.log('TopDivComponent 🃏')
  }

  openCreateTimeLineDialog() {
    this.openModal.emit()
  }

  applyFilterText(event: TimeLineModel) {
    console.log('event event event event', event)
    this.toApplyFilterText.emit(event)
  }

  clearBarFilter() {
   this.clearBarFilterBar.emit() 
  }

}
