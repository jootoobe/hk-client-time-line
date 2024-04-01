import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { effect, Injectable } from '@angular/core';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';

import { StateService } from '../../../../shared/services/state.service';
import { RedisAuthModel } from '../../models/auth/redis-auth.model';

// https://itnext.io/migrate-angular-interceptors-to-function-based-interceptors-90bd433e0c2a

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  authToken!: Subscription;
  redisAuth!: RedisAuthModel
  constructor(private stateService: StateService) {
    // Get the auth token from the service.
    this.stateService.redisAuthSubject$
      .subscribe({
        next: (res: RedisAuthModel) => {
          this.redisAuth = res
        },
        error: (err) => {
        },
        complete: () => {
        }
      })

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    // if (req.url.includes('https://www.tiktok.com') ||
    //   req.url.includes('https://www.tiktok.com/oembed?url=https://www.tiktok.com')) {
    //   return next.handle(req)
    // }


    // if(req.url.includes('api-iam/auth/rf')) {
    //   localStorage.setItem('rf', 'true')
    // }


    if (this.redisAuth.iat && this.redisAuth.skich) {
      console.log('````````````````',this.redisAuth)
      const authReq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + this.redisAuth.iat)
          .set('skich', this.redisAuth.skich)

      });

      return next.handle(authReq)
    }


    return next.handle(req)
  }

}
