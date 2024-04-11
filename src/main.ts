import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppTimeLineModule } from './app/app-time-line.module';
import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';

if (environment.production) {
  enableProdMode();
  if(window){
    window.console.log = function(){};
    // window.console.warn = function(){};
    // window.console.error = function(){};
  }
}
platformBrowserDynamic().bootstrapModule(AppTimeLineModule)
  .catch(err => console.error(err));
