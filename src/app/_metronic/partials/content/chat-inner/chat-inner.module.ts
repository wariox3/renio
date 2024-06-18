import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ChatInnerComponent } from './chat-inner.component';

@NgModule({
    imports: [CommonModule, InlineSVGModule, ChatInnerComponent],
    exports: [ChatInnerComponent],
})
export class ChatInnerModule {}
