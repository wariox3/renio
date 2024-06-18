import {NgModule} from '@angular/core';
import {KeeniconComponent} from './keenicon/keenicon.component';
import {CommonModule} from "@angular/common";

@NgModule({
    imports: [
        CommonModule,
        KeeniconComponent,
    ],
    exports: [
        KeeniconComponent
    ]
})
export class SharedModule {
}
