import { Inject, Injectable, InjectionToken, PLATFORM_ID } from '@angular/core';
import { WINDOW } from '../window.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
// https://stackoverflow.com/questions/54380886/how-we-can-access-cookies-in-angular-6-without-ngx-cookie-service
// https://stackoverflow.com/questions/34298133/angular-cookies

import * as CryptoJS5 from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class CookieService {

  documentIsAccessible: any;
  key: any = 'suaChaveSecreta'

  constructor(
    @Inject(WINDOW) private window: Window,
    // @Inject(DOCUMENT) private document: any,
    @Inject(PLATFORM_ID) private platformId: InjectionToken<Object>,
  ) {
    this.documentIsAccessible = isPlatformBrowser(this.platformId);
  }


  getEncryptedCookie(name: string): any | null {
    if (this.documentIsAccessible) {
      const cookieValue = this.get(name);
      if (cookieValue) {
        const decryptedValue = CryptoJS5.AES.decrypt(cookieValue, this.key).toString(CryptoJS5.enc.Utf8);
        return JSON.parse(decryptedValue);
      }

    }
    return null;
  }


  clearAllCookies(): void {
    if (this.documentIsAccessible) {
      const cookies = this.window.document.cookie.split(";");

      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        this.window.document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      }
    }
  }



  private get(name: string): string | null {
    const decodedCookies = decodeURIComponent(this.window.document.cookie).split(';');
    for (let i = 0; i < decodedCookies.length; i++) {
      const cookie = decodedCookies[i].trim();
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null;
  }

}