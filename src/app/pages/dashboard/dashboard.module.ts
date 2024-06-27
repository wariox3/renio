import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ModalsModule, WidgetsModule } from '../../_metronic/partials';
import {  NgbOffcanvasModule } from '@ng-bootstrap/ng-bootstrap';
import { General } from '@comun/clases/general';
import { obtenerEmpresRededoc_id } from '@redux/selectors/empresa.selectors';

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
        DashboardComponent
    ],
})
export class DashboardModule {}
