import { Directive, ElementRef, HostListener, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appDragScroll]',
})
export class DragScrollDirective {
  constructor(private el: ElementRef, private viewContainer: ViewContainerRef) { }

  mouseDown = false;
  startX: any;
  scrollLeft: any;

  @HostListener('mousedown', ['$event'])
  startDragging(e: any) {
    const el = this.el.nativeElement;
    this.mouseDown = true;
    this.startX = e.pageX - el.offsetLeft;
    this.scrollLeft = el.scrollLeft;
  }

  @HostListener('mouseup', ['$event'])
  @HostListener('mouseleave', ['$event'])
  stopDragging(e: any) {
    this.mouseDown = false;
    // reset style after dragging
    const el = this.el.nativeElement;
    // el.style.overflowX = 'hidden';
    el.style.transform = 'translateZ(0rem);';
    el.style.opacity = '1';
  }

  @HostListener('mousemove', ['$event'])
  moveEvent(e: any) {
    const el = this.el.nativeElement;
    e.preventDefault();
    if (!this.mouseDown) {
      return;
    }
    const x = e.pageX - el.offsetLeft;
    const scroll = x - this.startX;
    el.scrollLeft = this.scrollLeft - scroll * 3;
    // change style while dragging
    // el.style.overflowX = 'scroll';
    // el.style.opacity = '0.5';
  }

  @HostListener('mousewheel', ['$event'])
  moveWheel(e: any) {
    const scrollContainer = this.el.nativeElement;
    // const el = this.el.nativeElement;
    if (scrollContainer.id === 'moveWheelId') {
      e.preventDefault();
      scrollContainer.scrollLeft += e.deltaY;
    }
  }

  @HostListener('window:click', ['$event.target'])
  onClick(targetElement: any) {
    const el = this.el.nativeElement;
    if (targetElement.id === 'close') {
      el.style.overflowX = 'hidden';
    } else if (targetElement.id === 'open') {
      el.style.overflowX = 'visible';
    }
  }


  @HostListener('DOMMouseScroll', ['$event'])
  fireFoxBrowser(e: any) {
    const fireFoxScroll = this.el.nativeElement;
    // var delta = e.wheelDelta ? e.wheelDelta/40 : e.detail ? -e.detail/3 : 0;

    // const el = this.el.nativeElement;
    if (fireFoxScroll.id === 'moveWheelId') {
      // e.preventDefault();
      fireFoxScroll.scrollLeft += (e.detail * 50);
    }
  }



}

// notes : https://stackblitz.com/edit/angular-ivy-eydock?file=src%2Fapp%2Fapp.component.ts
// https://medium.com/claritydesignsystem/four-ways-of-listening-to-dom-events-in-angular-part-2-hostlistener-1b66d45b3e3d

// const mousedown$ = fromEvent(document, 'mousedown');
// const mousemove$ = fromEvent(document, 'mousemove');
// const mouseup$ = fromEvent(document, 'mouseup');

// let mouseDown = false;
// let startX, scrollLeft;


// const scrollContainer = this.scrollContainer.nativeElement.querySelector("#sss");
// window.addEventListener("wheel", (evt: any) => {
//   if (scrollContainer.id === 'sss') {
//     evt.preventDefault();
//     scrollContainer.scrollLeft += evt.deltaY;
//   }
// });



// mousedown$.pipe(
//   exhaustMap(() => mousemove$.pipe(
//     map((e: any) => `x:${e.clientX}, y:${e.clientY}`),
//     takeUntil(mouseup$)
//   ))
// )
// .subscribe((res:any) => {
//   scrollContainer.scrollLeft = res.x
// });

// window.addEventListener("touchmove", (evt: any) => {
//   if (scrollContainer.id === 'sss') {
//     var currentTouch = evt.changedTouches[0];
//     if (scrollContainer) {
//       scrollContainer.scrollLeft += scrollContainer.clientY - currentTouch.clientY;
//     }
//     // scrollContainer = currentTouch;
//   }
// });


// @ViewChild('openClose', { static: true }) openClose!: ElementRef

// openCloseHorizontalScroll(val: string) {
//   const open = this.openClose.nativeElement.querySelector("#open");
//   const close = this.openClose.nativeElement.querySelector("#close");
//   open.style.fontSize = '1rem'
//   close.style.fontSize = '1rem'
//   if (val === 'open') {
//     // open.style.opacity = '0';
//     // close.style.opacity = '1';
//     open.style.display = 'none';
//     close.style.display = 'inline-table';
//   } else if (val === 'close') {
//     // open.style.opacity = '1';
//     // close.style.opacity = '0';
//     open.style.display = 'inline-table';
//     close.style.display = 'none';
//   }
// }


// <div class="time-line_year_line">
// <span *ngIf="first">
//   <span id="open" (click)="openCloseHorizontalScroll('open')">open</span>
//   <span id="close" (click)="openCloseHorizontalScroll('close')">close</span>
// </span>

// <div class="time-line_vertical_line">
//   <span class="time-line_year_months">Jan/1980</span>
// </div>
// </div>
