import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpParams,
} from '@angular/common/http';
import { exhaustMap, Observable, take } from 'rxjs';
import { UserAuthService } from './user-auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private userAuthService: UserAuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.userAuthService.user.pipe(
      take(1),
      exhaustMap((user) => {
        console.log(user);
        if (!user) {
          return next.handle(req);
        }
        const modifiedReq = req.clone({
          params: new HttpParams().set('auth', user?.token!),
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
