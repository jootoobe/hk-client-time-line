import { CommonModule } from '@angular/common';
import { HttpBackend } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

import { environment } from '../../../../environments/environment';
import { ComponentsModule } from '../../../components/components.module';
import { LanguagesTimeLineComponent } from '../../../settings/languages/languages.component';
import { FlagsSpiderComponent } from './flags-spider/flags-spider.component';
import { TopDivComponent } from './flags-spider/top-div/top-div.component';
import { TimeLineComponent } from './time-line.component';
import { TimeLineRoutingModule } from './time-line.routing';
import { FlagComponent } from './flags-spider/flag-1/flag.component';

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
    TimeLineComponent,
    FlagsSpiderComponent,
    TopDivComponent,
    LanguagesTimeLineComponent,
    FlagComponent
  ],
  imports: [
    CommonModule,
    TimeLineRoutingModule,
    ComponentsModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpBackend]
      }
    }),
  ],

  exports: [LanguagesTimeLineComponent]

})
export class TimeLineModule { }
