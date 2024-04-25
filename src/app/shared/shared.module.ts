import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TruncatePipe } from './pipes/truncate.pipe';
import { UniquePipe } from './pipes/unique.pipe';
import { DragScrollDirective } from './directives/drag-scroll.directive';
import { SafeDomSanitizerPipe } from './pipes/safe-domSanitizer.pipe';
import { ToolTipRendererChieldDirective } from './directives/custom-tooltip/tooltip-renderer-chield.directive';
import { ToolTipRendererDirective } from './directives/custom-tooltip/tooltip-renderer.directive';
import { TrimDirective } from './directives/trim.directive';
import { MaskDateDirective } from './directives/mask-datepicker.directive';
import { UniqueSpecificPipe } from './pipes/unique-specific.pipe';

@NgModule({
  declarations: [
    TruncatePipe,
    UniquePipe,
    DragScrollDirective,
    SafeDomSanitizerPipe,
    ToolTipRendererChieldDirective,
    ToolTipRendererDirective,
    TrimDirective,
    MaskDateDirective,
    UniqueSpecificPipe,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    TruncatePipe,
    UniquePipe,
    DragScrollDirective,
    SafeDomSanitizerPipe,
    ToolTipRendererChieldDirective,
    ToolTipRendererDirective,
    TrimDirective,
    MaskDateDirective,
    UniqueSpecificPipe
  ],
  providers: [],
})
export class SharedModule { }
