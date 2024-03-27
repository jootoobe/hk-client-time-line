import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule, createApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppTimeLineComponent } from './app-time-line.component';
import { AppTimeLineRoutingModule } from './app-time-line.routing';

// import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';




@NgModule({
  declarations: [
    AppTimeLineComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppTimeLineRoutingModule,
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


