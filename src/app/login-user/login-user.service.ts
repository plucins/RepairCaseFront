import {Injectable} from '@angular/core';
import {ApplicationUser} from '../model/ApplicationUser';
import {Router} from '@angular/router';
import * as jwt_decode from 'jwt-decode';



@Injectable()
export class LoginUserService {

  loggedUser: ApplicationUser = new ApplicationUser();


  constructor(private router: Router)  {
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
}
