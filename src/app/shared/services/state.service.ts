import { computed, Inject, signal, WritableSignal } from '@angular/core';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { RedisAuthModel } from '../../spider-share/iam/models/auth/redis-auth.model';
import { WINDOW } from './window.service';
import { TIMELINEKeysModel } from '../../models/cryptos/time-line-keys.model';
import { TimeLineModel } from '../../models/time-line.model';
import { FlagModel } from '../../models/flag.model';
import { IFilterCheckActive } from '../../interfaces/filter-check-active.interface';
import { UserForAppModel } from '../../models/user-for-app/user-for-app.model';



@Injectable({
  providedIn: 'root'
})
export class StateService {

  //just take the acronyms en, pt, es from the translator
  private languageSignal: WritableSignal<string> = signal<string>('');
  languageSignalComputed = computed(() => {
    return this.languageSignal()
  });

  private translatorLanguageSignal: WritableSignal<any> = signal<any>({});
  translatorLanguageSignalComputed = computed(() => {
    return this.translatorLanguageSignal()
  });


  private toastSignal: WritableSignal<{}> = signal<any>(undefined);
  toastSignalComputed = computed(() => {
    return this.toastSignal()
  });

  // '0' não tem filtro ativo
  // '1' filtro barra ativo
  // '2' filtro texto ativo
  // '3' filtro color ativo
  private activeFilterSignal: WritableSignal<IFilterCheckActive> = signal<IFilterCheckActive>({});
  activeFilterSignalComputed = computed(() => {
    return this.activeFilterSignal()
  });

  // Serve para atualizar a página com a nova bandeira criada 
  // Manda um evento para o this.getTimeLineKanbanById() que depois chama o spider-tube
  private getTimeLineHttpSignal: WritableSignal<boolean> = signal<boolean>(false);
  getTimeLineHttpSignalSignalComputed = computed(() => {
    return this.getTimeLineHttpSignal()
  });

  // Parecido com o getTimeLineHttpSignal mas aqui server apenas para pegar do index a ultima versão quando a api der erro
  private timeLineIndexDbErrorSignalSignal: WritableSignal<boolean> = signal<boolean>(false);
  timeLineIndexDbErrorSignalSignalComputed = computed(() => {
    return this.timeLineIndexDbErrorSignalSignal()
  });


  // USER APP Usado para controlar níveis de acesso do último pagamento
  private userForAppSignal: WritableSignal<UserForAppModel> = signal<UserForAppModel>(UserForAppModel as any);
  userForAppSignalComputed = computed(() => {
    return this.userForAppSignal()
  });



  // Vai no header da aplicação
  private redisAuthSubject = new BehaviorSubject<RedisAuthModel>(RedisAuthModel as any);
  redisAuthSubject$ = this.redisAuthSubject.asObservable();


  // Relacionado as chaves de cryptografia
  private keysCryptoTimeLineSignal: WritableSignal<TIMELINEKeysModel> = signal<TIMELINEKeysModel>(TIMELINEKeysModel as any);
  keysCryptoTimeLineSignalComputed = computed(() => {
    return this.keysCryptoTimeLineSignal()
  });

  // usado para verifica se o filtro está ativo ou não
  // quando o filtro está ativo o menu de edição e deletar não poder aparecer 
  private checksFilterIsActiveSignal: WritableSignal<boolean> = signal<boolean>(false);
  checksFilterIsActiveSignalComputed = computed(() => {
    return this.checksFilterIsActiveSignal()
  });

  private customToolTipSubject = new BehaviorSubject<{}>({ mouse: '', from: '' });
  customToolTipSubject$ = this.customToolTipSubject.asObservable();


  private getAllTimeLineSubject = new BehaviorSubject<TimeLineModel>(TimeLineModel as any);
  getAllTimeLineSubject$ = this.getAllTimeLineSubject.asObservable();




  constructor(@Inject(WINDOW) private window: Window) { }

  // 🅰️ Signal
  updateLanguageSignal(val: string) {
    return this.languageSignal.set(val)
  }

  updateTranslatorLanguageSignal(val: any) {
    return this.translatorLanguageSignal.set(val)
  }

  updateToastSignal(val: any) {
    return this.toastSignal.set(val)
  }

  updateKeysCryptoTimeLineSignal(val: TIMELINEKeysModel) {
    return this.keysCryptoTimeLineSignal.set(val)
  }


  updateChecksFilterIsActive(val: boolean) {
    return this.checksFilterIsActiveSignal.set(val)
  }

  updateActiveFilterSignal(val: IFilterCheckActive) {
    return this.activeFilterSignal.set(val)
  }

  updateGetTimeLineHttpSignal(val: boolean) {
    return this.getTimeLineHttpSignal.set(val)
  }

  updateTimeLineIndexDbErrorSignalSignal(val: boolean) {
    return this.timeLineIndexDbErrorSignalSignal.set(val)
  }


  // Usado para controlar níveis de acesso do último pagamento
  updateUserForAppSignal(val: UserForAppModel) {
    return this.userForAppSignal.set(val)
  }



  //🅿️ BehaviorSubject
  updateRedisAuth(val: RedisAuthModel) {
    return this.redisAuthSubject.next(val)
  }


  updateGetAllTimeLine(val: TimeLineModel) {
    return this.getAllTimeLineSubject.next(val)
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


