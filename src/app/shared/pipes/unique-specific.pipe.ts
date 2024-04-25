import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uniqueSpecific',
  pure: true
})
export class UniqueSpecificPipe implements PipeTransform {
  transform(items: any[], term?: any): any {

    let uniqueArr: any = [];
    let allCode = items.map((value) => value['flag_design'][term]);
    items.map((value, index) => {
      if (allCode.indexOf(value['flag_design'][term]) !== index) {
        value.flag_design.color_hex = undefined
        delete value.flag_design.color_hex
        uniqueArr.push(value)
      } else {
        uniqueArr.push(value)
      }
    })


    return uniqueArr;
  }
}
