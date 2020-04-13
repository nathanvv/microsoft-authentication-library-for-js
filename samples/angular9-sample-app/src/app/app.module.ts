import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProfileComponent } from './profile/profile.component';

import {
  MsalModule,
  MsalInterceptor,
  MSAL_CONFIG,
  MSAL_CONFIG_ANGULAR,
  MsalService,
  MsalAngularConfiguration
} from '@azure/msal-angular';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { Configuration } from 'msal';

export const protectedResourceMap: [string, string[]][] = [
  ['https://app.vssps.visualstudio.com/', ['https://app.vssps.visualstudio.com/.default']],
  ['https://graph.microsoft.com/v1.0/me', ['user.read']]
];

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

function MSALConfigFactory(): Configuration {
  return {
    auth: {
      clientId: '4704ff31-c6dd-401e-90d3-fee2fe1c8175',
      authority: 'https://login.microsoftonline.com/5c5f7972-a019-4086-9878-29a561ddc360',
      validateAuthority: true,
      redirectUri: 'http://localhost:4200/',
      postLogoutRedirectUri: 'http://localhost:4200/',
      navigateToLoginRequestUrl: true,
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: isIE, // set to true for IE 11
    },
  };
}

function MSALAngularConfigFactory(): MsalAngularConfiguration {
  return {
    popUp: !isIE,
    consentScopes: [
      'user.read',
      'openid',
      'profile',
      'api://a88bb933-319c-41b5-9f04-eff36d985612/access_as_user',
      // 'https://dev.azure.com',
      // 'https://dev.azure.com/renweb/_apis',
      '499b84ac-1321-427f-aa17-267ca6975798/user_impersonation',
      '499b84ac-1321-427f-aa17-267ca6975798/.default',
      'https://app.vssps.visualstudio.com/user_impersonation',
      'https://app.vssps.visualstudio.com/default'
    ],
    unprotectedResources: ['https://www.microsoft.com/en-us/'],
    protectedResourceMap,
    extraQueryParameters: {}
  };
}

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatListModule,
    AppRoutingModule,
    MsalModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: MSAL_CONFIG,
      useFactory: MSALConfigFactory
    },
    {
      provide: MSAL_CONFIG_ANGULAR,
      useFactory: MSALAngularConfigFactory
    },
    MsalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
