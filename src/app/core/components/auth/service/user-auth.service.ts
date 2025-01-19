import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { appUser } from '../interface/appUser';
import { catchError, Subject, tap, throwError } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  user = new Subject<User>();
  constructor(private http: HttpClient) {}

  register(email: string, password: string) {
    const body = {
      email: email,
      password: password,
      returnSecureToken: true,
    };
    return this.http
      .post<appUser>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB2IdGL569MA3T1K4jjhvyfPUhJTAxgQ1s`,
        body
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuth(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  logIn(email: string, password: string) {
    const body = {
      email: email,
      password: password,
      returnSecureToken: true,
    };
    return this.http
      .post<appUser>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB2IdGL569MA3T1K4jjhvyfPUhJTAxgQ1s`,
        body
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuth(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  // daneUzytkownika

  private handleAuth(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
  }

  // obs bledow

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'Nieznany błąd';

    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'Email Istnieje';
        break;
      case 'INVALID_LOGIN_CREDENTIALS':
        errorMessage = 'Niepoprawne dane logowania';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'Nie ma takiego adresu email';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Hasło niepoprawne';
        break;
    }
    return throwError(errorMessage);
  }
}
