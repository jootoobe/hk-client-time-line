import { Inject, Injectable, InjectionToken, PLATFORM_ID } from '@angular/core';
import { WINDOW } from '../window.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
// https://stackoverflow.com/questions/54380886/how-we-can-access-cookies-in-angular-6-without-ngx-cookie-service
// https://stackoverflow.com/questions/34298133/angular-cookies

import * as CryptoJS4 from 'crypto-js';


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


  setEncryptedCookie(name: string, value: any, exdays: number | Date, path: string = '/', domain: string = '', secure: boolean = false, sameSite: 'Lax' | 'Strict' = 'Lax'): void {
    if (this.documentIsAccessible) {
      const stringValue = JSON.stringify(value);
      const encryptedValue = CryptoJS4.AES.encrypt(stringValue, this.key,
        {
          keySize: 128 / 8,
          iv: this.key,
          mode: CryptoJS4.mode.CBC,
          padding: CryptoJS4.pad.Pkcs7
        }).toString();
      this.set(name, encryptedValue, exdays, path, domain, secure, sameSite);
    }
  }

  getEncryptedCookie(name: string): any | null {
    if (this.documentIsAccessible) {
      const cookieValue = this.get(name);
      if (cookieValue) {
        const decryptedValue = CryptoJS4.AES.decrypt(cookieValue, this.key).toString(CryptoJS4.enc.Utf8);
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


  private set(name: string, value: string, exdays?: number | Date, path?: string, domain?: string, secure?: boolean, sameSite?: 'Lax' | 'Strict'): void {
    if (this.documentIsAccessible) {
      let cookieString = name + "=" + encodeURIComponent(value);

      if (exdays) {
        if (exdays instanceof Date) {
          cookieString += "; expires=" + exdays.toUTCString();
        } else {
          const expirationDate = new Date();
          expirationDate.setTime(expirationDate.getTime() + (exdays * 24 * 60 * 60 * 1000));
          cookieString += "; expires=" + expirationDate.toUTCString();
        }
      }

      if (path) {
        cookieString += "; path=" + path;
      }

      if (domain) {
        cookieString += "; domain=" + domain;
      }

      if (secure) {
        cookieString += "; secure";
      }

      if (sameSite) {
        cookieString += "; SameSite=" + sameSite;
      }

      this.window.document.cookie = cookieString;
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