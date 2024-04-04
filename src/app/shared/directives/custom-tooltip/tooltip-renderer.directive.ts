import { Directive, Input, TemplateRef, ElementRef, OnInit, HostListener, ComponentRef, OnDestroy } from '@angular/core';
import { Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { StateService } from '../../services/state.service';
import { Subscription } from 'rxjs';
import { CustomToolTipComponent } from '../../../components/custom-tool-tip/custom-tool-tip.component';


/**
 * ******************************************************** Custom ToolTip ****************************************************************
 *                        It was created to be able to add html tags inside json, mainly because of the translator
 *  "TOOL-TIPS": {
      "help-input": {
        "help-input-01": "<p style='color: red;'>Medical Aid : R3500</p><p>Loyalty : R299</p><p>GAP: R350</p>",
        "help-input-02": ""
      }
  }
  * * * * * ==================================================================================================================== * * * * *
    * @param { FROM } youtube -  https://www.youtube.com/watch?v=fe062UdOKuo
    *
    * @param { createTooltip } this.overlayRef - flexibleConnectedTo function, this refers to the start, end and center of that element. originY: this will be 'top', 'bottom' or 'center'. This refers to the top, bottom or center of the element passed in
    * @param { @HostListener('mouseenter', ['$event']) } show - the tolltip is loaded inside the CustomToolTipComponent component -- this.overlayRef.attach(new ComponentPortal(CustomToolTipComponent))
    *
    * we have 02 @HostListener (ToolTipRendererDirectivethe - parent and ToolTipRendererChieldDirective - chield) - so it is possible to keep the message active when the mouse is over the child
    *
    * @param { customToolTipSubject$ } important_to_identify_if_the_mouse_is_on_the_parent_or_the_child -  when it is on the son, msn is active
    * @param { clearTimeout(this.active) } clear_time_out - keep help keep msn active under son
    * @param { navigator.userAgent } identifies_whether_it_is_mobile_or_browser -  serve para tirar o setTimeout no sistema mobile - on cell phones, tolltip works with click.... the time out was causing a bug
    * @param { Git } help_in_setting_the_position_of_the_tolltip-top-left.... - https://github.com/Gabriel10Velloso/tooltip-cdk/blob/main/src/app/tooltip/tooltip-overlay/tooltip.directive.ts
*/

@Directive({
  selector: '[customToolTip]'
})
export class ToolTipRendererDirective implements OnDestroy {

  @Input() showToolTip: boolean = true
  @Input('customToolTip') text!: string
  // @Input() contentTemplate!: TemplateRef<Element>
  @Input() contentTemplate!: any

  @Input() originX: any
  @Input() originY: any
  @Input() overlayX: any
  @Input() overlayY: any
  @Input() offsetY: any
  private tooltipRef!: ComponentRef<CustomToolTipComponent>
  private overlayRef!: OverlayRef;

  active: any = null; // reset clearTimeout(this.active);
  customToolTipSubject = {}
  unsubscribe!: Subscription;
  toolTipParentDisable = false // helps to keeps the tooltip active when the mouse is over msn

  constructor(private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilder,
    private elementRef: ElementRef,
    private stateService: StateService) {

    this.unsubscribe = this.stateService.customToolTipSubject$
      .subscribe({
        next: (res: any) => {
          if (this.overlayRef) {

            if (res.mouse === 'mouseleave' && res.from === 'customToolTipParent' && !this.toolTipParentDisable) {
              this.overlayRef.detach();

            }
            if (res.mouse === 'mouseenter' && res.from === 'customToolTipChield') {
              this.toolTipParentDisable = true
            }

            if (res.mouse === 'mouseleave' && res.from === 'customToolTipChield') {
              this.toolTipParentDisable = false
              this.overlayRef.detach();
            }
          }
        },
        error: (err) => {
          // console.log('Erro', err)
        },
        complete: () => {
          this.unsubscribe.unsubscribe()
        }
      })

  }

  ngOnDestroy() {
    this.unsubscribe.unsubscribe();
  }

  createTooltip() {
    let val: any = undefined
    this.tooltipRef = val
    // this.overlayRef = val

    if (!this.showToolTip) {
      return;
    }
    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withPositions([{
        originX: this.originX,
        originY: this.originY,
        overlayX: this.overlayX,
        overlayY: this.overlayY,
        offsetY: this.offsetY,
      }]);

    this.overlayRef = this.overlay.create({ positionStrategy });
  }


  @HostListener('mouseenter', ['$event'])
  show() {

    window.clearTimeout(this.active);
    this.active = null

    this.createTooltip()
    this.stateService.toolTipSubject({ mouse: 'mouseenter', from: 'customToolTipParent' })

    if (this.overlayRef && !this.overlayRef.hasAttached()) {

      this.tooltipRef = this.overlayRef.attach(new ComponentPortal(CustomToolTipComponent));
      this.tooltipRef.instance.text = this.text;
      this.tooltipRef.instance.contentTemplate = this.contentTemplate;
    }
  }

  @HostListener('mouseleave', ['$event'])
  hide(e: any) {

    // const hBelow = e.view.innerHeight - e.y;
    // const hAbove = e.view.innerHeight - hBelow;
    // let setTooltipBelow = hBelow > hAbove; // return true

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      // document.write("mobile device");
      // console.log('mobile device')
      return this.stateService.toolTipSubject({ mouse: 'mouseleave', from: 'customToolTipParent' })

    } else {
      // document.write("not mobile device");
      // console.log('not mobile device')
      this.active = setTimeout(() => {
        this.stateService.toolTipSubject({ mouse: 'mouseleave', from: 'customToolTipParent' })
      }, 50)
    }


  }

}

  // bot
  // check user agent for a possible bot
  // https://chat.openai.com/c/91112ea9-51d5-498e-bc1a-cdceade3988f
  // UserAgent
  // https://stackoverflow.com/questions/20084513/detect-search-crawlers-via-javascript
  // https://stackoverflow.com/questions/20084513/detect-search-crawlers-via-javascript
  // https://stackoverflow.com/questions/20084513/detect-search-crawlers-via-javascript


// https://github.com/Gabriel10Velloso/tooltip-cdk/blob/main/src/app/tooltip/tooltip-overlay/tooltip.directive.ts
//bottom
// new ConnectionPositionPair(
//   { originX: 'center', originY: 'bottom' },
//   { overlayX: 'center', overlayY: 'top' },
//   0,
//   10
// ),
// //top
// new ConnectionPositionPair(
//   { originX: 'center', originY: 'top' },
//   { overlayX: 'center', overlayY: 'bottom' },
//   0,
//   -10
// ),
// //left
// new ConnectionPositionPair(
//   { originX: 'start', originY: 'center' },
//   { overlayX: 'end', overlayY: 'center' },
//   -10,
//   0
// ),
// //right
// new ConnectionPositionPair(
//   { originX: 'end', originY: 'center' },
//   { overlayX: 'start', overlayY: 'center' },
//   10,
//   0
// ),
// ]);
