import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbOffcanvasModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalsModule, WidgetsModule } from '../../_metronic/partials';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
      },
    ]),
    WidgetsModule,
    ModalsModule,
    NgbOffcanvasModule,
    DashboardComponent,
  ],
})
export class DashboardModule {}
