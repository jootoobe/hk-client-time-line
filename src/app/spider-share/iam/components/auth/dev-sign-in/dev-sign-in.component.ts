import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '../../../../../../environments/environment';
import { SignInService } from '../../../services/auth/sign-in.service';

@Component({
  selector: 'dev-sign-in',
  templateUrl: './dev-sign-in.component.html',
  styleUrls: ['./dev-sign-in.component.scss'],
  providers:[SignInService]
})
export class DevSignInComponent {
  title = 'time-line';
  loginDev = true
  envProd = environment.production
  count = 0

  constructor(private signInService: SignInService, private router: Router) {}


  devSgnIn(email: any, password: any) {
    let val = { email, password }
    this.signInService.devSignIn(val)
      .subscribe({
        next: (res) => {
          this.loginDev = false
          // this.signInService.loginJustForDev({ loginDev: false, buttonClicked: false })
        },
        error: (err) => {
        },
        complete: () => {
          // define on request complete logic
          // 'complete' is not the same as 'finalize'!!
          // this logic will not be executed if error is fired
          this.router.navigate(['/time-line/spider'])
        }
      })
  }



}
