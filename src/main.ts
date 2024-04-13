import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { TokenInterceptor } from './app/interceptors/token.interceptor';
import { provideRouter } from '@angular/router';
import { routes } from './app/route';
import { provideAnimations } from '@angular/platform-browser/animations';

import { provideToastr } from 'ngx-toastr';

  bootstrapApplication(AppComponent, {
    providers: [
     
      importProvidersFrom(HttpClientModule),{
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
  },provideRouter(routes),
  provideAnimations(), // required animations providers
  provideToastr() // Toastr providers
],

  }).catch((err) => console.error(err));
