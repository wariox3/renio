import { NgModule, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './modules/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { registerLocaleData } from '@angular/common';
import localeEsCo from '@angular/common/locales/es-CO';

import { StoreModule } from '@ngrx/store';
import { StoreApp } from './redux';


// function appInitializer(authService: AuthService) {
//   return () => {
//     return new Promise((resolve) => {
//       //@ts-ignore
//       authService.getUserByToken().subscribe().add(resolve);
//     });
//   };
// }

registerLocaleData(localeEsCo, 'es-CO');



@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot(),
    HttpClientModule,
    ClipboardModule,
    AppRoutingModule,
    InlineSVGModule.forRoot(),
    NgbModule,
    StoreModule.forRoot(StoreApp),

  ],
  providers: [
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: appInitializer,
    //   multi: true,
    //   deps: [AuthService],
    // },
    { provide: LOCALE_ID, useValue: 'es-CO' }

  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
