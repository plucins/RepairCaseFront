import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatInputModule,
  MatFormFieldModule,
  MatIconModule,
  MatCardModule,
  MatDividerModule, MatTabsModule, MatDialog, MatDialogModule, MatAutocompleteModule
} from '@angular/material';
import { LoginUserComponent } from './login-user/login-user.component';
import { HeaderComponent } from './header/header.component';
import {RouterModule, Routes} from '@angular/router';
import {DialogOverviewExampleDialog, HomeComponent} from './home/home.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthInterceptor} from './auth.interceptor';
import {LoginUserService} from './login-user/login-user.service';
import { RegisterUserComponent } from './register-user/register-user.component';


const appRoutes: Routes = [
  {path: 'login', component: LoginUserComponent},
  {path: '', component: HomeComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    LoginUserComponent,
    HeaderComponent,
    HomeComponent,
    DialogOverviewExampleDialog,
    RegisterUserComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    RouterModule.forRoot(appRoutes),
    MatCardModule,
    MatDividerModule,
    HttpClientModule,
    MatTabsModule,
    MatDialogModule,
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
  ],

  entryComponents: [
    DialogOverviewExampleDialog
  ],
  providers: [
    MatDialog,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    LoginUserComponent,
    LoginUserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
