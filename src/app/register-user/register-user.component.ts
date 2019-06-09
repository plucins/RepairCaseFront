import {Component, Injectable, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoginUserService} from '../login-user/login-user.service';
import {ApplicationUser} from '../model/ApplicationUser';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})

@Injectable()
export class RegisterUserComponent implements OnInit {


  user: ApplicationUser = new ApplicationUser();
  registerForm: FormGroup;
  userAlreadyExist = false;


  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router, private authService: LoginUserService) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: ['', Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')],
      password: ['', Validators.pattern('^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&-]).{8,}$')]
    });
  }


  register() {
    this.authService.register(this.user).subscribe(
      data => {
        console.log(data);
        this.authService.userRegisterCorrectly = true;
        this.router.navigate(['/']);
      },
      err => {
        if (err.status === 400) {
          this.userAlreadyExist = true;
        }
      }
    );
  }

}
