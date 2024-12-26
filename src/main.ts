import { enableProdMode, importProvidersFrom, isDevMode } from '@angular/core';
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
// import { errorHttpInterceptor } from '@interceptores/errorhttp.interceptor';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { httpErrorInterceptor } from '@interceptores/manejo-errores/http-error.interceptor';

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
      EffectsModule.forRoot(EffectsApp),
      StoreDevtoolsModule.instrument({
        maxAge: 25, // Retains last 25 states
        logOnly: !isDevMode(), // Restrict extension to log-only mode
        autoPause: true, // Pauses recording actions and state changes when the extension window is not open
        trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
        traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
      }),
    ),
    provideHttpClient(withInterceptors([tokenInterceptor, httpErrorInterceptor])),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
  ],
}).catch((err) => console.error(err));
