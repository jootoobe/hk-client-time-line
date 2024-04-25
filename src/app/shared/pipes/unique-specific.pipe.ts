import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uniqueSpecific',
  pure: true
})
export class UniqueSpecificPipe implements PipeTransform {
  transform(items: any[], term?: any): any {

    let uniqueArr: any = [];
    let allCode = items.map((value) => value['flag_design'][term]);
    console.log('111111111111111111',allCode)
    items.map((value, index) => {
      if (allCode.indexOf(value['flag_design'][term]) !== index) {
        //   // we don't don't need 'Title' in case it is duplicate
        // value.flag_design.color_hex = undefined
        value.flag_design.color_hex = 'undefined'
        // console.log(allCode)
        console.log(value)
        uniqueArr.push(value)
      } else {
        uniqueArr.push(value)
      }
    })


    return uniqueArr;
  }
}
