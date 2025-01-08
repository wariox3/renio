import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './components/overview/overview.component';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { DocumentsComponent } from './documents/documents.component';
import { ProfileComponent } from './profile.component';
import { ConnectionsComponent } from './connections/connections.component';
import { CambioClaveComponent } from '@modulos/seguridad/paginas/cambio-clave/cambio-clave.component';

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
        path: 'documents',
        component: DocumentsComponent,
      },
      {
        path: 'connections',
        component: ConnectionsComponent,
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
