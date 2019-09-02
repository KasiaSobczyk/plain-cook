import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from '../common/models/user.model';
import { Router } from '@angular/router';

export interface ResponsePayload {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpiration: any;

  constructor(private http: HttpClient, private router: Router) { }

  signup(email: string, password: string) {
    return this.http.post<ResponsePayload>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAaCSCCPGl-lOXUTepegiXhL86gEx34ER8', {
        email: email,
        password: password,
        returnSecureToken: true
      }).pipe(catchError(this.errorRes), tap(res => {
        this.authUser(res.email, res.localId, res.idToken, +res.expiresIn);
      }));
  }

  login(email: string, password: string) {
    return this.http.post<ResponsePayload>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAaCSCCPGl-lOXUTepegiXhL86gEx34ER8', {
        email: email,
        password: password,
        returnSecureToken: true
      }).pipe(catchError(this.errorRes), tap(res => {
        this.authUser(res.email, res.localId, res.idToken, +res.expiresIn);
      }));
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');

    if (this.tokenExpiration) {
      clearTimeout(this.tokenExpiration);
    }

    this.tokenExpiration = null;
  }

  autoLogin() {
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);

      const expiarationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expiarationDuration);
    }
  }

  autoLogout(expiarationDuration: number) {
    this.tokenExpiration = setTimeout(() => {
      this.logout();
    }, expiarationDuration);
  }

  private authUser(email: string, id: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, id, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private errorRes(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (!error.error || !error.error.error) {
      return throwError(errorMessage);
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
    return throwError(errorMessage);
  }
}
