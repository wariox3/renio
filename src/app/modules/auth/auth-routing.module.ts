import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { EmpresaComponent } from './components/empresa-lista/empresa.component';
import { EmpresaNuevoComponent } from './components/empresa-nuevo/empresa-nuevo.component';
import { LogoutComponent } from './components/logout/logout.component';
import { VerificacionCuentaComponent } from './components/verificacion-cuenta/verificacion-cuenta.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'registration',
        component: RegistrationComponent,
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
      },
      {
        path: 'logout',
        component: LogoutComponent,
      },
      {
        path: 'empresa',
        component: EmpresaComponent,
      },
      {
        path: 'empresa/nuevo',
        component: EmpresaNuevoComponent,
      },
      {
        path: 'varificacion/:token',
        component: VerificacionCuentaComponent
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: '**', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
