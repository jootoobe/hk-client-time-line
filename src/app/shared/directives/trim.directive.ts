import { Directive, Input, HostListener, Optional, Renderer2, ElementRef } from '@angular/core';
import { NgControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

// https://stackblitz.com/edit/ng-trim-ngmodel?file=src%2Fapp%2Ftrim.directive.ts
// home_name: this.freela['portfolio_one']['home_name'].replace(/ +(?= )/g, '').trim().charAt(0) +
// this.freela['portfolio_one']['home_name'].replace(/ +(?= )/g, '').trim().substr(1),

@Directive({
  selector: '[appTrim]'
})
export class TrimDirective {
  // @Input() formAppTrim!: any
  @Input() formAll!: any
  @Input() nameFormAll!: any;
  @Input() numInputAppTrim: number = 0
  @Input() valAppTrim!: string // passar valor quando não for FormControl
  constructor(
    @Optional() private ngControl: NgControl,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private toastrService: ToastrService) { }

  @HostListener('blur')
  onBlur(): void {

    // let valueTrim = (this.ngControl?.control?.value).replace(/ +(?= )/g, '').trim() // remove space without enter
    // Remove newlines only from the end of the line: String.replaceAll("[\n\r]$", "")
    // Remove newlines only from the beginning of the line: String.replaceAll("^[\n\r]", "")
    let capitalize = /(\b[a-z](?!\s))/g;
    let valueTrim: any;

    if (this.ngControl && this.ngControl?.control?.value) {
      // valueTrim = (this.ngControl?.control?.value.replace(/[\n\r]/g, ' ')).replace(/ +(?= )/g, '').trim();
      valueTrim = this.ngControl?.control?.value.replace(/ +(?= )/g, '').trim();
      this.ngControl?.control?.setValue(valueTrim)
    } else if (!this.ngControl) {
      valueTrim = (this.valAppTrim).replace(/ +(?= )/g, '').trim()
    }


    // 🅰️ capitalize with ngControl
    if (this.ngControl && this.ngControl?.control?.value && this.numInputAppTrim === 1) {
      valueTrim = valueTrim.toLowerCase();
      valueTrim = valueTrim.replace(capitalize, (x: any) => { return x.toUpperCase(); });
      // this.renderer.setProperty(this.elementRef.nativeElement, 'value', valueTrim);
      this.formAll['controls'][this.nameFormAll].setValue(valueTrim);
      // return valueTrim
    }


    // 🅿️ capitalize without ngControl
    if (!this.ngControl && this.numInputAppTrim === 1) {
      valueTrim = valueTrim.toLowerCase();
      valueTrim = valueTrim.replace(capitalize, (x: any) => { return x.toUpperCase(); });
      this.renderer.setProperty(this.elementRef.nativeElement, 'value', valueTrim);
    }



    // 🅰️ JUST toLowerCase with ngControl
    if (this.ngControl && this.ngControl?.control?.value && this.numInputAppTrim === 2) {
      valueTrim = valueTrim.toLowerCase();
      // this.renderer.setProperty(this.elementRef.nativeElement, 'value', valueTrim);
      this.formAll['controls'][this.nameFormAll].setValue(valueTrim);
    }


    // 🅿️ JUST toLowerCase without ngControl
    if (!this.ngControl && this.numInputAppTrim === 2) {
      valueTrim = valueTrim.toLowerCase();
      // this.renderer.setProperty(this.elementRef.nativeElement, 'value', valueTrim);
      this.formAll['controls'][this.nameFormAll].setValue(valueTrim);
    }



    // 🅰️ JUST remove all space
    if (this.ngControl && this.ngControl?.control?.value && this.numInputAppTrim === 3) {
      valueTrim = valueTrim.replace(/\s/g, '');
      // this.renderer.setProperty(this.elementRef.nativeElement, 'value', valueTrim);
      this.formAll['controls'][this.nameFormAll].setValue(valueTrim);
    }


    // 🅿️ JUST remove all space
    if (!this.ngControl && this.numInputAppTrim === 3) {
      valueTrim = valueTrim.replace(/\s/g, '');
      this.renderer.setProperty(this.elementRef.nativeElement, 'value', valueTrim);
    }



    // 🅰️ JUST remove space at the end
    if (this.ngControl && this.ngControl?.control?.value && this.numInputAppTrim === 4) {
      valueTrim = valueTrim.trim();
      // this.renderer.setProperty(this.elementRef.nativeElement, 'value', valueTrim);
      this.formAll['controls'][this.nameFormAll].setValue(valueTrim);
    }


    // 🅿️ UST remove space at the end
    if (!this.ngControl && this.numInputAppTrim === 4) {
      valueTrim = valueTrim.trim();
      this.renderer.setProperty(this.elementRef.nativeElement, 'value', valueTrim);
    }



    // 🅰️ JUST remove space for text-area
    if (this.ngControl && this.ngControl?.control?.value && this.numInputAppTrim === 5) {
      valueTrim = valueTrim.replace(/[\n\r]/g, ' ').replace(/ +(?= )/g, '').trim();
      // this.renderer.setProperty(this.elementRef.nativeElement, 'value', valueTrim);
      this.formAll['controls'][this.nameFormAll].setValue(valueTrim);
    }


    // 🅿️ JUST remove space for text-area
    if (!this.ngControl && this.numInputAppTrim === 5) {
      valueTrim = valueTrim.replace(/[\n\r]/g, ' ').replace(/ +(?= )/g, '').trim();
      this.renderer.setProperty(this.elementRef.nativeElement, 'value', valueTrim);
    }

  }









  // onBlur(): void {
  //   // this.formAll['controls'][this.name].setValue('aaa');

  //   let valueTrim = (this.formAll.get(this.nameAll).value).replace(/ +(?= )/g, '').trim();

  //   // value = value.toLowerCase().replace(/ +(?= )/g, '').trim().replace(/^(.)|\s+(.)/g, (c:any) => c.toUpperCase());
  //   // let capitalize = /(\b[a-z](?!\s))/g;

  //   // let value2 = this.formAll['controls'][this.nameAll]['value'];
  //   // value2 = value2.replace(/\s/g, '').trim() //remove withe space

  //   if (this.numInputAll === 1) {
  //     this.formAll['controls']['title'].setValue(valueTrim)
  //   }



  //   // if (this.numInputAll === 11) { // toLowerCase email
  //   //   value = value.toLowerCase();
  //   //   this.formAll['controls'][this.nameAll].setValue(value);
  //   //   return;
  //   // } else if (this.numInputAll === 12) { // Capitalize and remove withe space
  //   //   this.formAll['controls'][this.nameAll].setValue(value);
  //   //   return;
  //   // } else if (this.numInputAll === 14) { //remove withe space
  //   //   this.formAll['controls'][this.nameAll].setValue(value2);
  //   //   return;
  //   // }

  //   // if (this.numInputAll <= 10) { // capitalize
  //   //   if (value) {
  //   //     value = value.toLowerCase();
  //   //     value = value.replace(capitalize, (x) => { return x.toUpperCase(); });
  //   //     // this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
  //   //     // this.renderer.setAttribute(this.elementRef.nativeElement, 'value', value);
  //   //     this.formAll['controls'][this.nameAll].setValue(value);
  //   //   } else {
  //   //     // this.renderer.setProperty(this.elementRef.nativeElement, 'value', null);
  //   //     // this.renderer.setAttribute(this.elementRef.nativeElement, 'value', null);
  //   //     this.formAll['controls'][this.nameAll].setValue('');
  //   //   }
  //   // }

  //   // if (this.numInputAll <= 10) { // Primeira letra maiusculo, o resto minusculo
  //   //   if (value) {
  //   //     value = value.charAt(0).toUpperCase() + value.toLowerCase().slice(1);
  //   //     this.formAll['controls'][this.nameAll].setValue(value);
  //   //   } else {
  //   //     this.formAll['controls'][this.nameAll].setValue('');
  //   //   }
  //   // }
  // }
}










// import { Directive, Input, ElementRef, HostListener, Renderer2 } from '@angular/core';

// // https://stackblitz.com/edit/ng-trim-ngmodel?file=src%2Fapp%2Ftrim.directive.ts
// // home_name: this.freela['portfolio_one']['home_name'].replace(/ +(?= )/g, '').trim().charAt(0) +
// // this.freela['portfolio_one']['home_name'].replace(/ +(?= )/g, '').trim().substr(1),

// @Directive({
//   selector: '[appTrim]'
// })
// export class TrimDirective {
//   @Input() formAll!: any;
//   @Input() nameAll!: any;
//   @Input() numInputAll: number = 0;
//   constructor(
//     // private renderer: Renderer2,
//     // private elementRef: ElementRef,
//     // private ngModel: NgModel
//   ) { }

//   @HostListener('blur')
//   onBlur(): void {
//     // this.formAll['controls'][this.name].setValue('aaa');

//     let value = this.formAll['controls'][this.nameAll]['value'];
//     value = value.toLowerCase().replace(/ +(?= )/g, '').trim().replace(/^(.)|\s+(.)/g, (c:any) => c.toUpperCase());
//     // let capitalize = /(\b[a-z](?!\s))/g;

//     let value2 = this.formAll['controls'][this.nameAll]['value'];
//     value2 = value2.replace(/\s/g, '').trim() //remove withe space

//     if (this.numInputAll === 11) { // toLowerCase email
//       value = value.toLowerCase();
//       this.formAll['controls'][this.nameAll].setValue(value);
//       return;
//     } else if (this.numInputAll === 12) { // Capitalize and remove withe space
//       this.formAll['controls'][this.nameAll].setValue(value);
//       return;
//     } else if (this.numInputAll === 14) { //remove withe space
//       this.formAll['controls'][this.nameAll].setValue(value2);
//       return;
//     }

//     // if (this.numInputAll <= 10) { // capitalize
//     //   if (value) {
//     //     value = value.toLowerCase();
//     //     value = value.replace(capitalize, (x) => { return x.toUpperCase(); });
//     //     // this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
//     //     // this.renderer.setAttribute(this.elementRef.nativeElement, 'value', value);
//     //     this.formAll['controls'][this.nameAll].setValue(value);
//     //   } else {
//     //     // this.renderer.setProperty(this.elementRef.nativeElement, 'value', null);
//     //     // this.renderer.setAttribute(this.elementRef.nativeElement, 'value', null);
//     //     this.formAll['controls'][this.nameAll].setValue('');
//     //   }
//     // }

//     if (this.numInputAll <= 10) { // First letter uppercase, rest lowercase
//       if (value) {
//         value = value.charAt(0).toUpperCase() + value.toLowerCase().slice(1);
//         this.formAll['controls'][this.nameAll].setValue(value);
//       } else {
//         this.formAll['controls'][this.nameAll].setValue('');
//       }
//     }
//   }
// }
