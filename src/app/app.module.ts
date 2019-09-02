import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CoreModule } from './core.module';
import { AppRoutingModule } from './app-routing.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { shoppingListReducer } from './shopping-list/store/shopping-list.reducer';
import { SharedModule } from './common/shared.module';
import * as fromShoppingList from './shopping-list/store/shopping-list.reducer';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot({shoppingList: shoppingListReducer}),
    SharedModule,
    CoreModule,
    BsDropdownModule.forRoot()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
