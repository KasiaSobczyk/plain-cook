import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { User } from 'src/app/common/models/user.model';
import { AuthService } from '../auth.service';

export interface ResponsePayload {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (expiresIn: number, email: string, localId: string, idToken: string) => {
  const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
  const user = new User(email, localId, idToken, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess({
    email,
    id: localId,
    token: idToken,
    expirationDate,
    redirect: true
  });
};

const handleError = (error: any) => {
  let errorMessage = 'An error occurred';
  if (!error.error || !error.error.error) {
    return of(new AuthActions.LoginFail(errorMessage));
  }
  switch (error.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'The email address is already in use by another account';
      break;
    case 'OPERATION_NOT_ALLOWED':
      errorMessage = 'Oppertation not allowed';
      break;
    case 'TOO_MANY_ATTEMPTS_TRY_LATER':
      errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'Email not found';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'The password is invalid';
      break;
    case 'USER_DISABLED':
      errorMessage = 'The user account has been disabled';
      break;
  }
  return of(new AuthActions.LoginFail(errorMessage));
};

@Injectable()
export class AuthEffects {
  @Effect()
  authSignUp = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((authData: AuthActions.SignupStart) => {
      return this.http.post<ResponsePayload>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAaCSCCPGl-lOXUTepegiXhL86gEx34ER8', {
        email: authData.payload.email,
        password: authData.payload.password,
        returnSecureToken: true
      })
        .pipe(
          tap(resData => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
          }),
          map(resData => {
            return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
          }),
          catchError(error => {
            return handleError(error);
          })
        );
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http
        .post<ResponsePayload>(
          'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAaCSCCPGl-lOXUTepegiXhL86gEx34ER8', {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        })
        .pipe(
          tap(resData => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
          }),
          map(resData => {
            return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
          }),
          catchError(error => {
            return handleError(error);
          })
        );
    }));

  @Effect()
  autoLogin = this.actions$.pipe(ofType(AuthActions.AUTO_LOGIN), map(() => {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return { type: 'DUMMY1' };
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );
    if (loadedUser.token) {
      const expiarationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.authService.setLogoutTimer(expiarationDuration);
      return new AuthActions.AuthenticateSuccess({
        email: loadedUser.email,
        id: loadedUser.id,
        token: loadedUser.token,
        expirationDate: new Date(userData._tokenExpirationDate),
        redirect: false
      });
    }
    return { type: 'DUMMY' };
  }));

  @Effect({ dispatch: false })
  loginRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTH_SUCCESS, AuthActions.LOGOUT),
    tap((authSucces: AuthActions.AuthenticateSuccess) => {
      if (authSucces.payload.redirect) {
        this.router.navigate(['/']);
      }
    }));

  @Effect({ dispatch: false })
  autoLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);
    })
  );

  constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService) { }
}
