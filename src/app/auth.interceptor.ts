import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {LoginUserComponent} from './login-user/login-user.component';
import {LoginUserService} from './login-user/login-user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private loginService: LoginUserService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.loginService.isUserAuthorised()) {

      if (this.loginService.isTokenExpired()) {
        this.loginService.logout();
      }


      const token = JSON.parse(localStorage.getItem('appUser')).token;
      const authReq = req.clone({
        headers: req.headers
          .set('Authorization', 'Bearer ' + token)
          .set('Accept', 'application/json')
          .set('Access-Control-Allow-Origin', 'http://localhost:4200')
          .set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS'),
      });
      return next.handle(authReq);
    }

    return next.handle(req);
  }

}
