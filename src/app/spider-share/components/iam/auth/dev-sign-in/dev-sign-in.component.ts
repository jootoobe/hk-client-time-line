import { environment } from '../../../../../../environments/environment';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'dev-sign-in',
  templateUrl: './dev-sign-in.component.html',
  styleUrls: ['./dev-sign-in.component.scss']
})
export class DevSignInComponent {
  envProd = environment.production

  constructor( ) { }


}
