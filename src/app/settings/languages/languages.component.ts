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
    this.stateService.updateLanguageSignal(translate.store.defaultLang)

  }


  ngOnInit(): void {
    this.getLeng()
    this.updateTranslate()
  }


  getLeng() {
    //'TIME-LINE'
    this.translate.get('TIME-LINE').subscribe((value) => {
      if (value) {
        this.stateService.updateTranslatorLanguageSignal(value)
      }
    });


    //'TOAST'
    this.translate.get('TOAST').subscribe((value) => {
      if (value) {
        this.stateService.updateToastSignal(value)
      }
    });


  }


  updateTranslate() {

    // # Recebe a alteração da tradução enviada pela aplicação spider-sahre
    fromEvent(this.window, 'translator-changes')
      .subscribe({
        next: (res: any) => {
          console.log('# Recebe a alteração da tradução enviada pela aplicação spider-sahre', res.detail.message)
          this.translate.setDefaultLang(res.detail.message)
          //'LENG' pt, es, en
          this.stateService.updateLanguageSignal(res.detail.message)

          setTimeout(()=>{
            this.getLeng()
          },500)
        },
        error: (err) => { },
        complete: () => { }
      })

  }




}


