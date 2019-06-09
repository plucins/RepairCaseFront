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
  MatDividerModule, MatTabsModule, MatDialog, MatDialogModule, MatAutocompleteModule, MatSelectModule, MatExpansionModule, MatMenuModule
} from '@angular/material';
import { LoginUserComponent } from './login-user/login-user.component';
import { HeaderComponent } from './header/header.component';
import {RouterModule, Routes} from '@angular/router';
import {DialogOverviewExampleDialog, EquipmentDialog, HomeComponent} from './home/home.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthInterceptor} from './auth.interceptor';
import {LoginUserService} from './login-user/login-user.service';
import { RegisterUserComponent } from './register-user/register-user.component';


const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginUserComponent},
  {path: 'register', component: RegisterUserComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    LoginUserComponent,
    HeaderComponent,
    HomeComponent,
    DialogOverviewExampleDialog,
    EquipmentDialog,
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
    MatSelectModule,
    MatExpansionModule,
    MatMenuModule,
  ],

  entryComponents: [
    DialogOverviewExampleDialog,
    EquipmentDialog
  ],
  providers: [
    MatDialog,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    LoginUserComponent,
    LoginUserService,
    RegisterUserComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
