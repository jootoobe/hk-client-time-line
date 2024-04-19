import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unique',
  pure: true
})
export class UniquePipe implements PipeTransform {
  transform(items: any[]): any {
    const uniqueArr:any = [];
    const monthCode = items.map((value) => value.year);
    items.map((value, index) => {
      if(monthCode.indexOf(value.year) !== index) {
        // we don't don't need 'Title' in case it is duplicate
        delete value.year
        // value.year = ''
        uniqueArr.push(value)
        // console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
      } else {
        uniqueArr.push(value)
      }
    })
    return uniqueArr;
  }
}
