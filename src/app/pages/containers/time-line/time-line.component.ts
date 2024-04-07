import { Component, Inject, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';


@Component({
  selector: 'time-line',
  templateUrl: './time-line.component.html',
  styleUrl: './time-line.component.scss'
})
export class TimeLineComponent implements OnInit {

  constructor(
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
  ) { }

  ngOnInit(): void {
    this.languagesLocale()
  }



  languagesLocale() {
    let languageStart: any = localStorage.getItem('leng') !== null ? localStorage.getItem('leng') : JSON.stringify('pt')
    this.getDateFormatString(`${JSON.parse(languageStart)}`)
  }

  // translator
  getDateFormatString(val: string): string {
    this._locale = val
    this._adapter.setLocale(`${this._locale}`);
    if (val === 'en') {
      return 'MM/DD/YYYY';
    } else if (val === 'pt' || val === 'pt-BR') {
      return 'DD/MM/YYYY';
    } else if (val === 'es') {
      return 'DD/MM/YYYY';
    }
    return '';
  }
}
