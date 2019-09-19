import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  loginMode = true;
  isLoading = false;
  error: string = null;
  storeSub: Subscription;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
    });
  }

  onSwitchMode() {
    this.loginMode = !this.loginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;
    if (this.loginMode) {
      this.store.dispatch(new AuthActions.LoginStart({ email, password }));
    } else {
      this.store.dispatch(new AuthActions.SignupStart({ email, password }));
    }
    form.reset();
  }

  onCloseAlert() {
    this.store.dispatch( new AuthActions.ErrorHandle());
  }

  ngOnDestroy() {
    this.storeSub.unsubscribe();
  }
}
