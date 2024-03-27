import { Component, EventEmitter, Inject, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
// import { fromEvent } from 'src/app/shared/services/state.service';
import { fromEvent } from 'rxjs';

import { StateService } from '../../shared/services/state.service';
import { WINDOW } from '../../shared/services/window.service';

@Component({
  selector: 'languages-timeline',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.css']
})
export class LanguagesTimeLineComponent implements OnInit {
  languageStart: any;
  @Output() settingLanguage = new EventEmitter();
  constructor(
    public translate: TranslateService,
    private stateService: StateService,
    @Inject(WINDOW) private window: Window,
  ) {

    this.languageStart = localStorage.getItem('leng') !== null ? localStorage.getItem('leng') : JSON.stringify('pt')
    this.languageStart = JSON.parse(this.languageStart)
    console.log('languageStart', this.languageStart)
    translate.addLangs(['pt', 'en', 'es'])
    translate.setDefaultLang(`${this.languageStart}`)
    // this.stateService.updateLanguageSignal(translate.store.defaultLang)

  }


  ngOnInit(): void {
    this.translate.get('TIME-LINE').subscribe((value) => {
      // localStorage.setItem('toast', JSON.stringify(value))
      // this.stateService.toastTs(value)
      if (value) {
        // console.log('TIME-LINE', value)
        this.stateService.updateLanguageSignal(value)
      }
    });

    // // Recebe a alteação da lingua vinda do Hk-pro-client-spidershare
    // fromEvent(this.window, 'language-translate')
    //   .subscribe({
    //     next: (res: any) => {
    //       this.translate.setDefaultLang(res.detail)
    //       this.settingLanguage.emit(res.detail)
    //     },
    //     error: (err) => { },
    //     complete: () => { }
    //   })
  }




}


