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
import {
  CardsModule,
  DropdownMenusModule,
  WidgetsModule,
} from '../../_metronic/partials';
import { SharedModule } from '../../_metronic/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAccordionModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ModalsModule } from '../../_metronic/partials';
import { InformacionUsuarioComponent } from './components/informacion-usuario/informacion-usuario.component';
import { CargarImagenComponent } from '../../comun/componentes/cargar-imagen/cargar-imagen.component';
import { NgOptimizedImage } from '@angular/common';
import { SkeletonLoadingComponent } from '@comun/componentes/skeleton-loading/skeleton-loading.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { CambioClaveComponent } from '@modulos/seguridad/paginas/cambio-clave/cambio-clave.component';

@NgModule({
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
        CambioClaveComponent,
        TranslateModule,
        ModalsModule,
        NgbAccordionModule,
        CargarImagenComponent,
        NgOptimizedImage,
        SkeletonLoadingComponent,
        NgxMaskPipe,
        NgxMaskDirective,
        ProfileComponent,
        OverviewComponent,
        ProjectsComponent,
        CampaignsComponent,
        DocumentsComponent,
        ConnectionsComponent,
        InformacionUsuarioComponent,
    ],
    providers: [NgbActiveModal, provideNgxMask()],
})
export class ProfileModule {}
