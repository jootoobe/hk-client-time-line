import { Component, effect } from "@angular/core";
import { StateService } from "../../shared/services/state.service";


@Component({
  selector: 'tolltip-modal-doublechecker-helper', // remove word app- from microservices
  template: ``,
})
export class TolltipModalSoublecheckerHelper {

  TIME_LINE!: any; // translator used in ToastrService

  constructor(private stateService: StateService) {
    effect(() => {
      this.TIME_LINE = this.stateService.translatorLanguageSignalComputed()
      console.log('TIME-LINE >>>>>>>>>>>>>>>>>>>>>.', this.TIME_LINE)
    })
  }


  // Alimenta o ToolTip {{'TIME-LINE.CREATE-FLAG.modal.title-h1' | translate}}
  help1() {
    let msn1_a: string = this.TIME_LINE['TOLLTIP-HTML-MSN']['ModalDoubleCheckerComponent']['help1-a']
    let msn1_b: string = this.TIME_LINE['TOLLTIP-HTML-MSN']['ModalDoubleCheckerComponent']['help1-b']
    let msn1_c: string = this.TIME_LINE['TOLLTIP-HTML-MSN']['ModalDoubleCheckerComponent']['help1-c']

    let img1_a: string = this.TIME_LINE['TOLLTIP-HTML-MSN']['ModalDoubleCheckerComponent']['help1-img1-a']
    return `

    <div style='margin-left: .5rem;  max-width: 35rem;'>
      <p style='margin-top: 1rem;'><span style='margin-left: .2rem;'>${msn1_a}</span> </p>
      <p style='margin-top: 1rem;'><span style='margin-left: .2rem;'>${msn1_b}</span>  </p>
      <p style='margin-top: 1rem;'><span style='margin-left: .2rem;'>${msn1_c}</span></p>
    </div>
    <p style='margin: 1rem;'>
    <img style="height: auto;width:35rem;"  src="${img1_a}" alt='SpiderShare' />
    </p>
    `
  }
}
