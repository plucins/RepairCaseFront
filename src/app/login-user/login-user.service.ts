import {Injectable} from '@angular/core';
import {ApplicationUser} from '../model/ApplicationUser';
import {Router} from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';


@Injectable()
export class LoginUserService {

  loggedUser: ApplicationUser = new ApplicationUser();
  userRegisterCorrectly = false;


  constructor(private router: Router, private http: HttpClient) {
  }


  isUserAuthorised(): boolean {
    if (localStorage.getItem('appUser') != null) {
      this.loggedUser = JSON.parse(localStorage.getItem('appUser'));
      return true;
    }
    return false;
  }

  logout() {
    if (this.isUserAuthorised()) {
      localStorage.clear();
      this.router.navigateByUrl('/');
    }
  }

  isTokenExpired(): boolean {
    const decoded = jwt_decode(this.loggedUser.token);
    return Math.floor(Date.now() / 1000) > decoded.exp;
  }

  register(user: ApplicationUser): Observable<ApplicationUser> {
    return this.http.post<ApplicationUser>('http://localhost:5000/api/auth/register', user);
  }


}
