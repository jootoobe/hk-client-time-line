import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConvertColorService {
  documentIsAccessible: any;
  constructor() {}


  convertColor(val: string) {
    // HEXA
    let hex = ''
        hex = val

    let hexArray: any = ''
        hexArray = hex.split('');
        hexArray.splice(0, 1)


    let red: any = hexArray.splice(0, 2).join('')
    let green: any = hexArray.splice(0, 2).join('')
    let blue: any = hexArray.splice(0, 2).join('')
    // let opacity: any = 1

    // RGB
    let rgb:any = `${parseInt(red, 16)}, ${parseInt(green, 16)}, ${parseInt(blue, 16)}`
    // console.log(
    //   {
    //     r:parseInt(`${red}`, 16),
    //     g:parseInt(`${green}`, 16),
    //     b:parseInt(`${blue}`, 16),
    //   })


    // HSL COLOR
    // https://stackoverflow.com/questions/62390243/java-script-how-can-i-pull-the-hsl-value-when-a-colour-is-selected-from-input-t
    // Java Script: How can i pull the HSL value when a colour is selected from input type = 'color'?
    // https://stackoverflow.com/questions/62390243/java-script-how-can-i-pull-the-hsl-value-when-a-colour-is-selected-from-input-t
    // https://css-tricks.com/converting-color-spaces-in-javascript/

    let r = parseInt(`${red}`, 16) / 255;
    let g = parseInt(`${green}`, 16) / 255;
    let b = parseInt(`${blue}`, 16) / 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h: any, s, l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }

    }
    h /= 6;
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);


    let hsl = ''

    hsl = `${h}, ${s}%, 93%`

    if(Number(rgb.split(',')[0]) >= 210 && Number(rgb.split(',')[1]) <= 255 || Number(rgb.split(',')[0]) >= 210 && Number(rgb.split(',')[2]) <= 255) {
      hsl = `${h}, ${s}%, 97%`
    }

    if(Number(rgb.split(',')[1]) >= 220 && Number(rgb.split(',')[1]) <= 255 && Number(rgb.split(',')[2]) >= 220 && Number(rgb.split(',')[2]) <= 255) {
      hsl = '0, 0%, 98%'
      rgb = '220,220,220'
      hex = '#dcdcdc'
    }

    if(Number(rgb.split(',')[1]) >= 195 && Number(rgb.split(',')[1]) <= 219 && Number(rgb.split(',')[2]) >= 195 && Number(rgb.split(',')[2]) <= 219) {
      hsl = `${h}, ${s}%, 95%`
    }

    // let hsl = `${h}, ${s}, ${l}`
    return { hex, rgb, hsl }
  }

}
