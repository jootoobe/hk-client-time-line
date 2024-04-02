import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TruncatePipe } from './pipes/truncate.pipe';
import { UniquePipe } from './pipes/unique.pipe';

@NgModule({
  declarations: [
    TruncatePipe,
    UniquePipe
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    TruncatePipe,
    UniquePipe
  ],
  providers: [],
})
export class SharedModule { }
