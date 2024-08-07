import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule, createApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppTimeLineComponent } from './app-time-line.component';
import { AppTimeLineRoutingModule } from './app-time-line.routing';
import { DevSignInComponent } from './spider-share/iam/components/auth/dev-sign-in/dev-sign-in.component';
import { HttpInterceptorService } from './spider-share/iam/services/interceptor/http-interceptor.service';
import { ToastrModule } from 'ngx-toastr';

// import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';




@NgModule({
  declarations: [
    AppTimeLineComponent,
    DevSignInComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppTimeLineRoutingModule,

    ToastrModule.forRoot({
      timeOut: 7000,
      positionClass: 'toast-bottom-center',
      preventDuplicates: true,
    }),
  ],
  providers: [
    // provideAnimationsAsync() // esse cara gera chunks que quebram a aplicação principal.
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService,  multi: true  },

  ],
  bootstrap: [AppTimeLineComponent]
})
export class AppTimeLineModule {
  // constructor(private injector: Injector) { }
  // dessa forma tenho que ficar comentando   bootstrap: [AppTimeLineComponent], - produção é melhor sem
  // local tem que ter bootstrap: [AppTimeLineComponent]
  // ngDoBootstrap() {
  //   const element = createCustomElement(AppTimeLineComponent, {
  //     injector: this.injector,
  //   });
  //   customElements.define('app-time-line', element);
  // }
  ngDoBootstrap() {
    (async () => {
      const app = await createApplication({
        providers: []
      })
      const inputElement = createCustomElement(AppTimeLineComponent, {
        injector: app.injector,
      });
      customElements.define('app-time-line', inputElement);
    })()
  }
}


