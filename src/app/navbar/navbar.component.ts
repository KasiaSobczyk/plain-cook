import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../user/store/auth.actions';
import * as RecipesAction from '../recipes/store/recipes.actions';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isAuth = false;
  collapsed = true;
  private userSub: Subscription;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.userSub = this.store.select('auth').pipe(map(authState => authState.user)).subscribe(userExist => {
      this.isAuth = !!userExist;
    });
  }

  onStoreRecipes() {
    this.store.dispatch( new RecipesAction.StoreData());
  }

  onFetchData() {
    this.store.dispatch(new RecipesAction.FetchRecipes());
  }

  onLogout() {
    this.store.dispatch( new AuthActions.Logout());
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
