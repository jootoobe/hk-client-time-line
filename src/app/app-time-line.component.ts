import { Component, effect, OnInit, Renderer2 } from '@angular/core';

import { environment } from '../environments/environment';
import { TIMELINEKeysModel } from './models/cryptos/time-line-keys.model';
import { TimeLineKeysService } from './services/time-line-keys.service';
import { StateService } from './shared/services/state.service';
import { LocalStorageService } from './shared/services/storage/local-storage.service';
import { RedisAuthModel } from './spider-share/iam/models/auth/redis-auth.model';

@Component({
  selector: 'app-time-line', // Os seletores dos projetos devem esta identicos a seus microserviços
  templateUrl: './app-time-line.component.html',
  styleUrls: ['./app-time-line.component.scss']
})
export class AppTimeLineComponent implements OnInit {
  title = 'hk-client-time-line';
  styleSpiderShare = environment.styleSpiderShare
  TESTE: any
  envProd = environment.production
  letter: any
  itemStorageToken!: RedisAuthModel
  timeLineKeys!: TIMELINEKeysModel

  constructor(
    private renderer: Renderer2,
    private stateService: StateService,
    private localStorageService: LocalStorageService,
    private timeLineKeysService: TimeLineKeysService
  ) {
    this.getIam2()

    effect(() => {
      this.timeLineKeys = this.stateService.keysCryptoTimeLineSignalComputed()
      if(this.timeLineKeys && this.timeLineKeys?.LS?.ss) {
        this.localStorageControlSession()
        console.log('QUANTAS VEZES')
      }

    })

    let styleCss = localStorage.getItem('ss') !== null ? localStorage.getItem('ss') : undefined
    const link = this.renderer.createElement('link');
    this.renderer.setAttribute(link, 'rel', 'stylesheet');
    this.renderer.setAttribute(link, 'href', `${this.styleSpiderShare}/styles-${styleCss}.css`);
    this.renderer.appendChild(document.head, link);
    console.log(`${this.styleSpiderShare}/styles-${styleCss}.css`)
    // http://localhost:4200/styles-CUIQ32FR.css

    effect(() => {
      this.TESTE = this.stateService.languageSignalComputed()
      console.log('TIME-LINE', this.TESTE)
    })
  }
  ngOnInit(): void {
    console.log('AppTimeLineComponent')
    this.letter = localStorage.getItem('al') !== null ? localStorage.getItem('al') : undefined

    if (this.letter) {
      this.letter = this.letter.charAt(0);
    }
  }

  localStorageControlSession() {
    this.itemStorageToken = this.localStorageService.getLocalStorag(this.letter, this.timeLineKeys?.LS?.ss)
    console.log('TIME-LINE 🌜', this.itemStorageToken)
    console.log('TIME-LINE 🌜', this.timeLineKeys?.LS?.ss)

    if (this.itemStorageToken && this.itemStorageToken.email) {
      this.stateService.updateRedisAuth(this.itemStorageToken)
    }
  }


  getIam2() {
    this.timeLineKeysService.getIam2()
      .subscribe({
        next: (res: any) => {
          let encode1 = decodeURIComponent(`${res.a}`); // enconde 1
          let encode2: any = decodeURIComponent(`${encode1}`); // enconde 2
          encode2 = JSON.parse(encode2)
          console.log('sssssssss', encode2)
          this.stateService.updateKeysCryptoTimeLineSignal(encode2.TLC)
        },
        error: (err) => {

        },
        complete: () => { }
      })
  }
}
