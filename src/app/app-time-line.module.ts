import { NgModule } from '@angular/core';
import { HttpBackend, HttpClientModule } from '@angular/common/http';
import { createCustomElement } from '@angular/elements';
import { BrowserModule, createApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { AppTimeLineComponent } from './app-time-line.component';
import { AppTimeLineRoutingModule } from './app-time-line.routing';
import { environment } from '../environments/environment';

// import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


let urlTranslate = environment.urlTranslate


// https://snyk.io/advisor/npm-package/ngx-translate-multi-http-loader
export function HttpLoaderFactory(_httpBackend: HttpBackend) {
  return new MultiTranslateHttpLoader(_httpBackend, [
    // TIME-LINE
    { prefix: `${urlTranslate}/assets/i18n/TIME-LINE/canvas-time-line/top-div/`, suffix: ".json" },
    { prefix: `${urlTranslate}/assets/i18n/TIME-LINE/canvas-time-line/filter-flag/`, suffix: ".json" },
    { prefix: `${urlTranslate}/assets/i18n/TIME-LINE/canvas-time-line/create-flag/`, suffix: ".json" },
    { prefix: `${urlTranslate}/assets/i18n/TIME-LINE/canvas-time-line/flags-1-2/`, suffix: ".json" },
    { prefix: `${urlTranslate}/assets/i18n/TIME-LINE/canvas-time-line/components/modal-doublechecker/`, suffix: ".json" },

    // TOLLTIP HELPER
    { prefix: `${urlTranslate}/assets/i18n/TIME-LINE/canvas-time-line/tolltip-helper/tolltip-create-helper/`, suffix: ".json" },
    { prefix: `${urlTranslate}/assets/i18n/TIME-LINE/canvas-time-line/tolltip-helper/components/modal-doublechecker/`, suffix: ".json" },
    { prefix: `${urlTranslate}/assets/i18n/TIME-LINE/canvas-time-line/tolltip-helper/tolltip-helper-global/`, suffix: ".json" },

    // TOAST SERVICE
    { prefix: `${urlTranslate}/assets/i18n/TIME-LINE/canvas-time-line/toastr-service/`, suffix: ".json" },

  ]);
}

@NgModule({
  declarations: [
    AppTimeLineComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppTimeLineRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpBackend]
      }
    }),

  ],
  providers: [
    // provideAnimationsAsync() // esse cara gera chunks que quebram a aplicação principal.
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


