import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as AuthActions from './store/auth.actions';
import * as fromApp from '../store/app.reducer';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenExpiration: any;

  constructor(private store: Store<fromApp.AppState>) { }

  setLogoutTimer(expiarationDuration: number) {
    this.tokenExpiration = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout());
    }, expiarationDuration);
  }

  clearLogoutTimer() {
    if (this.tokenExpiration) {
      clearTimeout(this.tokenExpiration);
      this.tokenExpiration = null;
    }
  }
}
