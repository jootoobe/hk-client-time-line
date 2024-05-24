import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { effect, Injectable } from '@angular/core';
import * as CryptoJS4 from 'crypto-js';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { TIMELINEKeysModel } from '../../../../models/cryptos/time-line-keys.model';
import { StateService } from '../../../../shared/services/state.service';
import { LocalStorageService } from '../../../../shared/services/storage/local-storage.service';
import { CookieService } from '../../../../shared/services/cookies/cookie.service';

// import { environment } from '../../../../../environments/environment';

@Injectable()
export class SignInService {
  redisAuth: any
  API_IAM: string = environment.ApiIam;
  API_TIME_LINE: string = environment.ApiTimeLine;

  timeLineKeys!: TIMELINEKeysModel
  constructor(
    private http: HttpClient,
    private stateService: StateService,
    private localStorageService: LocalStorageService,
    private cookieService: CookieService
  ) {
    effect(() => {
      this.timeLineKeys = this.stateService.keysCryptoTimeLineSignalComputed()
    })

  }


  devSignIn(val: any): Observable<any> {

    let date = new Date()
    // '3600' == 1hs
    let expiresToken = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
      date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds() + 3000); // 50 minutos um pouco menos de 1hs

    // 86400 = 24hs X 3 dias == 259200
    let expiresRefreshToken = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
      date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds() + 259200); // 3 dias

    // it = iam + token
    // iat = iam + accessToken
    // irt = iam + refreshTokens
    // irt_id = iam + refreshTokens + id
    // skich = Spider + Key + iam + criptografia + header // Chave para o fronte uma vez que o angular não deixa pegar o Set-Cookie eu pelo menos não consegui.
    this.redisAuth = {
      email: val.email, // email
      skich: '', //skich
      sub: '', // sub
      irt_id: '',
      iat: '', // iam + accessToken
      irt: '', // iam + refreshTokenId
      password_changed_times: 0,
      password: val.password,// ? password
      expires: {
        token: expiresToken,
        refresh_token: expiresRefreshToken,
      },
    }


    let neyBody: any = this.encryptAuthenticationServicel(this.redisAuth, `${this.timeLineKeys.SICK}`)

    let newVal = {
      email: val.email, // email
      a: neyBody.a,
      id: 2 // esses id server para o guarda do back @UseGuards(DecryptAuthentication) saber a chave de descriptografia
    }

    return this.http.post<any>(`${this.API_IAM}/auth/sign-in`, newVal, { observe: 'response' }).pipe(
      map((res: any) => {
        let skich = res.headers.get('skich');
        this.setData(skich, res.body, `${this.timeLineKeys.SICK}`)
      }),
      // retry(1),
      // catchError(this.handleError)
    );
  }

  setData(skich: string, resBody: any, decryptKey: string) {

    this.cookieService.clearAllCookies()

    let outputLetter = skich.charAt(0); // pego a letra a,b,c,d....
    // let newStr = skich.substring(1) // retiro da chave do token a primeira letra
    // skich = newStr // chave sem a primeira letra
    // console.log('KEY', skich)

    let newRes: any = this.decryptAuthenticationService(resBody, decryptKey)

    if (skich && resBody && resBody.a && newRes && newRes.email) {

      let randomUUID = this.stateService.getUniqueId(6)

      this.redisAuth = {
        email: newRes.email, // email

        skich: skich, //skich não tirei a letra inicial
        sub: newRes.sub, // sub
        irt_id: '123456789', // refresh_token_id
        iat: '123456789', // iat = iam + accessToken
        irt: '123456789', //irt = iam + refreshTokenId
        password_changed_times: newRes.password_changed_times, // password_changed_times
        password: '', // ? password
        expires: {
          token: (newRes?.expires?.token), // -2960000
          refresh_token: newRes?.expires?.refresh_token,
        },
      }

      let redisAuth2 = {
        irt_id: newRes.irt_id, // refresh_token_id
        iat: newRes.iat, // iat = iam + accessToken
        irt: newRes.irt, //irt = iam + refreshTokenId
      }

      // localStorage
      // this.localStorageService.setItems('a', this.redisAuth, this.IAMEncryptDecryptKey.LS.ss) // outputLetter tem que ser removida da chave skich
      localStorage.setItem('al', outputLetter + randomUUID)

      // #Cookie
      this.cookieService.setEncryptedCookie(outputLetter, redisAuth2, 3, '/', '', true, 'Strict'); // exdays 3 dias
      this.cookieService.setEncryptedCookie('v1', this.redisAuth, 3, '/', '', true, 'Strict'); // exdays 3 dias

    }
  }

  encryptAuthenticationServicel(inBody: any, key: any) {
    try {
      const iamEncrypt: any = CryptoJS4.AES.encrypt(JSON.stringify(inBody), key,
        {
          keySize: 128 / 8,
          iv: key,
          mode: CryptoJS4.mode.CBC,
          padding: CryptoJS4.pad.Pkcs7
        }).toString();
      return { a: iamEncrypt }
    } catch (error) {
      return { a: '' }
    }

  }

  decryptAuthenticationService(inBody: any, key: string) {
    try {
      let decrypted = undefined;
      decrypted = CryptoJS4.AES.decrypt(inBody.a, key);
      const iam = decrypted.toString(CryptoJS4.enc.Utf8);
      return JSON.parse(iam)
    } catch (error) {
      return { a: '' }
    }


  }

  // Teste autenticação apis
  // Após autenticar é chamado o GET para testar o AuthGruard da api
  getHelloWorld(): Observable<any> {
    return this.http.get(this.API_TIME_LINE + '/get-hello')
  }




}
