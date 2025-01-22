import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { appUser } from '../interface/appUser';
import { BehaviorSubject, catchError, Subject, tap, throwError } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  user = new BehaviorSubject<User | null>(null);
  private tokenExpirationTimer: any;
  constructor(private http: HttpClient, private router: Router) {}

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
          console.log('data redData');
          console.log(resData);
          this.handleAuth(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  // logout
  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }
  // autoLogin

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData')!);
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
      const expTime =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogOut(expTime);
      this.user.next(loadedUser);
    }
  }

  // autoLogout
  autoLogOut(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
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
    this.autoLogOut(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
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
