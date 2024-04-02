import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TruncatePipe } from './pipes/truncate.pipe';
import { UniquePipe } from './pipes/unique.pipe';
import { DragScrollDirective } from './directives/drag-scroll.directive';

@NgModule({
  declarations: [
    TruncatePipe,
    UniquePipe,
    DragScrollDirective
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    TruncatePipe,
    UniquePipe,
    DragScrollDirective
  ],
  providers: [],
})
export class SharedModule { }
