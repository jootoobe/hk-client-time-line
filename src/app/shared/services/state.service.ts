import { CreateSignalOptions, Inject, WritableSignal, computed, signal } from '@angular/core';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WINDOW } from './window.service';
import { RedisAuthModel } from '../../models/auth/redis-auth.model';


@Injectable({
  providedIn: 'root'
})
export class StateService {

  //just take the acronyms en, pt, es from the translator
  private languageSignal: WritableSignal<string> = signal<string>('');
  languageSignalComputed = computed(() => {
    return this.languageSignal()
  });


  private toastSignal: WritableSignal<{}> = signal<any>(undefined);
  toastSignalComputed = computed(() => {
    return this.toastSignal()
  });


  private loaderSignal: WritableSignal<boolean> = signal<any>(false);
  loaderSignalComputed = computed(() => {
    return this.loaderSignal()
  });


  private bodyTrimmedSignal: WritableSignal<boolean> = signal<any>(false);
  bodyTrimmedSignalComputed = computed(() => {
    return this.bodyTrimmedSignal()
  });

  // Vai no header da aplicação
  private redisAuthSubject = new BehaviorSubject<RedisAuthModel>(RedisAuthModel as any);
  redisAuthSubject$ = this.redisAuthSubject.asObservable();

  constructor(@Inject(WINDOW) private window: Window) { }

  updateLanguageSignal(val: string) {
    return this.languageSignal.set(val)
  }

  updateToastSignal(val: any) {
    return this.toastSignal.set(val)
  }

  updateloaderSignal(val: boolean) {
    return this.loaderSignal.set(val)
  }

  updateRedisAuth(val: RedisAuthModel) {
    return this.redisAuthSubject.next(val)
  }

  updatebodyTrimmed(val: boolean) {
    return this.bodyTrimmedSignal.set(val)
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




  // ============== inject and remove the microservices scripts ===============
  // =============================================================================

  addScript(val: string, env: string) {

    let node = this.window.document.createElement('script');
    node.src = env;
    node.className = val;
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    this.window.document.getElementsByTagName('body')[0].appendChild(node);
  }


  removeScript(val: string) {
    let element: any = this.window.document.getElementsByClassName(val);

    for (var i = element.length - 1; 0 <= i; i--) {
      if (element[i]) {
        element[i].remove()
      } else if (element[i].parentElement) {
        element[i].parentElement.removeChild(element[i]);
      }
    }
  }
}



