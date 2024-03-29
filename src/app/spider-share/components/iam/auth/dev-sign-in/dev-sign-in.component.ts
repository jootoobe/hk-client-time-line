import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'dev-sign-in',
  templateUrl: './dev-sign-in.component.html',
  styleUrls: ['./dev-sign-in.component.scss']
})
export class DevSignInComponent {
  title = 'time-line';
  loginDev = true
  envProd = environment.production
  count = 0

  constructor(

  ) {



  }


}
