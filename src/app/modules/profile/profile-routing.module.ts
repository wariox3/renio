import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './components/overview/overview.component';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { DocumentsComponent } from './documents/documents.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProfileComponent } from './profile.component';
import { ConnectionsComponent } from './connections/connections.component';
import { CambioClaveComponent } from '@modulos/seguridad/componentes/cambio-clave/cambio-clave.component';
import { FacturacionComponent } from './facturacion/facturacion.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      {
        path: 'resumen',
        component: OverviewComponent,
      },
      {
        path: 'seguridad',
        component: CambioClaveComponent,
      },
      {
        path: 'empresas',
        component: CampaignsComponent,
      },
      {
        path: 'facturacion',
        component: FacturacionComponent,
      },
      {
        path: 'documents',
        component: DocumentsComponent,
      },
      {
        path: 'connections',
        component: ConnectionsComponent,
      },
      {
        path: 'estado',
        loadComponent: () =>
          import('./components/facturacion-estado/facturacion-estado.component').then(
            (c) => c.FacturacionEstadoComponent
          ),
      },
      { path: '', redirectTo: 'resumen', pathMatch: 'full' },
      { path: '**', redirectTo: 'resumen', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
