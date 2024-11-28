import { NgModule, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LogoutComponent } from './components/logout/logout.component';
import { AuthComponent } from './auth.component';

import { NgbActiveModal, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { ReiniciarClaveComponent } from './components/reiniciar-clave/reiniciar-clave.component';
import { VerificacionCuentaComponent } from './components/verificacion-cuenta/verificacion-cuenta.component';
import { BtnWhatsappComponent } from "@comun/componentes/btn-whatsapp/btn-whatsapp.component";
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        AuthRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgbDropdownModule,
        BtnWhatsappComponent,
        LoginComponent,
        RegistrationComponent,
        ForgotPasswordComponent,
        LogoutComponent,
        AuthComponent,
        ReiniciarClaveComponent,
        VerificacionCuentaComponent
    ]
})
export class AuthModule {}
