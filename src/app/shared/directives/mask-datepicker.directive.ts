import { Directive, ElementRef, HostListener, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';


@Directive({
  selector: '[appMaskDate]'
})
export class MaskDateDirective implements OnInit {
  @Input() appMaskValue: any;
  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2
  ) { }
  ngOnInit(): void { }
  @HostListener('window:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
      if (this.appMaskValue && (this.appMaskValue.length === 2 || this.appMaskValue.length === 5) && event.key !== 'Backspace') {
        this.renderer.setProperty(this.elRef.nativeElement, 'value', this.appMaskValue + '/');
      }
    }


  // @HostListener('input', ['$event'])
  // onInputChange(event: KeyboardEvent) {



  //   if (event.keyCode >= 48 && event.keyCode <= 57) {
  //     if (this.appMaskValue && (this.appMaskValue.length === 2 || this.appMaskValue.length === 5) && event.key !== 'Backspace') {
  //       this.renderer.setProperty(this.elRef.nativeElement, 'value', this.appMaskValue + '/');
  //     }
  //   }
  //   // const input = event.target as HTMLInputElement;
  //   // const inputValue = input.value;
  //   // input.value = inputValue.replace(/[^0-9]/g, '');
  // }
}
