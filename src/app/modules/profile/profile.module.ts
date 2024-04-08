import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { OverviewComponent } from './components/overview/overview.component';
import { ProjectsComponent } from './projects/projects.component';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { DocumentsComponent } from './documents/documents.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { ConnectionsComponent } from './connections/connections.component';
import { SeguridadModule } from '../seguridad/seguridad.module';
import {
  CardsModule,
  DropdownMenusModule,
  WidgetsModule,
} from '../../_metronic/partials';
import { SharedModule } from '../../_metronic/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAccordionModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '../../modules/i18n';
import { ModalsModule } from '../../_metronic/partials';
import { InformacionUsuarioComponent } from './components/informacion-usuario/informacion-usuario.component';
import { FacturacionComponent } from './facturacion/facturacion.component';
import { CargarImagenComponent } from '../../comun/componentes/cargar-imagen/cargar-imagen.component';
import { NgOptimizedImage } from '@angular/common';

@NgModule({
  declarations: [
    ProfileComponent,
    OverviewComponent,
    ProjectsComponent,
    CampaignsComponent,
    DocumentsComponent,
    ConnectionsComponent,
    InformacionUsuarioComponent,
    FacturacionComponent,
  ],
  providers: [NgbActiveModal],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    InlineSVGModule,
    DropdownMenusModule,
    WidgetsModule,
    CardsModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    SeguridadModule,
    TranslateModule,
    TranslationModule,
    ModalsModule,
    NgbAccordionModule,
    CargarImagenComponent,
    NgOptimizedImage
  ],
})
export class ProfileModule {}
