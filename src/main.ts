import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppTimeLineModule } from './app/app-time-line.module';


platformBrowserDynamic().bootstrapModule(AppTimeLineModule)
  .catch(err => console.error(err));
