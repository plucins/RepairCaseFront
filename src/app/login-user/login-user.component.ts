import {Component, Injectable, OnInit} from '@angular/core';
import {ApplicationUser} from '../model/ApplicationUser';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {LoginUserService} from './login-user.service';

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.css']
})

@Injectable()
export class LoginUserComponent implements OnInit {

  user: ApplicationUser = new ApplicationUser();

  userNotFound = false;
  loginForm: FormGroup;

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private router: Router, private userService: LoginUserService) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')],
      password: ['', Validators.pattern('^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&-]).{8,}$')],
    });
  }

  login() {
    this.http.post<ApplicationUser>('http://localhost:5000/api/auth/login', this.user).subscribe(
      data => {
        this.userService.loggedUser = data;
        localStorage.setItem('appUser', JSON.stringify(data));
        this.router.navigate(['/']);
      },
      err => {
        if (err.status === 404) {
          this.userNotFound = true;
        }
      }
    )
    ;
  }

}
