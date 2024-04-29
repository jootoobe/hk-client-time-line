import { Injectable, Inject } from '@angular/core';
import { WINDOW } from './window.service';

@Injectable({
  providedIn: 'root'
})
export class DetectBrowserNameService {
  constructor(@Inject(WINDOW) private window: Window,) {
    this.detectBrowserName()
  }

  // https://www.positronx.io/angular-detect-browser-name-and-version-tutorial-example/
  detectBrowserName() {
    const agent = this.window.navigator.userAgent.toLowerCase()
    switch (true) {
      case agent.indexOf('edge') > -1:
        return 'edge';
      case agent.indexOf('opr') > -1 && !!(<any>this.window).opr:
        return 'opera';
      case agent.indexOf('chrome') > -1 && !!(<any>this.window).chrome:
        return 'chrome';
      case agent.indexOf('trident') > -1:
        return 'ie';
      case agent.indexOf('firefox') > -1:
        return 'firefox';
      case agent.indexOf('safari') > -1:
        return 'safari';
      default:
        return 'other';
    }
  }


}
