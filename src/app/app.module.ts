import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { CoreModule } from './core.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { environment } from 'src/environments/environment';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AppRoutingModule } from './app-routing.module';
import * as fromApp from './store/app.reducer';
import { SharedModule } from './common/shared.module';
import { AuthEffects } from './user/store/auth.effects';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { RecipesEffects } from './recipes/store/recipes.effects';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LandingPageComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot(fromApp.AppReducer),
    EffectsModule.forRoot([AuthEffects, RecipesEffects]),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    StoreRouterConnectingModule.forRoot(),
    SharedModule,
    CoreModule,
    BsDropdownModule.forRoot()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
