import { Component, effect, Inject, isDevMode, OnInit, Renderer2 } from '@angular/core';

import { environment } from '../environments/environment';
import { TIMELINEKeysModel } from './models/cryptos/time-line-keys.model';
import { TimeLineKeysService } from './services/time-line-keys.service';
import { StateService } from './shared/services/state.service';
import { LocalStorageService } from './shared/services/storage/local-storage.service';
import { RedisAuthModel } from './spider-share/iam/models/auth/redis-auth.model';
import { CookieService } from './shared/services/cookies/cookie.service';
import { WINDOW } from './shared/services/window.service';
import { ConnectingExternalRoutesService } from './shared/services/connecting-external-routes/connecting-external-routes.service';
import { ToastrService } from 'ngx-toastr';

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
  TOAST:any
  constructor(
    private renderer: Renderer2,
    private stateService: StateService,
    private localStorageService: LocalStorageService,
    private timeLineKeysService: TimeLineKeysService,
    private connectingExternalRoutesService: ConnectingExternalRoutesService,
    private cookieService: CookieService,
    private toastrService: ToastrService,
    @Inject(WINDOW) private window: Window,
  ) {
    this.getIam2TimeLine()

    effect(() => {
      this.TOAST = this.stateService.toastSignalComputed()
    })

    effect(() => {
      this.timeLineKeys = this.stateService.keysCryptoTimeLineSignalComputed()
      if(this.timeLineKeys && this.timeLineKeys?.LS?.ss) {
        this.localStorageControlSession()
      }

    })

    let styleCss = localStorage.getItem('ss') !== null ? localStorage.getItem('ss') : undefined
    const link = this.renderer.createElement('link');
    this.renderer.setAttribute(link, 'rel', 'stylesheet');
    this.renderer.setAttribute(link, 'href', `${this.styleSpiderShare}/styles-${styleCss}.css`);
    this.renderer.appendChild(document.head, link);
    // http://localhost:4200/styles-CUIQ32FR.css

    effect(() => {
      this.TESTE = this.stateService.translatorLanguageSignalComputed()
    })
  }
  ngOnInit(): void {
    if (environment.production && this.window) {
      // window.console.log = function() {};
      // window.console.warn = function() {};
      // window.console.error = function() {};
    }
    

    this.letter = localStorage.getItem('al') !== null ? localStorage.getItem('al') : undefined

    if (this.letter) {
      this.letter = this.letter.charAt(0);
    }
  }

  localStorageControlSession() {
    // this.itemStorageToken = this.localStorageService.getLocalStorag(this.letter, this.IAMEncryptDecryptKey?.LS?.ss)
    let decryptedValue = this.cookieService.getEncryptedCookie(this.letter);
    this.itemStorageToken = this.cookieService.getEncryptedCookie('v1');
    if(decryptedValue) {
      this.itemStorageToken.irt_id = decryptedValue.irt_id
      this.itemStorageToken.iat = decryptedValue.iat
      this.itemStorageToken.irt = decryptedValue.irt
    }

    if (this.itemStorageToken && this.itemStorageToken.email) {
      this.stateService.updateRedisAuth(this.itemStorageToken)
    }
  }


  getIam2TimeLine() {
    this.timeLineKeysService.getIam2TimeLine()
      .subscribe({
        next: (res: any) => {
          let encode1 = decodeURIComponent(`${res.a}`); // enconde 1
          let encode2: any = decodeURIComponent(`${encode1}`); // enconde 2
          encode2 = JSON.parse(encode2)
          this.stateService.updateKeysCryptoTimeLineSignal(encode2.TLC)
        },
        error: (err) => {
          const routerHome = {
            router: '/home',
            message: ''
          };
          
          this.connectingExternalRoutesService.navigateHomeSpider(routerHome);
          this.connectingExternalRoutesService.spiderShareLoader({ message: false });

          this.toastrService.error(this.TOAST['KANBAN']['Global'].error['msn-0']['message-0'], this.TOAST['KANBAN']['Global'].error['msn-0']['message-1'])
        },
        complete: () => { }
      })
  }
}
