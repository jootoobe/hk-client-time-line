import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';

import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from './material.module';
import { CustomToolTipComponent } from './custom-tool-tip/custom-tool-tip.component';

@NgModule({
  declarations: [
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
    CustomToolTipComponent,

  ],
  providers: [
    DatePipe,
    ToastrService
  ],
})
export class ComponentsModule { }




