import { NativeDateAdapter } from '@angular/material/core';


/** Adapts the native JS Date for use with cdk-based components that work with dates. */
export class CustomDateAdapter extends NativeDateAdapter {

  override parse(value: any): Date | any {


    // If it is English format, return empty
    if (this.locale !== 'en') {
      if ((typeof value === 'string' && value.length > 6) && (value.indexOf('/') > -1)) {
        const str = value.split('/');

        const year = Number(str[2]);
        const month = Number(str[1]) - 1;
        const day = Number(str[0]);
        return new Date(year, month, day);
      }
      // seta a tada atual
      // return new Date();
    }

    //  const timestamp = typeof value === 'number' ? value : Date.parse(value);
    // return isNaN(timestamp) ? null : new Date(timestamp);
    return new Date(value);
  }

  // retirar quando for feito o merge da data por mmalerba
  override format(date: Date, displayFormat: Object): string {
    date = new Date(Date.UTC(
      date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(),
      date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
    displayFormat = Object.assign({}, displayFormat, { timeZone: 'utc' });


    const dtf = new Intl.DateTimeFormat(this.locale, displayFormat);
    return dtf.format(date).replace(/[\u200e\u200f]/g, '');
  }

}
