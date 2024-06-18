import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {InlineSVGModule} from 'ng-inline-svg-2';
import {PurchaseToolbarComponent} from "./purchase-toolbar/purchase-toolbar.component";
import {ExploreMainDrawerComponent} from './explore-main-drawer/explore-main-drawer.component';
import {HelpDrawerComponent} from "./help-drawer/help-drawer.component";
import {SharedModule} from "../../../shared/shared.module";
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
    imports: [
        CommonModule,
        InlineSVGModule,
        RouterModule,
        SharedModule,
        TranslateModule,
        ExploreMainDrawerComponent,
        HelpDrawerComponent,
        PurchaseToolbarComponent
    ],
    exports: [
        ExploreMainDrawerComponent,
        HelpDrawerComponent,
        PurchaseToolbarComponent
    ],
})
export class EngagesModule {
}
