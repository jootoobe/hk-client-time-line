import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TruncatePipe } from './pipes/truncate.pipe';

@NgModule({
  declarations: [
    TruncatePipe
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    TruncatePipe
  ],
  providers: [],
})
export class SharedModule { }
