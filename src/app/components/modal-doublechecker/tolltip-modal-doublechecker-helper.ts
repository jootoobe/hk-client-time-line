import { Component, effect } from "@angular/core";
import { StateService } from "../../shared/services/state.service";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";


@Component({
  selector: 'tolltip-modal-doublechecker-helper', // remove word app- from microservices
  template: ``,
})
export class TolltipModalSoublecheckerHelper {

  TIME_LINE!: any; // translator used in ToastrService
  showWidth425!: boolean
  showWidth375!: boolean
  showWidth320!: boolean

  constructor(private stateService: StateService,
    public breakpointObserver: BreakpointObserver) {


    this.breakpointObserver
      .observe(['(max-width: 425px)', '(max-width: 375px)', '(max-width: 320px)'])
      .subscribe((state: BreakpointState) => {
        if (state.breakpoints['(max-width: 320px)']) {
          this.showWidth320 = true;
          this.showWidth375 = false;
          this.showWidth425 = false;
        } else if (state.breakpoints['(max-width: 375px)']) {
          this.showWidth320 = false;
          this.showWidth375 = true;
          this.showWidth425 = false;
        } else if (state.breakpoints['(max-width: 425px)']) {
          this.showWidth320 = false;
          this.showWidth375 = false;
          this.showWidth425 = true;
        } else {
          this.showWidth320 = false;
          this.showWidth375 = false;
          this.showWidth425 = false;
        }
      });

    effect(() => {
      this.TIME_LINE = this.stateService.translatorLanguageSignalComputed()
    })
  }


  // Alimenta o ToolTip {{'TIME-LINE.CREATE-FLAG.modal.title-h1' | translate}}
  help1() {
    let msn1_a: string = this.TIME_LINE['TOLLTIP-HTML-MSN']['ModalDoubleCheckerComponent']['help1-a']
    let msn1_b: string = this.TIME_LINE['TOLLTIP-HTML-MSN']['ModalDoubleCheckerComponent']['help1-b']
    let msn1_c: string = this.TIME_LINE['TOLLTIP-HTML-MSN']['ModalDoubleCheckerComponent']['help1-c']

    let img1_a: string = this.TIME_LINE['TOLLTIP-HTML-MSN']['ModalDoubleCheckerComponent']['help1-img1-a']
    // Log após a atualização dos breakpoints
    console.log('Show Width 425:', this.showWidth425);
    console.log('Show Width 375:', this.showWidth375);
    console.log('Show Width 320:', this.showWidth320);

    if (this.showWidth425) {
      return `

      <div style='margin-left: .5rem;  max-width: 30rem;'>
        <p style='margin-top: 1rem;'><span style='margin-left: .2rem;'>${msn1_a}</span> </p>
        <p style='margin-top: 1rem;'><span style='margin-left: .2rem;'>${msn1_b}</span>  </p>
        <p style='margin-top: 1rem;'><span style='margin-left: .2rem;'>${msn1_c}</span></p>
      </div>
      <p style='margin: 1rem;  max-width: 30rem;'>
      <img  style="height: auto;width:100%"  src="${img1_a}" alt='SpiderShare' />
      </p>
      `
    } else if (this.showWidth375) {
      return `

      <div style='margin-left: .5rem;  max-width: 28rem;'>
        <p style='margin-top: 1rem;'><span style='margin-left: .2rem;'>${msn1_a}</span> </p>
        <p style='margin-top: 1rem;'><span style='margin-left: .2rem;'>${msn1_b}</span>  </p>
        <p style='margin-top: 1rem;'><span style='margin-left: .2rem;'>${msn1_c}</span></p>
      </div>
      <p style='margin: 1rem; max-width: 28rem;'>
      <img  style="height: auto;width:100%"  src="${img1_a}" alt='SpiderShare' />
      </p>
      `
    } else if (this.showWidth320) {
      return `

      <div style='margin-left: .5rem;  max-width: 26rem;'>
        <p style='margin-top: 1rem;'><span style='margin-left: .2rem;'>${msn1_a}</span> </p>
        <p style='margin-top: 1rem;'><span style='margin-left: .2rem;'>${msn1_b}</span>  </p>
        <p style='margin-top: 1rem;'><span style='margin-left: .2rem;'>${msn1_c}</span></p>
      </div>
      <p style='margin: 1rem; max-width: 26rem;'>
      <img  style="height: auto;width:100%"  src="${img1_a}" alt='SpiderShare' />
      </p>
      `
    } else {
      return `

      <div style='margin-left: .5rem;  max-width: 35rem;'>
        <p style='margin-top: 1rem;'><span style='margin-left: .2rem;'>${msn1_a}</span> </p>
        <p style='margin-top: 1rem;'><span style='margin-left: .2rem;'>${msn1_b}</span>  </p>
        <p style='margin-top: 1rem;'><span style='margin-left: .2rem;'>${msn1_c}</span></p>
      </div>
      <p style='margin: 1rem; max-width: 35rem;'>
      <img  style="height: auto;width:100%"  src="${img1_a}" alt='SpiderShare' />
      </p>
      `
    }
  }
}
