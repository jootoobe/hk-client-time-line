import { computed, Inject, signal, WritableSignal } from '@angular/core';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { RedisAuthModel } from '../../spider-share/iam/models/auth/redis-auth.model';
import { WINDOW } from './window.service';
import { TIMELINEKeysModel } from '../../models/cryptos/time-line-keys.model';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  //just take the acronyms en, pt, es from the translator
  private languageSignal: WritableSignal<string> = signal<string>('');
  languageSignalComputed = computed(() => {
    return this.languageSignal()
  });


  // private toastSignal: WritableSignal<{}> = signal<any>(undefined);
  // toastSignalComputed = computed(() => {
  //   return this.toastSignal()
  // });

  // Vai no header da aplicação
  private redisAuthSubject = new BehaviorSubject<RedisAuthModel>(RedisAuthModel as any);
  redisAuthSubject$ = this.redisAuthSubject.asObservable();


  private keysCryptoTimeLineSignal: WritableSignal<TIMELINEKeysModel> = signal<TIMELINEKeysModel>(TIMELINEKeysModel as any);
  keysCryptoTimeLineSignalComputed = computed(() => {
    return this.keysCryptoTimeLineSignal()
  });



  private customToolTipSubject = new BehaviorSubject<{}>({ mouse: '', from: '' });
  customToolTipSubject$ = this.customToolTipSubject.asObservable();



  constructor(@Inject(WINDOW) private window: Window) { }

  updateLanguageSignal(val: string) {
    return this.languageSignal.set(val)
  }

  // updateToastSignal(val: any) {
  //   return this.toastSignal.set(val)
  // }


  // Relacionado as chaves de cryptografia
  updateKeysCryptoTimeLineSignal(val: TIMELINEKeysModel) {
    return this.keysCryptoTimeLineSignal.set(val)
  }

  updateRedisAuth(val: RedisAuthModel) {
    return this.redisAuthSubject.next(val)
  }


  /**
* toolTipSubject is used in the directive ToolTipRendererChieldDirective
* @param { CustomToolTipComponent} fom CustomToolTipComponent
* @param { ToolTipRendererChieldDirective} fom ToolTipRendererChieldDirective
*/
  toolTipSubject(val: any) {
    this.customToolTipSubject.next(val)
  }





  /**
  * generate groups of 4 random characters
  * @example getUniqueId(1) : 607f
  * @example getUniqueId(2) : 95ca-361a
  * @example getUniqueId(4) : 6a22-a5e6-3489-896b
  */
  getUniqueId(parts: number): string {
    const stringArr = [];
    for (let i = 0; i < parts; i++) {
      // tslint:disable-next-line:no-bitwise
      const S4 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      stringArr.push(S4);
    }
    return stringArr.join('-');
  }



}


