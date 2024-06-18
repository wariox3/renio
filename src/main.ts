import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { EffectsModule } from '@ngrx/effects';
import { StoreApp, EffectsApp } from './app/redux';
import { StoreModule } from '@ngrx/store';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app/app-routing.module';
import { ClipboardModule } from 'ngx-clipboard';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { tokenInterceptor } from '@interceptores/token.interceptor';
import {
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { errorHttpInterceptor } from '@interceptores/errorhttp.interceptor';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      ClipboardModule,
      AppRoutingModule,
      NgbModule,
      TranslateModule.forRoot(),
      InlineSVGModule.forRoot(),
      StoreModule.forRoot(StoreApp),
      EffectsModule.forRoot(EffectsApp)
    ),
    provideHttpClient(withInterceptors([tokenInterceptor, errorHttpInterceptor])),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
  ],
}).catch((err) => console.error(err));
