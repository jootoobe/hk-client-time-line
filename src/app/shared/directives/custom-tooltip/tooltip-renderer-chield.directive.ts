import { Directive,HostListener } from '@angular/core';
import { StateService } from '../../services/state.service';

@Directive({
  selector: '[customToolTipChiel]'
})
export class ToolTipRendererChieldDirective {


  constructor(private stateService: StateService) { }


  @HostListener('mouseenter', ['$event'])
  showChiel(e:any) {
    this.stateService.toolTipSubject({ mouse: 'mouseenter', from: 'customToolTipChield' })
  }

  @HostListener('mouseleave', ['$event'])
  hideChiel(e: any) {
    this.stateService.toolTipSubject({ mouse: 'mouseleave', from: 'customToolTipChield' })

  }
}
