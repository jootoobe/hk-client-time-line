import { Component, OnInit, output } from '@angular/core';

// import { ConnectingExternalRoutesService } from '../../../../../shared/connecting-external-routes/connecting-external-routes.service';
import { SignInService } from '../../../../../spider-share/iam/services/auth/sign-in.service';

@Component({
  selector: 'top-div',
  templateUrl: './top-div.component.html',
  styleUrl: './top-div.component.scss',
  providers:[SignInService]

})
export class TopDivComponent implements OnInit {

  openModal = output()

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
}
