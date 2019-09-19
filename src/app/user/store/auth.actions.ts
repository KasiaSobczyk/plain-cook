import { Action } from '@ngrx/store';

export const AUTH_SUCCESS = '[Auth] Authenticate Success';
export const AUTH_FAIL = '[Auth] Authenticate Fail';
export const SIGNUP_START = '[Auth] Signup Start';
export const LOGOUT = '[Auth] Logout';
export const LOGIN_START = '[Auth] Login Start';
export const ERROR_HANDLE = '[Auth] Error Handle';
export const AUTO_LOGIN = '[Auth] Auto Login';

export class AuthenticateSuccess implements Action {
  readonly type = AUTH_SUCCESS;

  constructor(public payload: {
    email: string;
    id: string;
    token: string;
    expirationDate: Date;
    redirect: boolean;
  }) { }
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class SignupStart implements Action {
  readonly type = SIGNUP_START;

  constructor(public payload: { email: string; password: string }) { }
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(public payload: { email: string; password: string }) { }
}

export class LoginFail implements Action {
  readonly type = AUTH_FAIL;

  constructor(public payload: string) { }
}

export class ErrorHandle implements Action {
  readonly type = ERROR_HANDLE;
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}

export type AuthActions = AuthenticateSuccess | Logout | SignupStart | LoginStart | LoginFail | ErrorHandle | AutoLogin;
