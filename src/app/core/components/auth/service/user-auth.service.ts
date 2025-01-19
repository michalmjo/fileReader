import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  constructor(private http: HttpClient) {}

  register(email: string, password: string) {
    const body = {
      email: email,
      password: password,
      returnSecureToken: true,
    };
    return this.http.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB2IdGL569MA3T1K4jjhvyfPUhJTAxgQ1s`,
      body
    );
  }

  logIn(email: string, password: string) {
    const body = {
      email: email,
      password: password,
      returnSecureToken: true,
    };
    return this.http.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB2IdGL569MA3T1K4jjhvyfPUhJTAxgQ1s`,
      body
    );
  }
}
