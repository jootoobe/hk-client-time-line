import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';

import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from './material.module';
import { CustomToolTipComponent } from './custom-tool-tip/custom-tool-tip.component';
import { CustomDateAdapter } from '../shared/utils/custom.date.adapter';
import { DateAdapter } from '@angular/material/core';
import { MatDatepickerTimeHeaderComponent } from './datepicker-time/mat-datepicker-time-header.component';
import { provideNgxMask } from 'ngx-mask';

@NgModule({
  declarations: [
    MatDatepickerTimeHeaderComponent,
    CustomToolTipComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,

    ToastrModule.forRoot({
      timeOut: 7000,
      positionClass: 'toast-bottom-center',
      preventDuplicates: true,
    }),


  ],

  exports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatDatepickerTimeHeaderComponent,
    CustomToolTipComponent,

  ],
  providers: [
    DatePipe,
    ToastrService,
    { provide: DateAdapter, useClass: CustomDateAdapter },
    provideNgxMask()
  ],
})
export class ComponentsModule { }




